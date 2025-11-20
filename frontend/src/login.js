import React, { useState } from "react";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Feature: Password Analysis Data
  const [strengthData, setStrengthData] = useState(null);
  
  // Feature: Show/Hide Password
  const [showPassword, setShowPassword] = useState(false);

  // Feature: Login Success Screen
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleCheckAndLogin = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    // Reset error
    setError("");

    try {
      // 1. Send Password to Python Backend
      const response = await fetch("http://127.0.0.1:5000/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password }),
      });

      const data = await response.json();
      setStrengthData(data);

      // 2. Login Logic: Only allow login if score is 3 or higher (Moderate+)
      if (data.score >= 3) {
        setTimeout(() => {
           setIsLoggedIn(true);
        }, 500); 
      } else {
        setError("Password is too weak. Add numbers or symbols!");
      }

    } catch (err) {
      console.error(err);
      setError("Error connecting to backend. Make sure Python is running.");
    }
  };

  // Helper to pick color based on score
  const getColor = (score) => {
    if (score === 0) return "red";
    if (score < 3) return "orange";
    if (score === 3) return "#FFD700"; // Gold
    if (score >= 4) return "green";
    return "gray";
  };

  // --- VIEW 1: WELCOME DASHBOARD (If Logged In) ---
  if (isLoggedIn) {
    return (
      <div className="login-container">
        <div className="dashboard">
          <h1>🎉 Welcome!</h1>
          <p>You have logged in securely.</p>
          <button 
            type="button" 
            className="logout-btn"
            onClick={() => window.location.reload()}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: LOGIN FORM ---
  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleCheckAndLogin}>
        <h2>Password Analyzer</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Wrapper for Eye Icon */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"} 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1" // Prevents tabbing to the icon
          >
            {showPassword ? "🙈" : "👁️"} 
          </button>
        </div>

        {/* The Main Submit Button */}
        <button type="submit" className="submit-btn">
          Check Strength & Login
        </button>

        {/* Visual Strength Bar */}
        {strengthData && (
          <div className="strength-section">
            <hr />
            <div className="strength-header">
                <strong>Strength: <span style={{ color: getColor(strengthData.score) }}>{strengthData.strength}</span></strong>
                <span>{strengthData.score}/5</span>
            </div>

            <div className="strength-bar-container">
              <div 
                className="strength-bar-fill" 
                style={{ 
                    width: `${(strengthData.score / 5) * 100}%`, 
                    backgroundColor: getColor(strengthData.score) 
                }}
              ></div>
            </div>
            
            {strengthData.feedback.length > 0 && (
              <ul className="feedback-list">
                {strengthData.feedback.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

      </form>
    </div>
  );
}

export default Login;