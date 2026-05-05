from fastapi import APIRouter, Depends, HTTPException
from backend.app.schemas.cloud import CloudBoxCreate, CloudBoxResponse
from backend.app.services import firestore_service as cloud_service
from backend.app.dependencies.auth import get_current_user
from typing import List

router = APIRouter(prefix="/cloud", tags=["Cloud Box"])

@router.post("/add")
async def create_box(payload: CloudBoxCreate, user=Depends(get_current_user)):
    box_id = cloud_service.add_new_box(user["uid"], payload.dict())
    return {"status": "success", "box_id": box_id}

@router.get("/list", response_model=List[CloudBoxResponse])
async def list_boxes(user=Depends(get_current_user)):
    return cloud_service.get_all_boxes(user["uid"])

@router.get("/search", response_model=List[CloudBoxResponse])
async def search_cloud_boxes(q: str, user=Depends(get_current_user)):
    return cloud_service.search_boxes(user["uid"], q)

@router.get("/by-date/{date_str}", response_model=List[CloudBoxResponse])
async def list_boxes_by_date(date_str: str, user=Depends(get_current_user)):
    return cloud_service.get_boxes_by_date(user["uid"], date_str)

@router.put("/update/{box_id}")
async def update_box(box_id: str, payload: CloudBoxCreate, user=Depends(get_current_user)):
    cloud_service.update_box(user["uid"], box_id, payload.dict())
    return {"status": "updated"}

@router.delete("/delete/{box_id}")
async def delete_box(box_id: str, user=Depends(get_current_user)):
    cloud_service.delete_box(user["uid"], box_id)
    return {"status": "deleted"}