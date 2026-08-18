const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    email: String
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;