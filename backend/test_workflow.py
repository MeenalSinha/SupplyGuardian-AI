import asyncio
from app.agents.orchestrator import AgentOrchestrator

async def test():
    orch = AgentOrchestrator()
    result = await orch.run_full_procurement_workflow(
        item='lithium-ion battery cells',
        quantity=10000,
        estimated_value=510000.0
    )
    top = result["top_supplier"]
    blocked = [b["supplier"] for b in result["blocked_suppliers"]]
    print("=== WORKFLOW RESULT ===")
    print(f"Top supplier:     {top}")
    print(f"Blocked:          {blocked}")
    print(f"Initial total:    ${result['initial_estimated_value']:,.2f}")
    print(f"Negotiated total: ${result['negotiated_total']:,.2f}")
    print(f"Total savings:    ${result['total_savings']:,.2f}")
    print(f"Approval required: {result['approval_required']}")
    print(f"Trace events:     {len(result['execution_trace'])}")
    print()
    print("=== LIVE EXECUTION TRACE ===")
    for e in result["execution_trace"]:
        ts = e["timestamp"][11:19]
        agent = e["agent"][:26].ljust(26)
        action = e["action"][:18].ljust(18)
        detail = e["detail"][:72]
        print(f"{ts}  [{agent}]  {action}  {detail}")

asyncio.run(test())
