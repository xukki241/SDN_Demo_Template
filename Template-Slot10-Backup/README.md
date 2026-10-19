# Template live coding: Student API

Bộ khung students độc lập với demo chính. Client giữ React Bootstrap cơ bản gồm form và bảng. Các thao tác cần code được để TODO trong `backend/server.js` và `client/src/api.js`; không có sẵn logic POST, PATCH, PUT hay DELETE.

## Chạy

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item client/.env.example client/.env
npm install
npm run server
```

Chạy các lệnh trong terminal đã mở tại một trong hai thư mục template.

Mở terminal thứ hai ở cùng thư mục:

```powershell
npm run client
```

MongoDB local cần chạy. Template dùng database `student_live_template`, backend port `3007`, client port `5173`. Backend chỉ gọi `server.listen(PORT, HOST, ...)` sau khi kết nối MongoDB.

Mọi route dùng response contract `{ "success": true|false, "data": ..., "message": "..." }`. Khi hoàn thành code, frontend hiện HTTP status, message và JSON response ngay bên dưới các control Bootstrap.

## Các bước code theo scenario

1. GET `/api/students` — có sẵn, lấy danh sách.
2. GET `/api/students/:id` — TODO: ID sai định dạng trả `400`, ID không có trả `404`.
3. POST `/api/students` — TODO: yêu cầu `name`, `mark`; nếu client truyền `_id` thì từ chối ID trùng; tạo mới trả `201`.
4. Gửi POST thiếu dữ liệu để quan sát `400`.
5. Gọi ID sai định dạng để quan sát `400`.
6. Gọi ObjectId hợp lệ nhưng không tồn tại để quan sát `404`.
7. PATCH `/api/students/:id` — TODO: chỉ sửa trường gửi lên.
8. PUT `/api/students/:id` — TODO: yêu cầu đủ `name`, `mark` rồi thay dữ liệu.
9. DELETE `/api/students/:id` — TODO: xóa theo ID; không tìm thấy trả `404`.

Body tạo/sửa mẫu:

```json
{"name":"An","mark":8}
```

Frontend CRUD là nền để cùng code: GET danh sách đã nối; trong `client/src/api.js`, hoàn thiện GET theo ID, POST, PATCH, PUT và DELETE theo TODO. Nút “POST thiếu dữ liệu” và ô “GET theo ID” dùng để hiện lỗi trực tiếp trên trang. Dùng Postman/REST Client nếu muốn gửi body tùy ý.

Các request mẫu đã để trong [`scenario.http`](scenario.http). Mở file bằng VS Code REST Client sau khi hoàn thành các endpoint; sau khi tạo sinh viên, chép `_id` trong response vào biến `@id` ở đầu file. PATCH, PUT và DELETE là phần mở rộng; chạy DELETE cuối cùng.
