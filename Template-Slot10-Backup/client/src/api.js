const API = import.meta.env.VITE_API_URL || "http://localhost:3007/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json();
  const result = { status: response.status, data };
  if (!response.ok) {
    const error = new Error(data.message || "API error");
    error.response = result;
    throw error;
  }
  return result;
}

export const getStudents = () => request("/students");

export const getStudent = (id) => {
  // TODO: Gọi GET /students/:id.
};

export const addStudent = (student) => {
  // TODO: Gọi POST /students và gửi student dạng JSON.
};

export const updateStudent = (id, student) => {
  // TODO: Gọi PATCH /students/:id để sửa một phần.
};

export const replaceStudent = (id, student) => {
  // TODO: Gọi PUT /students/:id để thay toàn bộ thông tin.
};

export const deleteStudent = (id) => {
  // TODO: Gọi DELETE /students/:id.
};
