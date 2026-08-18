import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // 1. Định nghĩa State khớp chính xác 100% với file Model Backend của bạn
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Địa chỉ API liên kết với GitHub Codespaces của bạn
  const API_URL = "https://friendly-fortnight-9jp5w56p5p9cp4r5-5000.app.github.dev/api/students";

  // 2. Hàm gọi API để lấy danh sách sinh viên từ Database
  const fetchStudents = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu nhận từ Database:", data);
        setStudents(data);
      })
      .catch((error) => console.error("Lỗi khi tải danh sách:", error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 3. Hàm gửi dữ liệu từ Form lên Server khi nhấn nút "Thêm sinh viên"
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentId, // Khớp chuẩn xác với trường dữ liệu của Backend
        name: name,           // Khớp chuẩn xác với trường dữ liệu của Backend
        email: email,         // Khớp chuẩn xác với trường dữ liệu của Backend
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Sinh viên mới đã lưu thành công:", data);
        
        // Tải lại danh sách mới nhất từ Database sau khi thêm thành công
        fetchStudents();

        // Xóa sạch chữ trong các ô nhập liệu (Reset Form)
        setStudentId("");
        setName("");
        setEmail("");
      })
      .catch((error) => console.error("Lỗi khi lưu dữ liệu:", error));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", width: "100%", boxSizing: "border-box" }}>
      
      {/* KHU VỰC FORM HÀNG NGANG CĂN CHỈNH THẲNG HÀNG */}
      <div style={{ border: "1px solid #444", padding: "15px", borderRadius: "8px", backgroundColor: "#1e1e1e", marginBottom: "30px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", alignItems: "center", width: "100%" }}>
          
          {/* Ô nhập mã số sinh viên */}
          <input
            type="text"
            placeholder="Mã số sinh viên"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ flex: 1, padding: "12px 15px", borderRadius: "6px", border: "1px solid #555", backgroundColor: "#333", color: "#fff", fontSize: "14px", height: "45px", boxSizing: "border-box" }}
            required
          />

          {/* Ô nhập Họ và Tên */}
          <input
            type="text"
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, padding: "12px 15px", borderRadius: "6px", border: "1px solid #555", backgroundColor: "#333", color: "#fff", fontSize: "14px", height: "45px", boxSizing: "border-box" }}
            required
          />

          {/* Ô nhập Email */}
          <input
            type="email"
            placeholder="Địa chỉ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, padding: "12px 15px", borderRadius: "6px", border: "1px solid #555", backgroundColor: "#333", color: "#fff", fontSize: "14px", height: "45px", boxSizing: "border-box" }}
            required
          />

          {/* Nút bấm Thêm Sinh Viên */}
          <button type="submit" style={{ padding: "0 25px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>
            Thêm sinh viên
          </button>
          
        </form>
      </div>

      {/* KHU VỰC HIỂN THỊ DANH SÁCH SINH VIÊN PHÍA DƯỚI */}
      <h2 style={{ color: "#fff", fontSize: "1.3rem", borderBottom: "1px solid #444", paddingBottom: "8px", margin: "20px 0 10px 0" }}>
        Danh sách sinh viên hiện có
      </h2>

      {students.length === 0 ? (
        <p style={{ color: "#888", fontStyle: "italic" }}>Chưa có dữ liệu sinh viên nào được lưu hoặc đang đợi kết nối Database...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px", marginTop: "15px" }}>
          {students.map((student) => (
            <div key={student._id} style={{ border: "1px solid #444", padding: "15px", borderRadius: "6px", backgroundColor: "#222", color: "#fff" }}>
              {/* Gọi chính xác các thuộc tính studentId và name đã lưu trong MongoDB */}
              <p style={{ margin: "0 0 8px 0" }}><strong>MSSV:</strong> {student.studentId || "Trống"}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Họ tên:</strong> {student.name || "Trống"}</p>
              <p style={{ margin: "0" }}><strong>Email:</strong> {student.email}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;