import React, { useState } from "react";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [uploadProgress, setUploadProgress] = useState({});
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 МБ
  const MAX_FILES = 6;

  // Завантаження одного файлу на Cloudinary
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

  // Завантаження всіх файлів
  const handleImageSubmit = () => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    if (filesArray.length > MAX_FILES) {
      alert(`Можна завантажити максимум ${MAX_FILES} файлів`);
      return;
    }

    const tooLargeFiles = filesArray.filter((f) => f.size > MAX_FILE_SIZE);
    if (tooLargeFiles.length > 0) {
      alert(
        `Файл(и) ${tooLargeFiles
          .map((f) => f.name)
          .join(", ")} перевищує 2 МБ і не будуть завантажені.`
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
    });
  };

  // Видалення картинки
  const handleDeleteImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((u) => u !== url),
    }));
  };

  return (
    <main className="p-3 max-w-4xl mx-auto pb-3">
      <h1 className="text-3xl font-semibold text-center mb-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        {/* Ліва частина форми */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <label htmlFor="sale">Sale</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="beds"
                min="1"
                max="10"
                required
                className="p-3 border border-grey-300 rounded-lg"
              />
              <label htmlFor="beds">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-grey-300 rounded-lg"
              />
              <label htmlFor="bedrooms">Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regular-price"
                min="1"
                max="1000000"
                required
                className="p-3 border border-grey-300 rounded-lg"
              />
              <div className="flex flex-col">
                <label htmlFor="regular-price">Regular price</label>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discount-price"
                min="0"
                max="1000000"
                className="p-3 border border-grey-300 rounded-lg"
              />
              <div className="flex flex-col">
                <label htmlFor="discount-price">Discount Price</label>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Права частина форми: файли */}
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

          {/* Прогрес-бар */}
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

          {/* Вивід завантажених картинок з Delete */}
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
        </div>
      </form>
    </main>
  );
}
