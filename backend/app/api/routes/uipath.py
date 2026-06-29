"""UiPath platform integration endpoints — Maestro, Case Management, RPA, Document Understanding."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.services.uipath_service import (
    maestro_client, case_management_client, rpa_client, document_understanding
)

router = APIRouter()


# ─── Maestro BPMN ─────────────────────────────────────────────────────────────

class WorkflowStartRequest(BaseModel):
    workflow_id: str
    input_data: Dict[str, Any] = {}


@router.post("/maestro/start")
async def start_maestro_workflow(request: WorkflowStartRequest):
    """Start a UiPath Maestro BPMN workflow."""
    result = await maestro_client.start_workflow(request.workflow_id, request.input_data)
    return result


@router.get("/maestro/{instance_id}/status")
async def get_workflow_status(instance_id: str):
    """Get status of a running Maestro workflow."""
    result = await maestro_client.get_workflow_status(instance_id)
    return result


@router.post("/maestro/{instance_id}/human-task")
async def create_human_task(instance_id: str, task_data: Dict[str, Any]):
    """Create a Human-in-the-Loop task and pause workflow."""
    result = await maestro_client.trigger_human_task(instance_id, task_data)
    return result


@router.post("/maestro/{instance_id}/resume")
async def resume_workflow(instance_id: str, task_id: str, decision: str, notes: str = ""):
    """Resume workflow after human decision."""
    result = await maestro_client.resume_workflow(instance_id, task_id, decision, notes)
    return result


# ─── Case Management ─────────────────────────────────────────────────────────

class CreateCaseRequest(BaseModel):
    case_type: str
    title: str
    priority: str = "medium"
    data: Dict[str, Any] = {}


@router.post("/cases")
async def create_uipath_case(request: CreateCaseRequest):
    """Create a new dynamic case in UiPath Case Management."""
    result = await case_management_client.create_case(
        request.case_type, request.title, request.priority, request.data
    )
    return result


@router.patch("/cases/{case_id}/stage")
async def advance_case_stage(case_id: str, new_stage: str, notes: str = ""):
    """Advance a case to the next stage."""
    result = await case_management_client.advance_stage(case_id, new_stage, notes)
    return result


@router.post("/cases/{case_id}/comments")
async def add_case_comment(case_id: str, author: str, comment: str, actor_type: str = "human"):
    """Add a comment/activity to a case."""
    result = await case_management_client.add_comment(case_id, author, comment, actor_type)
    return result


# ─── RPA Robots ──────────────────────────────────────────────────────────────

class RobotTriggerRequest(BaseModel):
    robot_name: str
    process_name: str
    input_args: Dict[str, Any] = {}


@router.post("/rpa/trigger")
async def trigger_rpa_robot(request: RobotTriggerRequest):
    """Trigger a UiPath robot process."""
    result = await rpa_client.trigger_robot(
        request.robot_name, request.process_name, request.input_args
    )
    return result


@router.post("/rpa/create-supplier-sap")
async def create_supplier_sap(supplier_name: str, vendor_group: str = "LIEF", country: str = "KR"):
    """Trigger robot to create supplier in SAP ERP."""
    return await rpa_client.trigger_robot(
        "SAP-Robot-01", "CreateSupplierSAP",
        {"supplierName": supplier_name, "vendorGroup": vendor_group, "country": country}
    )


@router.post("/rpa/create-purchase-order")
async def create_purchase_order(
    supplier_id: str, item: str, quantity: int, value: float, delivery_date: str
):
    """Trigger robot to create Purchase Order in SAP."""
    return await rpa_client.trigger_robot(
        "SAP-Robot-01", "GeneratePurchaseOrder",
        {"supplierId": supplier_id, "item": item, "quantity": quantity, "value": value, "deliveryDate": delivery_date}
    )


@router.post("/rpa/send-email")
async def send_supplier_email(recipient: str, subject: str, body: str, attachments: list = []):
    """Trigger robot to send email via Outlook."""
    return await rpa_client.trigger_robot(
        "Outlook-Robot-01", "SendOutlookEmail",
        {"recipient": recipient, "subject": subject, "body": body, "attachments": attachments}
    )


@router.post("/rpa/notify-teams")
async def notify_teams(channel: str, message: str):
    """Trigger robot to post notification to Microsoft Teams."""
    return await rpa_client.trigger_robot(
        "Teams-Robot-01", "NotifyMSTeams",
        {"channel": channel, "message": message}
    )


@router.post("/rpa/update-salesforce")
async def update_salesforce(account_name: str, stage: str, amount: float):
    """Trigger robot to update Salesforce CRM."""
    return await rpa_client.trigger_robot(
        "SF-Robot-01", "UpdateSalesforce",
        {"accountName": account_name, "stage": stage, "amount": amount}
    )


# ─── Document Understanding ───────────────────────────────────────────────────

@router.post("/document-understanding/extract")
async def extract_document(document_type: str = "contract", file: UploadFile = File(...)):
    """Extract structured data from uploaded documents using Document Understanding."""
    content = await file.read()
    import base64
    doc_b64 = base64.b64encode(content).decode()
    result = await document_understanding.extract_contract_data(doc_b64, document_type)
    return result


@router.post("/document-understanding/analyze-contract-text")
async def analyze_contract_text(contract_text: str):
    """Analyze contract text and extract clauses, risks, and fields."""
    import base64
    result = await document_understanding.extract_contract_data(
        base64.b64encode(contract_text.encode()).decode(), "contract"
    )
    return result


# ─── Full Procurement Automation Trigger ─────────────────────────────────────

@router.post("/orchestrate/full-procurement")
async def orchestrate_full_procurement(
    case_number: str,
    item: str,
    quantity: int,
    estimated_value: float,
    supplier_name: str = "VoltX Energy",
):
    """
    Orchestrate the full procurement workflow:
    1. Start Maestro BPMN
    2. Create Case Management entry
    3. Trigger appropriate robots after approval
    Returns a full orchestration summary.
    """
    # Step 1: Start Maestro
    maestro_result = await maestro_client.start_workflow(
        "ProcurementWorkflow_v2",
        {"caseNumber": case_number, "item": item, "quantity": quantity, "value": estimated_value}
    )

    # Step 2: Create Case
    case_result = await case_management_client.create_case(
        "Procurement", f"{item} Procurement — {case_number}",
        "high" if estimated_value > 100000 else "medium",
        {"item": item, "quantity": quantity, "estimatedValue": estimated_value}
    )

    # Step 3: Create Human Task (approval gate)
    task_result = await maestro_client.trigger_human_task(
        maestro_result["workflowInstanceId"],
        {
            "type": "ContractApproval",
            "title": f"Approve {supplier_name} engagement for {item}",
            "assignedTo": "j.doe@company.com",
            "value": f"${estimated_value:,.0f}",
        }
    )

    return {
        "orchestration": "full_procurement",
        "caseNumber": case_number,
        "maestroInstance": maestro_result["workflowInstanceId"],
        "caseId": case_result["caseId"],
        "humanTaskId": task_result["taskId"],
        "status": "Awaiting Human Approval",
        "nextAction": "Executive must approve via /approvals page",
        "summary": {
            "workflow": maestro_result,
            "case": case_result,
            "humanTask": task_result,
        }
    }
