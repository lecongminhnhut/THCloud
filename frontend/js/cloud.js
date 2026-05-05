const API_URL = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

// Không có token thì về trang Login
if (!token) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("user_email") || "User";

  // // Hiển thị email ở user-display (nếu Nhựt vẫn giữ span này)
  // const userDisplay = document.getElementById("user-display");
  // if (userDisplay) userDisplay.innerText = email;

  // HIỂN THỊ CHỮ CÁI ĐẦU LÊN AVATAR
  const avatar = document.getElementById("user-avatar");
  if (avatar) {
    avatar.innerText = email.charAt(0).toUpperCase();
  }

  if (window.location.pathname.includes("profile.html")) {
    fetchUserProfile();
  } else {
    loadBoxes();
  }
});

// Tải danh sách Box từ Server
async function loadBoxes() {
  try {
    const response = await fetch(`${API_URL}/cloud/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const boxes = await response.json();
      renderBoxes(boxes);
    }
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
}

// Hàm điều khiển Modal Thêm mới (FAB)
function openAddModal() {
  document.getElementById("add-modal").style.display = "block";
}

function closeAddModal() {
  document.getElementById("add-modal").style.display = "none";
  document.getElementById("box-message").value = "";
  document.getElementById("box-link").value = "";
}

// Thêm Box mới
async function addBox() {
  const message = document.getElementById("box-message").value;
  const link = document.getElementById("box-link").value;

  if (!message && !link) return;

  try {
    const response = await fetch(`${API_URL}/cloud/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, link }),
    });

    if (response.ok) {
      closeAddModal(); // Đóng modal sau khi thêm thành công[cite: 8]
      loadBoxes();
    }
  } catch (err) {
    alert("Không thể lưu. Kiểm tra lại Server nhé!");
  }
}

// Hiển thị Box ra giao diện
function renderBoxes(boxes) {
  const container = document.getElementById("boxes-container");
  container.innerHTML = "";

  // Sắp xếp mới nhất lên đầu[cite: 8]
  boxes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  boxes.forEach((box) => {
    const date = new Date(box.created_at).toLocaleString("vi-VN");
    const card = document.createElement("div");
    card.className = "box-card";

    const linkHTML = box.link
      ? `<a href="${box.link}" target="_blank" class="box-link-url">🔗 Truy cập liên kết</a>`
      : "";

    card.innerHTML = `
            <button class="btn-edit" onclick="openUpdateModal('${box.id}', '${box.message || ""}', '${box.link || ""}')">✎</button>
            <button class="btn-delete" onclick="deleteBox('${box.id}')">×</button>
            <div class="box-msg">${box.message || "<i>Nội dung trống</i>"}</div>
            ${linkHTML}
            <div class="box-footer">${date}</div>
        `;
    container.appendChild(card);
  });
}

// Tìm kiếm & Lọc theo ngày
async function filterBoxes() {
  const query = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  const selectedDate = document.getElementById("date-input").value;

  try {
    const response = await fetch(`${API_URL}/cloud/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return;
    const boxes = await response.json();

    const filtered = boxes.filter((box) => {
      const matchesText =
        (box.message && box.message.toLowerCase().includes(query)) ||
        (box.link && box.link.toLowerCase().includes(query));

      let matchesDate = true;
      if (selectedDate && box.created_at) {
        const dateObj = new Date(box.created_at);
        const boxDay = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
        matchesDate = boxDay === selectedDate;
      }
      return matchesText && matchesDate;
    });

    renderBoxes(filtered);
  } catch (err) {
    console.error("Lỗi lọc dữ liệu:", err);
  }
}

// Giữ lại hàm searchBoxes để khớp với thuộc tính oninput trong HTML
function searchBoxes() {
  filterBoxes();
}

// Xóa bộ lọc ngày
function clearDate() {
  document.getElementById("date-input").value = "";
  filterBoxes();
}

// Xử lý Cập nhật (Update)
function openUpdateModal(id, msg, link) {
  document.getElementById("update-id").value = id;
  document.getElementById("update-message").value = msg;
  document.getElementById("update-link").value = link;
  document.getElementById("update-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("update-modal").style.display = "none";
}

async function saveUpdate() {
  const id = document.getElementById("update-id").value;
  const message = document.getElementById("update-message").value;
  const link = document.getElementById("update-link").value;

  try {
    const response = await fetch(`${API_URL}/cloud/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, link }),
    });

    if (response.ok) {
      closeModal();
      loadBoxes();
    }
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
  }
}

// 7. Xóa Box
async function deleteBox(boxId) {
  if (!confirm("Nhựt muốn xóa mục này không?")) return;
  try {
    const response = await fetch(`${API_URL}/cloud/delete/${boxId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) loadBoxes();
  } catch (err) {
    alert("Lỗi khi xóa!");
  }
}

// Đăng xuất
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Hàm lấy thông tin từ Endpoint /auth/me
async function fetchUserProfile() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token để Backend xác thực
      },
    });

    if (response.ok) {
      const user = await response.json();

      // 1. Đổ Email và UID vào giao diện
      document.getElementById("info-email").innerText = user.email;
      document.getElementById("info-uid").innerText = user.uid;

      // 2. Xử lý tên hiển thị dựa trên email
      const namePart = user.email.split("@")[0];
      document.getElementById("profile-name-display").innerText =
        namePart.charAt(0).toUpperCase() + namePart.slice(1);

      // 3. Cập nhật chữ cái cho Avatar lớn
      document.getElementById("profile-avatar-char").innerText = user.email
        .charAt(0)
        .toUpperCase();
    } else if (response.status === 401) {
      // Nếu token hết hạn, yêu cầu đăng nhập lại
      logout();
    }
  } catch (err) {
    console.error("Lỗi khi kết nối Backend /auth/me:", err);
  }
}
