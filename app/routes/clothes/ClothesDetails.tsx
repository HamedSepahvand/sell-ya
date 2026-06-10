import type { Route } from "./+types";
import type { ClotheProps } from "~/types";
import { Link } from "react-router";
import { fileContentDB } from "~/api/local";
import { FaArrowLeft, FaMailBulk, FaPhone } from "react-icons/fa";
import { useState } from "react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { id }: any = params;

  const data = JSON.parse(fileContentDB);

  const items = data.categories.clothes;

  const item = items.filter((item: ClotheProps) => item.id === id);
  console.log(item.images);

  return { item };
}

const ClothesDetails = ({ loaderData }: Route.ComponentProps) => {
  const data = { loaderData };
  const item = data.loaderData.item[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = item.images;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  // اگر عکسی وجود نداشته باشه
  if (!images || images.length === 0) return null;

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  };

  const getGenderColor = (gender: string) => {
    return gender === "Boy" || gender === "Male"
      ? "text-cyan-300"
      : "text-pink-400";
  };

  console.log(item);

  return (
    <>
      <Link
        to={"/clothes"}
        className="flex items-center text-red-400 hover:text-blue-500 mb-6 transition"
      >
        <FaArrowLeft className="mr-2" /> Back To Clothes
      </Link>
      <div className="flex justify-between items-center gap-5">
        <div className="w-3xl ">
          <h1 className="text-4xl font-bold text-red-100">{item.title}</h1>
          <div className="text-xl font-semibold text-red-100 border border-pink-950 w-[92%] rounded-lg p-4 mt-6">
            <div
              className={`flex flex-col justify-between border-b border-red-900 pb-4`}
            >
              <h2 className="text-base">Gender:</h2>
              <div className="relative mb-5">
                <h2
                  className={`absolute right-1 mt-1 ${getGenderColor(item.specificData.gender)}`}
                >
                  {item.specificData.gender}
                </h2>
              </div>
            </div>
            <div className="flex flex-col justify-between border-b border-red-900 py-4">
              <h2 className="text-base">Age Group:</h2>
              <div className="relative mb-5">
                <h2 className={"absolute right-1"}>
                  {item.specificData.ageGroup}
                </h2>
              </div>
            </div>
            <div className="flex flex-col justify-between border-b border-red-900 py-4">
              <h2 className="text-base">Material:</h2>
              <div className="relative mb-5">
                <h2 className={"absolute right-1 mt-1 line-clamp-1 text-base"}>
                  {item.specificData.fabricMaterial}
                </h2>
              </div>
            </div>
            <div className="flex flex-col justify-between border-b border-red-900 py-4">
              <h2 className="text-base">Size:</h2>
              <div className="relative mb-5">
                {" "}
                <h2 className={"absolute right-1 "}>
                  {item.specificData.size}
                </h2>
              </div>
            </div>
            <div className="flex flex-col justify-between py-2">
              <h2 className="text-base">Brand:</h2>
              <div className="relative mb-4">
                {" "}
                <h2 className={"absolute right-1"}>
                  {item.specificData.brand}
                </h2>
              </div>
            </div>
          </div>

          <p className="mt-5 text-lg text-cyan-100 w-[92%]">
            {item.description}
          </p>
        </div>
        <div className="w-3xl flex flex-col">
          <div className="relative overflow-hidden object-cover rounded-lg w-full h-full group">
            <img
              src={`/images/clothes-images/${images[currentIndex]}`}
              alt={`product image ${currentIndex + 1}`}
              className="w-full h-100 object-cover transition-all duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  ❮
                </button>

                <button
                  onClick={goToNext}
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  ❯
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between">
            <div className="mt-[3%]">
              <h3 className="text-red-200 mt-[3%]">{timeAgo(item.dateTime)}</h3>
              <h3 className="mt-2">
                <a href="#" className="no-decoration text-pink-300">
                  {item.city}
                </a>
                {"  "}/{"  "}
                <a href="#" className="no-decoration  text-pink-400">
                  {item.neighborhood}
                </a>
              </h3>
            </div>
            <div className="flex flex-col items-center gap-2 mt-4">
              {item.isUrgent && (
                <h2 className="mr-8 p-1 bg bg-blue-700 rounded-xl w-15 text-center">
                  Urgent
                </h2>
              )}
              {item.isNew && (
                <h2 className="mr-8 p-1 bg bg-red-700 rounded-xl w-15 text-center">
                  New
                </h2>
              )}
            </div>
          </div>
          <h1 className="text-4xl mt-3 text-fuchsia-400">${item.price}</h1>
        </div>
      </div>
      <div className="felx items-center justify-between gap-5">
        <div className="flex items-center justify-between gap-3 mt-8">
          {item.showPhone && (
            <Link
              to={`tel:${item.contact.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md"
              title={`شماره: ${item.contact.phone}`}
            >
              <FaPhone />
              <span>Call the seller</span>
            </Link>
          )}

          {item.showEmail && (
            <Link
              to={`mailto:${item.contact.email}`}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md"
            >
              <FaMailBulk />
              <span>Email the seller</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ClothesDetails;
