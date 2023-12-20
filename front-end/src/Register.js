import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBeer } from "react-icons/fa";
const baseURL =
  "http://task4-env.eba-sp5dwj22.us-east-1.elasticbeanstalk.com/users/";

function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onFormSubmit = () => {
    const user = {
      email: email,
      name: name,
      password: password,
    };

    console.log(user);
    axios
      .post(baseURL, user)
      .then((res) => {
        if (res.status === 201) {
          navigate("/login");
        } else if (res.status === 400) {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
      });
  };

  return (
    <div className="container">
      <div className="authorization__box">
        <h2>Sign-up</h2>
        {error !== "" ? <p style={{ color: "red" }}>{error}</p> : null}
        <form action="" onSubmit={handleSubmit} className="form">
          <label htmlFor="name">
            <strong>Name </strong>
          </label>
          <input
            type="text"
            value={name}
            placeholder="Enter Name"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
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
        <button type="submit" className="btn" onClick={onFormSubmit}>
          Register
        </button>
        <Link to="/login" className="btn__link">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Register;
