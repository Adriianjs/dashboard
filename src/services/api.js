import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.248.29:8080/api",
});

export default api;
