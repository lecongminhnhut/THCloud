from backend.app.core.firebase_config import get_firestore
from datetime import datetime, timezone

db = get_firestore()

# --- Dịch vụ Firestore cho Cloud Box ---
def add_new_box(uid: str, data: dict):
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    doc_ref = db.collection("users").document(uid).collection("boxes").add(data)
    return doc_ref[1].id

def get_all_boxes(uid: str):
    docs = (
        db.collection("users")
        .document(uid)
        .collection("boxes")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )
    return [{"id": d.id, **d.to_dict()} for d in docs]

def update_box(uid: str, box_id: str, data: dict):
    # Cập nhật dữ liệu vào đúng ID của box đó
    db.collection("users").document(uid).collection("boxes").document(box_id).update(data)
    return True

def delete_box(uid: str, box_id: str):
    # Xóa vĩnh viễn document
    db.collection("users").document(uid).collection("boxes").document(box_id).delete()
    return True

def search_boxes(uid: str, query: str):
    all_boxes = get_all_boxes(uid)
    query = query.lower()
    # Lọc những box có chứa từ khóa trong message hoặc link
    filtered_boxes = [
        box for box in all_boxes 
        if query in (box.get("message") or "").lower() 
        or query in (box.get("link") or "").lower()
    ]
    return filtered_boxes

def get_boxes_by_date(uid: str, target_date: str):
    all_boxes = get_all_boxes(uid)
    # target_date gửi lên nên có định dạng "YYYY-MM-DD"
    filtered_boxes = [
        box for box in all_boxes 
        if box.get("created_at", "").startswith(target_date)
    ]
    return filtered_boxes