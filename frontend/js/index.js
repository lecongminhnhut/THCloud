const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Hệ thống đã sẵn sàng. Kết nối tới:", API_URL);

  const loginForm = document.getElementById("login-form");
  const btnGoogle = document.getElementById("btn-google");

  // =========================
  // 0. XỬ LÝ GOOGLE CALLBACK
  // =========================
  const urlParams = new URLSearchParams(window.location.search);
  const idToken = urlParams.get("id_token");

  if (idToken) {
    console.log("Nhận id_token từ Google");

    // Lưu token giống login local
    localStorage.setItem("token", idToken);
    localStorage.setItem("login_provider", "google");
    // Xóa query cho URL gọn lại
    window.history.replaceState({}, document.title, window.location.pathname);

    // Chuyển sang cloud
    window.location.href = "cloud.html";
    return;
  }

  // =========================
  // TOGGLE LOGIN / SIGNUP
  // =========================
  window.showSignup = function () {
    const title = document.querySelector(".app-name");
    const btnCreate = document.querySelector(".btn-create-account");
    const btnLoginNow = document.querySelector(".btn-login-now");
    const mode = loginForm.dataset.mode || "login";

    if (mode === "signup") {
      title.innerHTML = 'NHỰT <span class="accent">CLOUD</span>';
      btnLoginNow.innerText = "Đăng Nhập Ngay";
      btnCreate.innerText = "Tạo tài khoản mới";
      loginForm.dataset.mode = "login";
    } else {
      title.innerHTML = 'ĐĂNG KÝ <span class="accent">TÀI KHOẢN</span>';
      btnLoginNow.innerText = "Đăng Ký Ngay";
      btnCreate.innerText = "Đã có tài khoản? Đăng nhập";
      loginForm.dataset.mode = "signup";
    }
  };

  // =========================
  // LOGIN / SIGNUP LOCAL
  // =========================
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mode = loginForm.dataset.mode || "login";
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const btnSubmit = e.target.querySelector(".btn-login-now");

    btnSubmit.disabled = true;
    btnSubmit.innerText = "Đang xử lý...";

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (mode === "login") {
          localStorage.setItem("token", data.idToken);
          localStorage.setItem("user_email", data.email);
          localStorage.setItem("login_provider", "local");
          window.location.href = "cloud.html";
        } else {
          alert("Tạo tài khoản thành công! Nhựt đăng nhập lại nhé.");
          showSignup();
        }
      } else {
        alert("Lỗi: " + (data.detail || "Thông tin không hợp lệ"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không kết nối được Backend. Kiểm tra server hoặc CORS!");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerText =
        mode === "login" ? "Đăng Nhập Ngay" : "Đăng Ký Ngay";
    }
  });

  // =========================
  // LOGIN GOOGLE
  // =========================
  btnGoogle.addEventListener("click", () => {
    console.log("Đang chuyển hướng sang Google Auth...");
    window.location.href = `${API_URL}/auth/google/start`;
  });
});
