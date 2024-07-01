import React, { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const session = await signIn(username, password);
      console.log('Sign in successful', session);
      if (session && typeof session.AccessToken !== 'undefined') {
        sessionStorage.setItem('accessToken', session.AccessToken);
        if (sessionStorage.getItem('accessToken')) {
          window.location.href = '/';
        } else {
          console.error('Session token was not set properly.');
        }
      } else {
        console.error('SignIn session or AccessToken is undefined.');
      }
    } catch (error) {
      alert(`Sign in failed: ${error}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await signUp(username, password);
      navigate('/confirm', { state: { username } });
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    }
  };



  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }
    // Add login logic here
    setError(""); // Reset error if fields are filled
    navigate("/");
  };

  return (
    <div className="login-container">
      <div id="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSignIn}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
