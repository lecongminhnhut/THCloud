import os
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# --- CẤU HÌNH PYREBASE (Dành cho Local Login) ---
firebase_config = {
    "apiKey": os.getenv("FIREBASE_WEB_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "databaseURL": "" 
}

# Khởi tạo Pyrebase
firebase_stack = pyrebase.initialize_app(firebase_config)

def get_pyrebase_auth():
    return firebase_stack.auth()

# --- CẤU HÌNH FIREBASE ADMIN (Dành cho Firestore & Verify Token) ---
def init_firebase_admin():
    if not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "backend/app/core/serviceAccountKey.json")
        
        if not os.path.exists(cred_path):
            print(f"Lỗi: Không tìm thấy file {cred_path}")
            return None

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

def get_firestore():
    init_firebase_admin()
    return firestore.client()

def get_firebase_api_key():
    return os.getenv("FIREBASE_WEB_API_KEY")

def get_google_provider_config():
    return {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "frontend_url": os.getenv("FRONTEND_URL")
    }