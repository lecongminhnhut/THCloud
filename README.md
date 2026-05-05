# 24120211_Lab2

Hệ thống lưu trữ ghi chú và liên kết cá nhân (Cloud Box) tích hợp xác thực đa phương thức. Đây là đồ án thực hiện cho Lab 2 môn **Tư duy tính toán** - HCMUS.

## Thông tin sinh viên

| Mục             | Thông tin                        |
| --------------- | -------------------------------- |
| Trường          | Đại học Khoa học Tự nhiên TP.HCM |
| Khoa            | Công nghệ Thông tin              |
| Môn học         | Tư duy Tính toán                 |
| Lớp             | 24CTT3                           |
| Họ và tên       | Lê Công Minh Nhựt                |
| Mã số sinh viên | 24120211                         |

## Hướng dẫn thiết lập môi trường

Để đảm bảo bảo mật, mã nguồn chỉ cung cấp các file mẫu. Người dùng cần thiết lập các file cấu hình thực tế như sau:

### 1. Cấu hình biến môi trường (`.env`)

- **Vị trí**: Tạo file **`.env`** tại thư mục gốc dự án (ngang hàng với thư mục `backend` và `frontend`).
- **Nội dung**: Sao chép từ `.env.example` và điền các thông số:
  - `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` (từ Google Cloud Console).
  - `FIREBASE_WEB_API_KEY` (từ Firebase Console).
  - `FRONTEND_URL` (mặc định: `http://127.0.0.1:5500/frontend/index.html`).

### 2. Cấu hình Firebase Admin (Backend)

- **Vị trí**: Đặt file **`serviceAccountKey.json`** vào thư mục `backend/app/core/`.
- **Lưu ý**: File này chứa Private Key quản trị, tuyệt đối không được công khai.

### 3. Cấu hình Firebase Client (Frontend)

- **Vị trí**: Tại thư mục `frontend/js/`, sao chép `config.js.example` thành file **`config.js`**.
- **Nội dung**: Điền các thông số `apiKey`, `authDomain`, `projectId` từ cấu hình Web App trong Firebase của bạn.

### 4. Cài đặt thư viện

Yêu cầu Python 3.9+. Chạy lệnh sau tại thư mục gốc:

#### Cách 1:

```bash
pip install -r backend/requirements.txt
```

#### Cách 2:

```bash
pip install -r requirements.txt
```

## Hướng dẫn vận hành Backend

Backend được phát triển bằng framework **FastAPI**. Thực hiện các lệnh sau để khởi động:

### 1. **Khởi chạy Server**:

#### Cách 1:

    ```bash
    python -m backend.app.main
    ```

#### Cách 2:

    ```bash
    uvicorn backend.app.main:app --reload
    ```

### 2. **Thông tin truy cập**:

    - **API URL**: `http://127.0.0.1:8000`
    - **Swagger UI**: `http://127.0.0.1:8000/docs`

## Hướng dẫn vận hành Frontend

Giao diện người dùng sử dụng HTML/CSS và JavaScript thuần.

### 1. **Sử dụng Live Server (Khuyến nghị)**:

    - Mở toàn bộ thư mục dự án bằng VS Code.
    - Chuột phải vào file `frontend/index.html` và chọn **Open with Live Server**.

### 2. **Lưu ý quan trọng**: Đảm bảo Frontend chạy đúng port `5500` để khớp với khai báo `FRONTEND_URL` trong file `.env`.

## Quy định bảo mật

- Dự án đã được cấu hình `.gitignore` để tự động loại bỏ các file nhạy cảm.
- **Tuyệt đối không đưa lên repository**: file `.env`, `serviceAccountKey.json`, `config.js` và các thư mục cache (`__pycache__`, `.venv`).

## Video Demo Dự án
