"""
SupplyGuardian AI — Agent Orchestrator
=======================================
Coordinates Strands-compatible agents through the full procurement workflow.

Execution path (what actually runs when Judge Mode calls /workflow/full-procurement):
  1. Planner Agent → creates plan, records intent
  2. Research Agent → calls search_suppliers tool → returns candidate list
  3. Risk Agent → calls evaluate_supplier_risk for EACH candidate → filters HIGH risk
  4. Negotiation Agent → calls generate_negotiation_counter_offer → calculates savings
  5. Policy Gate → checks if value > threshold → triggers approval if needed

Context is passed forward between agents (candidates from Research → Risk → Negotiation).
A single AgentExecutionTrace is shared across all agents for the live UI trace.
"""

from typing import Any, Dict, List, Optional
import asyncio
from datetime import datetime, timezone
import structlog

from app.core.strands import Agent, Tool, AgentExecutionTrace
from app.agents.tools import (
    search_suppliers,
    evaluate_supplier_risk,
    generate_negotiation_counter_offer,
    request_human_approval,
    SearchSuppliersInput,
    EvaluateSupplierRiskInput,
    CounterOfferInput,
)

logger = structlog.get_logger()

APPROVAL_THRESHOLD = 100_000  # USD


class AgentOrchestrator:
    """Coordinates Strands AI agents in the SupplyGuardian ecosystem."""

    def __init__(self, openai_api_key: Optional[str] = None):
        self.api_key = openai_api_key

        # Define Tools — these are real callable functions, not stubs
        self._tool_search = Tool(
            name="search_suppliers",
            description="Search for suppliers based on item and quantity requirements.",
            func=search_suppliers,
        )
        self._tool_risk = Tool(
            name="evaluate_supplier_risk",
            description="Evaluate compliance and risk for a named supplier.",
            func=evaluate_supplier_risk,
        )
        self._tool_negotiate = Tool(
            name="generate_negotiation_counter_offer",
            description="Generate a deterministic counter-offer given current and target price.",
            func=generate_negotiation_counter_offer,
        )
        self._tool_approval = Tool(
            name="request_human_approval",
            description="Create a human approval request for consequential procurement decisions.",
            func=request_human_approval,
        )

        # Define Agents — each receives only the tools relevant to its role
        self.agents = {
            "planner": Agent(
                name="Procurement Planner Agent",
                role="Orchestrator",
                goal="Plan and coordinate procurement tasks.",
                tools=[self._tool_search, self._tool_risk, self._tool_negotiate, self._tool_approval],
            ),
            "supplier_discovery": Agent(
                name="Supplier Research Agent",
                role="Researcher",
                goal="Discover and rank suppliers based on item requirements.",
                tools=[self._tool_search],
            ),
            "risk_compliance": Agent(
                name="Risk & Compliance Agent",
                role="Risk Assessor",
                goal="Assess supplier risk and filter out non-compliant suppliers.",
                tools=[self._tool_risk],
            ),
            "negotiation": Agent(
                name="Negotiation Agent",
                role="Negotiator",
                goal="Negotiate supplier quotes to achieve target pricing.",
                tools=[self._tool_negotiate],
            ),
            "human_approval": Agent(
                name="Approval Center Agent",
                role="Approver",
                goal="Route consequential decisions to human managers for review.",
                tools=[self._tool_approval],
            ),
        }

        # Aliases for backward-compat with older API endpoints
        self.agents["market_intelligence"] = self.agents["supplier_discovery"]
        self.agents["vendor_intelligence"] = self.agents["risk_compliance"]
        self.agents["esg"] = self.agents["risk_compliance"]
        self.agents["finance"] = self.agents["planner"]
        self.agents["logistics"] = self.agents["planner"]
        self.agents["executive_advisor"] = self.agents["planner"]
        self.agents["disruption_prediction"] = self.agents["planner"]
        self.agents["alternative_supplier"] = self.agents["supplier_discovery"]

    async def run_agent(self, agent_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Run a specific agent with given context."""
        agent = self.agents.get(agent_name, self.agents["planner"])
        logger.info("orchestrator_run_agent", agent=agent.name)

        trace = AgentExecutionTrace()
        response = await agent.run(context, trace=trace)

        return {
            "agent": agent.name,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "result": response.get("result", {}),
            "actions_taken": response.get("actions_taken", []),
            "trace": response.get("trace", []),
            "confidence": response.get("confidence", 0.95),
        }

    async def run_full_procurement_workflow(
        self, item: str, quantity: int, estimated_value: float
    ) -> Dict[str, Any]:
        """
        Run the complete Strands end-to-end procurement workflow.

        Context flows forward between agents:
          - Research produces: candidates list
          - Risk consumes candidates, produces: cleared_suppliers, blocked_suppliers
          - Negotiation consumes top cleared candidate, produces: counter_price, total_savings
          - Policy gate evaluates final value, triggers approval if > threshold
        """
        # Shared trace object — real events from every agent appear here
        trace = AgentExecutionTrace()
        trace.record("System", "workflow_start", f"Goal: procure {quantity} × {item}")

        # Shared mutable context passed forward between agents
        workflow_context: Dict[str, Any] = {
            "item": item,
            "quantity": quantity,
            "estimated_value": estimated_value,
        }

        results: Dict[str, Any] = {}

        logger.info("strands_workflow_start", item=item, quantity=quantity, value=estimated_value)

        # ── Step 1: Planning ──────────────────────────────────────────────────
        planner = self.agents["planner"]
        plan_result = await planner.run(workflow_context, trace=trace)
        results["planning"] = plan_result["result"]

        # ── Step 2: Supplier Discovery ────────────────────────────────────────
        research_agent = self.agents["supplier_discovery"]
        # Pass typed input the way the tool expects it
        class _SearchInput:
            pass
        si = _SearchInput()
        si.item = item  # type: ignore[attr-defined]
        si.quantity = quantity  # type: ignore[attr-defined]
        workflow_context["_search_input"] = si  # agent reads context

        research_result = await research_agent.run(workflow_context, trace=trace)
        results["discovery"] = research_result["result"]

        # Candidates are now in context for the next agent
        candidates = results["discovery"].get("candidates", [])
        workflow_context["candidates"] = candidates

        # ── Step 3: Risk & Compliance ─────────────────────────────────────────
        risk_agent = self.agents["risk_compliance"]
        risk_result = await risk_agent.run(workflow_context, trace=trace)
        results["risk"] = risk_result["result"]

        # top_candidate is now set in workflow_context by the risk agent
        # (it sets context["top_candidate"] to the first cleared supplier)

        # ── Step 4: Negotiation ───────────────────────────────────────────────
        neg_agent = self.agents["negotiation"]
        neg_result = await neg_agent.run(workflow_context, trace=trace)
        results["negotiation"] = neg_result["result"]

        # Extract negotiated financials
        negotiated_unit_price = results["negotiation"].get("counter_price", estimated_value / max(quantity, 1))
        negotiated_total = results["negotiation"].get("total_negotiated", estimated_value)
        total_savings = results["negotiation"].get("total_savings", 0)

        # ── Step 5: Policy Gate ───────────────────────────────────────────────
        approval_required = negotiated_total > APPROVAL_THRESHOLD
        trace.record(
            "Policy Engine",
            "gate_evaluated",
            f"Value ${negotiated_total:,.0f} {'>' if approval_required else '<='} "
            f"${APPROVAL_THRESHOLD:,} threshold → "
            f"{'APPROVAL REQUIRED' if approval_required else 'Autonomous execution permitted'}",
        )

        if approval_required:
            workflow_context["estimated_value"] = negotiated_total
            approval_agent = self.agents["human_approval"]
            approval_result = await approval_agent.run(workflow_context, trace=trace)
            results["approval"] = approval_result["result"]

        trace.record("System", "workflow_complete",
                     f"Steps completed: {list(results.keys())}. "
                     f"Approval required: {approval_required}")

        logger.info("strands_workflow_complete", item=item, steps=list(results.keys()))

        return {
            "workflow": "strands_autonomous_procurement",
            "demo_mode": True,
            "item": item,
            "quantity": quantity,
            "initial_estimated_value": estimated_value,
            "negotiated_total": negotiated_total,
            "total_savings": total_savings,
            "approval_required": approval_required,
            "approval_threshold": APPROVAL_THRESHOLD,
            "top_supplier": workflow_context.get("top_candidate", {}),
            "blocked_suppliers": results.get("risk", {}).get("blocked_suppliers", []),
            "steps": results,
            "execution_trace": trace.events,
            "completed_at": datetime.now(timezone.utc).isoformat(),
        }
