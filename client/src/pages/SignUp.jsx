import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import GoogleAuth from "../components/GoogleAuth";

export default function SingUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handlerChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Signup failed");
        return;
      }

      setLoading(false);
      setError(null);
      nav("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto my-7 p-3 mb-7">
      <h1 className="text-3xl text-center font-semibold mb-7">Sing In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-3">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="name"
          onChange={handlerChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handlerChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handlerChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 rounded-lg uppercase hover:opacity-75 cursor-pointer"
        >
          {loading ? "Loading ..." : "Sign up"}
        </button>
        <GoogleAuth />
      </form>
      <div className="flex gap-2 mb-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-black-500">Sign in</span>
        </Link>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
