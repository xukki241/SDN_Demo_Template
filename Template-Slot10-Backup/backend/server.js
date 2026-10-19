require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());

const Student = mongoose.model("Student", new mongoose.Schema({
  name: { type: String, required: true },
  mark: { type: Number, required: true },
}));

function success(res, status, data, message) {
  res.status(status).json({ success: true, data, message });
}

function failure(res, status, message) {
  res.status(status).json({ success: false, data: null, message });
}

server.get("/api/students", async (req, res) => {
  success(res, 200, await Student.find(), "Lấy danh sách sinh viên thành công");
});

server.get("/api/students/:id", async (req, res) => {
  // TODO: ID sai định dạng trả failure(res, 400, message).
  // TODO: Tìm bằng Student.findById; không thấy trả 404, có thì success(res, 200, student, message).
});

server.post("/api/students", async (req, res) => {
  // TODO: Thiếu name/mark thì trả failure(res, 400, message).
  // TODO: Nếu body có _id thì chỉ tạo khi ID chưa trùng; trùng trả failure(res, 409, message).
  // TODO: Tạo Student rồi trả success(res, 201, student, message).
});

server.patch("/api/students/:id", async (req, res) => {
  // TODO: Chỉ sửa trường có trong req.body; ID sai trả 400, không thấy trả 404.
  // TODO: Thành công trả success(res, 200, student, message).
});

server.put("/api/students/:id", async (req, res) => {
  // TODO: Yêu cầu đủ name/mark rồi thay toàn bộ; dùng cùng response success/failure bên trên.
});

server.delete("/api/students/:id", async (req, res) => {
  // TODO: Xóa theo ID; lỗi trả failure, thành công trả success(res, 200, deletedStudent, message).
});

// TODO: Chuẩn hóa lỗi còn lại thành { success: false, data: null, message }.

mongoose.connect(process.env.MONGO_URI).then(() => {
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || 3007;
  server.listen(port, host, () => console.log(`API chạy tại http://${host}:${port}`));
}).catch((error) => console.log("Không kết nối được MongoDB:", error.message));
