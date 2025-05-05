import api from "./api";

export async function login(email, senha) {
  const res = await api.get(
    `/api/usuarios/login?email=${email}&senha=${senha}`
  );
  return res.data;
}
