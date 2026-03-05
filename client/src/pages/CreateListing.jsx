import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  console.log(formData);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 МБ
  const MAX_FILES = 6;

  // Uploading a single file to Cloudinary
  const storeImage = (file, setProgress) => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_FILE_SIZE) {
        reject(`Файл ${file.name} перевищує 2 МБ`);
        return;
      }

      const formDataCloud = new FormData();
      formDataCloud.append("file", file);
      formDataCloud.append("upload_preset", "mern_marketplace"); // твій preset

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://api.cloudinary.com/v1_1/dss13b2be/image/upload"
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          if (setProgress)
            setProgress((prev) => ({ ...prev, [file.name]: percent }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(`Помилка завантаження ${file.name}`);
        }
      };

      xhr.onerror = () => reject(`Network error: ${file.name}`);
      xhr.send(formDataCloud);
    });
  };

  const handleImageSubmit = () => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    if (filesArray.length > MAX_FILES) {
      alert(`You can load max ${MAX_FILES} files`);
      return;
    }

    const tooLargeFiles = filesArray.filter((f) => f.size > MAX_FILE_SIZE);
    if (tooLargeFiles.length > 0) {
      alert(
        `files ${tooLargeFiles
          .map((f) => f.name)
          .join(", ")} exceeds 2 MB and will not be uploaded.`
      );
    }

    const validFiles = filesArray.filter((f) => f.size <= MAX_FILE_SIZE);
    if (validFiles.length === 0) return;

    const promises = validFiles.map((file) =>
      storeImage(file, setUploadProgress).catch((err) => {
        console.error(err);
        return null;
      })
    );

    Promise.all(promises).then((urls) => {
      const filteredUrls = urls.filter(Boolean);
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(filteredUrls),
      }));
      setUploadProgress({});

      setFiles([]);
    });
  };

  // Deleting a picture
  const handleDeleteImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((u) => u !== url),
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must add some image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be low then regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("http://localhost:3000/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const text = await res.text();
      console.log("STATUS:", res.status);
      console.log("RESPONSE:", text.slice(0, 200));
      const data = JSON.parse(text);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto pb-3">
      <h1 className="text-3xl font-semibold text-center mb-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left part of the form */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="4"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <label htmlFor="sale">Sale</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-grey-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms">Bedrooms</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-grey-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border border-grey-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col">
                <label htmlFor="regularPrice">Regular price</label>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  className="p-3 border border-grey-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col">
                  <label htmlFor="discountPrice">Discount Price</label>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right part of the form: files */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <input
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            id="images"
            accept="image/*"
            multiple
            className="p-3 border border-gray-600 rounded w-full"
          />
          <button
            type="button"
            onClick={handleImageSubmit}
            className="p-3 border cursor-pointer text-green-700 border-green-700 rounded uppercase hover:shadow-lg mt-2"
          >
            Upload
          </button>

          {/* Progress bar */}
          {Object.keys(uploadProgress).map((fileName) => (
            <div key={fileName} className="mb-1">
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: `${uploadProgress[fileName]}%` }}
                />
              </div>
              <span className="text-xs">
                {fileName} — {uploadProgress[fileName]}%
              </span>
            </div>
          ))}

          {/* Output of downloaded images from Delete */}
          {formData.imageUrls.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 border p-1 w-full rounded border-gray-300"
                >
                  <img
                    src={url}
                    alt={`uploaded-${idx}`}
                    className="max-w-[150px] rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(url)}
                    className="bg-gray-400 text-white px-2 py-1 cursor-pointer rounded hover:bg-gray-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-400 text-white p-3 uppercase cursor-pointer rounded hover:bg-gray-600"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
