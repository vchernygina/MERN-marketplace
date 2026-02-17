import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlise";

export default function SingIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handlerChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || "Signup failed"));
        return;
      }

      dispatch(signInSuccess(data));
      nav("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="max-w-[600px] mx-auto my-7 p-3 mb-7">
      <h1 className="text-3xl text-center font-semibold mb-7">Sing In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-3">
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
          className="bg-black-700 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading ..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mb-5">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-black-500">Sign up</span>
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
