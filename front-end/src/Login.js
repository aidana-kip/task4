import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const baseURL =
    "http://task4-env.eba-sp5dwj22.us-east-1.elasticbeanstalk.com/users/login";

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onLogin = () => {
    axios
      .post(baseURL, { email: email, password: password })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", res.data.user.name);
          navigate("/users");
        }
      })
      .catch((err) => {
        console.log(err);
        setErr(err.response.data.message);
      });
  };

  return (
    <div className="container">
      <div className="authorization__box">
        <h2>Sign-in</h2>
        {err !== "" ? <p style={{ color: "red" }}>{err}</p> : null}
        <form action="" onSubmit={handleSubmit} className="form">
          <label htmlFor="email">
            <strong>Email</strong>
          </label>
          <input
            type="text"
            value={email}
            placeholder="Enter Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            value={password}
            placeholder="Enter Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <button type="submit" className="btn" onClick={onLogin}>
          Login
        </button>
        <Link to="/register" className="btn__link">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
