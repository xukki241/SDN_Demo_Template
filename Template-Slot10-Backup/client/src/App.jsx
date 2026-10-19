import React, { useEffect, useState } from "react";
import {
  addStudent,
  deleteStudent,
  getStudent,
  getStudents,
  replaceStudent,
  updateStudent,
} from "./api.js";

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [mark, setMark] = useState("");
  const [editingId, setEditingId] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [result, setResult] = useState(null);

  function showResponse(response) {
    const body = response.data;
    setResult({
      type: body.success ? "success" : "danger",
      status: response.status,
      message: body.message,
      body,
    });
  }

  function showError(error) {
    const body = error.response?.data || {
      success: false,
      data: null,
      message: error.message || "Không kết nối được API",
    };
    setResult({
      type: "danger",
      status: error.response?.status || "CLIENT ERROR",
      message: body.message,
      body,
    });
  }

  async function loadStudents(showResult = false) {
    try {
      const response = await getStudents();
      setStudents(response.data.data);
      if (showResult) showResponse(response);
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => { loadStudents(true); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const student = { name, mark: Number(mark) };
    try {
      const response = editingId
        ? await updateStudent(editingId, student)
        : await addStudent(student);
      showResponse(response);
      if (response.data.success) {
        setName("");
        setMark("");
        setEditingId("");
        await loadStudents();
      }
    } catch (error) {
      showError(error);
    }
  }

  async function handlePut() {
    try {
      const response = await replaceStudent(editingId, { name, mark: Number(mark) });
      showResponse(response);
      if (response.data.success) {
        setName("");
        setMark("");
        setEditingId("");
        await loadStudents();
      }
    } catch (error) {
      showError(error);
    }
  }

  async function lookupStudent(id = lookupId) {
    if (!String(id).trim()) {
      setResult({
        type: "danger",
        status: "CLIENT ERROR",
        message: "Nhập ID sinh viên trước khi gửi GET",
        body: { success: false, data: null, message: "Nhập ID sinh viên trước khi gửi GET" },
      });
      return;
    }
    try {
      showResponse(await getStudent(id));
    } catch (error) {
      showError(error);
    }
  }

  async function tryMissingData() {
    try {
      showResponse(await addStudent({}));
    } catch (error) {
      showError(error);
    }
  }

  function editStudent(student) {
    setEditingId(student._id);
    setName(student.name);
    setMark(student.mark);
  }

  async function removeStudent(id) {
    if (!window.confirm("Xóa sinh viên này?")) return;
    try {
      showResponse(await deleteStudent(id));
      await loadStudents();
    } catch (error) {
      showError(error);
    }
  }

  function cancelEdit() {
    setEditingId("");
    setName("");
    setMark("");
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">Quản lý sinh viên</h1>

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="mb-3">
          <label className="form-label">Tên sinh viên</label>
          <input className="form-control" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Điểm</label>
          <input className="form-control" type="number" min="0" value={mark} onChange={(event) => setMark(event.target.value)} required />
        </div>
        <div>
          <button className="btn btn-primary" type="submit">
            {editingId ? "Lưu bằng PATCH" : "Thêm sinh viên"}
          </button>
          {editingId && <>
            <button className="btn btn-warning ms-2" type="button" onClick={handlePut}>Thay toàn bộ bằng PUT</button>
            <button className="btn btn-secondary ms-2" type="button" onClick={cancelEdit}>Hủy</button>
          </>}
        </div>
      </form>

      <section className="card card-body mb-4">
        <h2 className="h5">Thử tình huống API</h2>
        <div className="row g-2 align-items-end">
          <div className="col-md-8">
            <label className="form-label">ID sinh viên</label>
            <input
              className="form-control"
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              placeholder="Nhập ID hợp lệ, sai định dạng hoặc không tồn tại"
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button className="btn btn-outline-primary" type="button" onClick={() => lookupStudent()}>GET theo ID</button>
            <button className="btn btn-outline-danger" type="button" onClick={tryMissingData}>POST thiếu dữ liệu</button>
          </div>
        </div>
        <small className="text-muted mt-2">Dùng ID `sai-id` để xem lỗi 400; dùng một ObjectId hợp lệ không có trong DB để xem lỗi 404.</small>
      </section>

      {result && <section className="mb-4" aria-live="polite">
        <div className={`alert alert-${result.type}`}>
          <strong>HTTP {result.status}</strong>{result.message ? ` — ${result.message}` : ""}
        </div>
        <pre className="border rounded bg-light p-3 mb-0" style={{ maxHeight: 240, overflow: "auto" }}>
          {JSON.stringify(result.body, null, 2)}
        </pre>
      </section>}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h4 mb-0">Danh sách sinh viên</h2>
        <button className="btn btn-outline-primary" type="button" onClick={() => loadStudents(true)}>Tải lại</button>
      </div>
      <table className="table table-striped table-bordered table-hover">
        <thead><tr><th>Tên</th><th>Điểm</th><th>Thao tác</th></tr></thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.mark}</td>
              <td className="text-nowrap">
                <button className="btn btn-sm btn-info me-2" type="button" onClick={() => lookupStudent(student._id)}>Xem</button>
                <button className="btn btn-sm btn-warning me-2" type="button" onClick={() => editStudent(student)}>Sửa</button>
                <button className="btn btn-sm btn-danger" type="button" onClick={() => removeStudent(student._id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && <tr><td colSpan="3" className="text-center">Chưa có sinh viên</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
