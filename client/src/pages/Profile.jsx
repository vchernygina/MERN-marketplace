import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlise.js";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile || !currentUser?._id) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "mern_marketplace");

      // 1️⃣ Upload to Cloudinary
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dss13b2be/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log("Cloudinary response:", data);
      console.log("Cloudinary secure_url:", data.secure_url);
      alert(2);

      if (!data.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      console.log("Sending avatar to backend:", data.secure_url);
      console.log("Current user ID:", currentUser._id);

      // Update user in backend
      const updateRes = await fetch(
        `http://localhost:3000/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ avatar: data.secure_url }),
        }
      );

      const updatedUser = await updateRes.json();

      console.log("PUT status:", updateRes.status);
      console.log("Updated user from backend:", updatedUser);
      console.log("Updated avatar from backend:", updatedUser?.avatar);

      if (!updateRes.ok) {
        throw new Error(updatedUser.message || "User update failed");
      }

      // Update Redux
      dispatch(signInSuccess(updatedUser));
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];

    console.log("selectedFile:", selectedFile);
    console.log("currentUser:", currentUser);
    console.log("currentUser._id:", currentUser?._id);

    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl text-center font-semibold mb-6">Your profile</h1>

      <form className="flex flex-col gap-4">
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={handleChange}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={currentUser?.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full self-center object-cover cursor-pointer"
        />

        {uploading && (
          <p className="text-center text-sm text-gray-500">Uploading...</p>
        )}

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />

        <button
          type="button"
          className="bg-gray-500 text-white p-3 rounded-lg hover:opacity-90"
        >
          Update
        </button>

        <button
          type="button"
          className="bg-green-600 text-white p-3 rounded-lg hover:opacity-90"
        >
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
