import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="
        fixed inset-0 z-10
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        px-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        action=""
        className="
          relative w-full max-w-md
          rounded-xl
          border border-white/10
          bg-[var(--bg-app)]/95
          p-6 sm:p-8
          text-white
          shadow-2xl shadow-black/10
        "
      >
        <h1 id="login-title" className="text-center text-2xl font-medium">
          {state}
        </h1>
        <p className="text-center text-white/70 mt-1">
          {state === "Login"
            ? "Please login to continue"
            : "Please register with us to continue"}
        </p>

        {state !== "Login" && (
          <label className="border border-white/10 px-4 py-2.5 flex items-center gap-2 rounded-full mt-5 focus-within:border-white/20">
            <img src={assets.lock_icon} alt="" className="opacity-80" />
            <input
              type="text"
              placeholder="Full Name"
              className="bg-transparent outline-none text-sm placeholder-white/40 flex-1"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
        )}

        <label className="border border-white/10 px-4 py-2.5 flex items-center gap-2 rounded-full mt-4 focus-within:border-white/20">
          <img src={assets.email_icon} alt="" className="opacity-80" />
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent outline-none text-sm placeholder-white/40 flex-1"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>

        <label className="border border-white/10 px-4 py-2.5 flex items-center gap-2 rounded-full mt-4 focus-within:border-white/20">
          <img src={assets.lock_icon} alt="" className="opacity-80" />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent outline-none text-sm placeholder-white/40 flex-1"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoComplete="current-password"
          />
        </label>

        {state === "Login" && (
          <div className="mt-4 text-sm text-white/70 text-left px-2">
            Forgot Password?
          </div>
        )}

        <button
          className="
            py-2.5 text-center w-full rounded-full mt-5 font-medium
            text-black bg-[var(--accent-orange)]
            hover:opacity-90
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
            transition-colors
          "
        >
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center text-white/70">
            Don't have an account?{" "}
            <span
              className="text-[var(--accent-orange)] cursor-pointer hover:opacity-90"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center text-white/70">
            Already have an account?{" "}
            <span
              className="text-[var(--accent-orange)] cursor-pointer hover:opacity-90"
              onClick={() => setState("Login")}
            >
              Sign In
            </span>
          </p>
        )}

        <img
          src={assets.cross_icon}
          alt=""
          className="absolute top-4 right-4 cursor-pointer opacity-80 hover:opacity-100"
          onClick={() => setShowLogin(false)}
        />
      </motion.form>
    </div>
  );
};

export default Login;
