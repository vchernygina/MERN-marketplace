import React from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl text-center font-semibold mb-6">Your profile</h1>

      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full self-center object-cover"
        />

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-gray-500 text-white p-3 rounded-lg hover:opacity-90">
          Update
        </button>

        <button className="bg-green-600 text-white p-3 rounded-lg hover:opacity-90">
          Create listing
        </button>
      </form>

      <div className="flex justify-between mt-6">
        <span className="text-red-600 cursor-pointer">Delete Account</span>
        <span className="text-red-600 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
