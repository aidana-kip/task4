import Login from "./Login";
import Register from "./Register";
import Users from "./Users";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["access-token"] = token;
  }
  return config;
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
