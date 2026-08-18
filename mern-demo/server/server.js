const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Student Schema (Đã xóa hoàn toàn age)
// =========================
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên sinh viên"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            trim: true,
            lowercase: true,
        },

        studentId: {
            type: String,
            required: [true, "Vui lòng nhập Mã số sinh viên"],
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model("Student", studentSchema);

// =========================
// Test API
// =========================
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend is working!",
    });
});

// =========================
// GET - Lấy tất cả sinh viên
// =========================
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        console.error("GET /api/students error:", error);
        res.status(500).json({
            message: "Không thể lấy danh sách sinh viên",
            error: error.message,
        });
    }
});

// =========================
// GET - Lấy một sinh viên theo ID
// =========================
app.get("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên",
            });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("GET /api/students/:id error:", error);
        res.status(400).json({
            message: "ID sinh viên không hợp lệ",
            error: error.message,
        });
    }
});

// =========================
// POST - Thêm sinh viên (Đã xóa age)
// =========================
app.post("/api/students", async (req, res) => {
    try {
        const { name, email, studentId } = req.body;

        if (!name || !email || !studentId) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin: Mã sinh viên, Họ tên và Email",
            });
        }

        const existingStudent = await Student.findOne({ studentId: studentId.trim() });
        if (existingStudent) {
            return res.status(409).json({
                message: "Mã sinh viên này đã tồn tại trong hệ thống!",
            });
        }

        const student = new Student({
            name: name.trim(),
            email: email.trim(),
            studentId: studentId.trim(),
        });

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Thêm sinh viên thành công",
            student: savedStudent,
        });
    } catch (error) {
        console.error("POST /api/students error:", error);
        res.status(500).json({
            message: "Không thể thêm sinh viên",
            error: error.message,
        });
    }
});

// =========================
// PUT - Cập nhật sinh viên (Đã xóa age)
// =========================
app.put("/api/students/:id", async (req, res) => {
    try {
        const { name, email, studentId } = req.body;

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (email) updateData.email = email.trim();
        if (studentId) updateData.studentId = studentId.trim();

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên",
            });
        }

        res.status(200).json({
            message: "Cập nhật sinh viên thành công",
            student,
        });
    } catch (error) {
        console.error("PUT /api/students/:id error:", error);
        res.status(400).json({
            message: "Không thể cập nhật sinh viên",
            error: error.message,
        });
    }
});

// =========================
// DELETE - Xóa sinh viên
// =========================
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên",
            });
        }

        res.status(200).json({
            message: "Xóa sinh viên thành công",
            student,
        });
    } catch (error) {
        console.error("DELETE /api/students/:id error:", error);
        res.status(400).json({
            message: "Không thể xóa sinh viên",
            error: error.message,
        });
    }
});

// =========================
// 404 - API không tồn tại
// =========================
app.use((req, res) => {
    res.status(404).json({
        message: `Không tìm thấy API: ${req.method} ${req.originalUrl}`,
    });
});

// =========================
// Kết nối MongoDB + Start server
// =========================
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });