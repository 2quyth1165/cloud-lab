import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // Form state
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Lưu ID của sinh viên đang chỉnh sửa (null = chế độ Thêm mới)
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const API_URL =
    "https://curly-lamp-5px6x7v6wfvv5j-5000.app.github.dev/api/students";

  // ==========================================
  // API GET: Lấy danh sách sinh viên từ Backend
  // ==========================================
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Lỗi API: ${response.status}`);
      }

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET ERROR:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách lần đầu khi component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Reset form về trạng thái ban đầu
  const handleResetForm = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // ==========================================
  // Xử lý Gửi Form (THÊM MỚI hoặc CẬP NHẬT)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId.trim() || !name.trim() || !email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const payload = {
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim(),
    };

    try {
      if (editingId) {
        // --- 1. SỬA SỐ LIỆU (PUT /api/students/:id) ---
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Cập nhật thất bại!");

        alert("Cập nhật thành công!");
      } else {
        // --- 2. THÊM MỚI (POST /api/students) ---
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Thêm mới thất bại!");

        alert("Thêm sinh viên thành công!");
      }

      handleResetForm();
      // === CÂU 63: TẢI LAỊ DANH SÁCH TỪ BACKEND ĐỂ KIỂM TRA LẠI DỮ LIỆU ===
      await fetchStudents();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert(err.message || "Đã xảy ra lỗi!");
    }
  };

  // ==========================================
  // XỬ LÝ XÓA SINH VIÊN (DELETE)
  // ==========================================
  const handleDelete = async (id) => {
    if (!id) {
      alert("Không tìm thấy ID sinh viên!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Xóa sinh viên thất bại!");

      alert("Xóa sinh viên thành công!");

      // === CÂU 63: TẢI LAỊ DANH SÁCH TỪ BACKEND ĐỂ KIỂM TRA LẠI DỮ LIỆU ===
      await fetchStudents();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err.message || "Đã xảy ra lỗi khi xóa!");
    }
  };

  // Nạp thông tin sinh viên vào form để chuẩn bị Sửa
  const handleEditClick = (student) => {
    const idToEdit = student._id || student.id;
    if (!idToEdit) {
      alert("Sinh viên này thiếu thông tin ID!");
      return;
    }
    setEditingId(idToEdit);
    setStudentId(student.studentId || student.mssv || "");
    setName(student.name || student.hoTen || "");
    setEmail(student.email || "");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "#fff",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* FORM THÊM / SỬA */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "15px",
              color: editingId ? "#28a745" : "#007bff",
            }}
          >
            {editingId ? "Cập Nhật Thông Tin Sinh Viên" : "Thêm Sinh Viên Mới"}
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Mã số sinh viên"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              style={{
                flex: "1 1 200px",
                height: "45px",
                padding: "0 15px",
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "6px",
                outline: "none",
              }}
            />

            <input
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                flex: "1 1 200px",
                height: "45px",
                padding: "0 15px",
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "6px",
                outline: "none",
              }}
            />

            <input
              type="email"
              placeholder="Địa chỉ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: "1 1 200px",
                height: "45px",
                padding: "0 15px",
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "6px",
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                height: "45px",
                padding: "0 25px",
                backgroundColor: loading
                  ? "#555"
                  : editingId
                  ? "#28a745"
                  : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {editingId ? "Cập Nhật" : "Thêm Sinh Viên"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleResetForm}
                style={{
                  height: "45px",
                  padding: "0 20px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Hủy Sửa
              </button>
            )}
          </form>
        </div>

        {/* TIÊU ĐỀ VÀ NÚT TẢI LẠI TRỰC TIẾP */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #444",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Danh sách sinh viên hiện có</h2>
          <button
            onClick={fetchStudents}
            style={{
              padding: "8px 16px",
              backgroundColor: "#17a2b8",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔄 Tải lại dữ liệu (GET)
          </button>
        </div>

        {/* TRẠNG THÁI LOADING */}
        {loading && <p style={{ color: "#aaa" }}>Đang tải dữ liệu từ server...</p>}

        {/* TRẠNG THÁI TRỐNG */}
        {!loading && students.length === 0 && (
          <p style={{ color: "#888", fontStyle: "italic" }}>
            Chưa có dữ liệu sinh viên nào trong Database.
          </p>
        )}

        {/* DANH SÁCH THẺ SINH VIÊN */}
        {!loading && students.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "15px",
            }}
          >
            {students.map((student, index) => {
              const currentId = student._id || student.id;
              return (
                <div
                  key={currentId || index}
                  style={{
                    backgroundColor: "#222",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p>
                      <strong>MSSV:</strong>{" "}
                      {student.studentId || student.mssv || "Trống"}
                    </p>
                    <p>
                      <strong>Họ tên:</strong>{" "}
                      {student.name || student.hoTen || "Trống"}
                    </p>
                    <p>
                      <strong>Email:</strong> {student.email || "Trống"}
                    </p>
                  </div>

                  {/* NÚT THAO TÁC SỬA / XÓA */}
                  <div
                    style={{
                      marginTop: "15px",
                      paddingTop: "10px",
                      borderTop: "1px solid #333",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() => handleEditClick(student)}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        backgroundColor: "#ffc107",
                        color: "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Sua
                    </button>
                    <button
                      onClick={() => handleDelete(currentId)}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      X
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;