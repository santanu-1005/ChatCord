import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";

const Avatar = ({ name, src, onImagechange }) => {
  const [imgError, setImgError] = useState(false);
  const [imageUrl, setImageurl] = useState(src);
  const fileInputRef = useRef(null);

  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== "string") return "?";

    const words = fullName.trim().split(" ");

    if (words.length === 1) {
      return words[0][0]?.toUpperCase() || "?";
    }

    return words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  useEffect(() => {
    setImageurl(src);
  }, [src]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageurl(url);
      setImgError(false);
      onImagechange(file);
    }
  }

  return (
    <>
      <div
        className={
          "flex items-center justify-center border-white border-2 bg-gray-500 w-30 h-30 rounded-full"
        }
      >
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => {
              setImgError(true);
            }}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-white text-6xl">{getInitials(name)}</span>
        )}
      </div>
      <FaPlus
        onClick={() => fileInputRef.current.click()}
        className="relative top-22 -translate-x-6 w-6 h-6 bg-white rounded-full cursor-pointer"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        className="w-full h-full object-cover rounded-full"
      />
    </>
  );
};

export default Avatar;
