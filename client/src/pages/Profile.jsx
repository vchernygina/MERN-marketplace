import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlise.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlise.js";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [formDataIssue, setFormDataIssue] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

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

      if (!data.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

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

  const handleChangeData = (e) => {
    setFormDataIssue({ ...formDataIssue, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formDataIssue),
      });

      const data = await res.json();

      if (!res.ok || data?.success === false) {
        const msg = data?.message || "Update failed";
        dispatch(updateUserFailure(msg));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message || "Something went wrong"));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl text-center font-semibold mb-6">Your profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          placeholder="username!!!!"
          id="name"
          defaultValue={currentUser.name}
          className="border p-3 rounded-lg"
          onChange={handleChangeData}
        />

        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChangeData}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChangeData}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-gray-500 
            text-white 
            p-3 
            rounded-lg 
            hover:opacity-90
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:opacity-50"
        >
          {loading ? "loading... " : "Update"}
        </button>

        <button
          type="button"
          className="bg-green-600 text-white p-3 rounded-lg hover:opacity-90"
        >
          Create listing
        </button>
      </form>

      <div className="flex justify-between mt-6">
        <span
          onClick={handleDeleteUser}
          className="text-red-600 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-600 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-600 mb-5">{error ? error : ""}</p>
      <p className="text-green-600 mb-5">
        {updateSuccess ? "User is updated Success!!!!" : ""}
      </p>
    </div>
  );
}
