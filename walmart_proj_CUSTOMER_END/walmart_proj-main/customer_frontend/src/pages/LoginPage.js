import React, { useState } from "react";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister
        ? "http://localhost:4000/auth/register"
        : "http://localhost:4000/auth/login";
      const res = await axios.post(url, { username, password });
      onLogin(res.data);
    } catch (err) {
      setError("Invalid credentials or username taken");
    }
  };

  return (
    <div
      style={{
        background: "#e8f5e9",
        padding: 32,
        borderRadius: 8,
        maxWidth: 400,
        margin: "40px auto",
      }}
    >
      <h2 style={{ color: "#388e3c" }}>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ margin: 8, padding: 8, width: "90%" }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          style={{ margin: 8, padding: 8, width: "90%" }}
        />
        <button
          type="submit"
          style={{
            background: "#388e3c",
            color: "white",
            padding: 8,
            margin: 8,
            border: "none",
            borderRadius: 4,
          }}
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsRegister(!isRegister)}
        style={{
          background: "none",
          color: "#388e3c",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isRegister ? "Already have an account? Login" : "No account? Register"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default LoginPage;
