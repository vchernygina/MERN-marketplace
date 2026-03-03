import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto pb-3">
      <h1 className="text-3xl font-semibold text-center mb-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
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
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          ></textarea>
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
                max="10"
                required
                className="p-3 border border-grey-300 rounded-lg"
              />
              <div className="flex flex-col item-center">
                <label htmlFor="regular-price">Regular price</label>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discount-price"
                min="1"
                max="10"
                required
                className="p-3 border border-grey-300 rounded-lg"
              />
              <div className="flex flex-col item-center">
                <label htmlFor="discount-price">Discount Price</label>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex ">
            <input
              className="p-3 border border-gray-600 rounded w-full mr-2"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 border cursor-pointer text-green-700 border-green-700 rounded uppercase hover:shadow-lg desabled:opacity-80">
              Upload11
            </button>
          </div>
          <button className="p-3 bg-gray-700 text-white cursor-pointer rounded-lg uppercase hover:opacity-75 desabled:opacity-80">
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
}
