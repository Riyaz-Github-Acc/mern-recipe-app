import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { Form } from "../components";
import "./Auth.css";

const Auth = () => {
  return (
    <div className="auth">
      <div className="container auth-container">
        <Login />
        <Register />
      </div>
    </div>
  );
};

export default Auth;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError(true);
      setNotificationError("Please Enter a Username and Password!!!");
    } else {
      try {
        const res = await axios.post("http://localhost:3100/auth/login", {
          username,
          password,
        });

        setCookies("access_token", res.data.token);
        window.localStorage.setItem("userID", res.data.userID);
        navigate("/");
      } catch (err) {
        setError(true);
        setNotificationError("Invalid Username or Password!!!");
      }
    }
  };

  return (
    <Form
      title="Login"
      userId="loginUsername"
      userPass="loginPassword"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      error={error}
      notificationError={notificationError}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [success, setSuccess] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError(true);
      setNotificationError("Please Enter a Username and Password!!!");
    } else {
      try {
        const res = await axios.post("http://localhost:3100/auth/register", {
          username,
          password,
        });

        if (res.status === 409) {
          setError(true);
          setNotificationError(res.data.message);
          setNotificationSuccess("");
        } else {
          setSuccess(true);
          setNotificationSuccess(res.data.message);

          setUsername("");
          setPassword("");
          setError(false);
          setNotificationError("");
        }
      } catch (err) {
        setError(true);
        setNotificationError("User Name Already Taken!!!");
        setNotificationSuccess("");
        setUsername("");
        setPassword("");
      }
    }
  };

  return (
    <Form
      title="Register"
      userId="regUsername"
      userPass="regPassword"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      error={error}
      notificationError={notificationError}
      success={success}
      notificationSuccess={notificationSuccess}
    />
  );
};
