"use client";

import React, { useEffect, useState } from "react";
import "@/css/login.scss";
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { SlLock } from "react-icons/sl";
import Image from "next/image";
import TheFlexLogo from "@/images/logo.svg";
import { login } from "@/lib/apiHelper";
import { useRouter } from "next/navigation";

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      router.push("/dashboard");
      return;
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ email, password });

      if (res.success && res.data?.token) {
        localStorage.setItem(
          "auth",
          JSON.stringify({ token: res.data.token, user: res.data.user })
        );
        router.push("/dashboard");
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-left">
        <div className="logo">
          <Image src={TheFlexLogo} alt="The Flex Logo" width={120} height={40} />
        </div>
        <div>
          <h1>Welcome Back!</h1>
          <p>Log in to manage properties, track reviews, and gain insights</p>
        </div>
      </div>

      <div className="signin-right">
        <h2>Login To Continue</h2>
        <p className="subtitle">
          Manage properties, track reviews, and gain insights
        </p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaRegUser className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <SlLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
