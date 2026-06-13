import type { Route } from "./+types";
import type { HouseProps } from "~/types";
import { fileContentDB } from "~/api/local";
import ItemCard from "~/components/ItemCard";
import { FaFilter, FaTimes, FaTshirt } from "react-icons/fa";
import Pagination from "~/components/Pagination";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export async function loader({ request }: Route.LoaderArgs): Promise<any> {
  const data = JSON.parse(fileContentDB);
  return { items: data };
}

const HousePage = ({ loaderData }: Route.ComponentProps) => {
  const { items } = loaderData;
  const forSale = items.categories.house.forSale;
  const forRent = items.categories.house.forRent;
  const allHouses: HouseProps[] = [
    ...Object.values(forSale),
    ...Object.values(forRent),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFor, setSelectedFor] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [meterageRange, setMeterageRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const itemsPerPage = 6;

  const maxPrice = useMemo(
    () => Math.max(...allHouses.map((item: HouseProps) => item.price), 0),
    [allHouses],
  );

  const maxMeterage = useMemo(
    () =>
      Math.max(
        ...allHouses.map((item: HouseProps) => item.specificData.areaSqm),
        0,
      ),
    [allHouses],
  );

  const selectedForOptions = [
    {
      value: "forRent",
      label: "For Rent",
    },
    {
      value: "forSale",
      label: "For Sale",
    },
  ];

  const matchesFor = (item: HouseProps) => {
    if (selectedFor.length === 0) return true;
    return selectedFor.includes(item.specificData.listingType);
  };

  const matchesSearch = (item: HouseProps) => {
    if (!searchFilter || searchFilter.trim() === "") return true;
    return item.title.toLowerCase().includes(searchFilter.toLowerCase().trim());
  };

  const filteredHouses = useMemo(() => {
    return allHouses.filter((item: HouseProps) => {
      if (!matchesFor(item)) return false;
      if (!matchesSearch(item)) return false;

      const minPrice = priceRange.min === "" ? 0 : Number(priceRange.min);
      const maxPriceVal =
        priceRange.max === "" ? Infinity : Number(priceRange.max);
      if (item.price < minPrice || item.price > maxPriceVal) return false;

      const minMeterage =
        meterageRange.min === "" ? 0 : Number(meterageRange.min);
      const maxMeterageVal =
        meterageRange.max === "" ? Infinity : Number(meterageRange.max);
      if (
        item.specificData.areaSqm < minMeterage ||
        item.specificData.areaSqm > maxMeterageVal
      )
        return false;

      return true;
    });
  }, [
    selectedFor,
    priceRange.min,
    priceRange.max,
    meterageRange.min,
    meterageRange.max,
    searchFilter,
    allHouses,
  ]);

  const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredHouses.slice(indexOfFirst, indexOfLast);

  const clearFilters = () => {
    setSelectedFor([]);
    setPriceRange({ min: "", max: "" });
    setMeterageRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedFor.length > 0 ||
    priceRange.min !== "" ||
    priceRange.max !== "" ||
    meterageRange.min !== "" ||
    meterageRange.max !== "";

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12)
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
      <div className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold flex items-center gap-2">
              <FaTshirt /> House
            </h2>
          </div>

          <div className=" flex gap-4">
            <input
              placeholder="Search ..."
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              type="text"
              className="cursor-pointer flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 w-full"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              <FaFilter />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && (
                <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-2 py-0.5">
                  {selectedFor.length +
                    (priceRange.min !== "" || priceRange.max !== "" ? 1 : 0) +
                    (meterageRange.min !== "" || meterageRange.max !== ""
                      ? 1
                      : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-[#180501] border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl font-semibold">
                  Filter Products
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <FaTimes /> Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-white block mb-3 font-medium">
                    Listing Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedForOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedFor((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((g) => g !== option.value)
                              : [...prev, option.value],
                          );
                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                          selectedFor.includes(option.value)
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-3 font-medium">
                    Price Range ($)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder={`Min (0 - ${maxPrice.toLocaleString()})`}
                        value={priceRange.min}
                        onChange={(e) => {
                          setPriceRange({ ...priceRange, min: e.target.value });
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder={`Max (0 - ${maxPrice.toLocaleString()})`}
                        value={priceRange.max}
                        onChange={(e) => {
                          setPriceRange({ ...priceRange, max: e.target.value });
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400 text-sm">
                    Max price: ${maxPrice.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-3 font-medium">
                    Meterage Range (m²)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder={`Min (0 - ${maxMeterage.toLocaleString()})`}
                        value={meterageRange.min}
                        onChange={(e) => {
                          setMeterageRange({
                            ...meterageRange,
                            min: e.target.value,
                          });
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder={`Max (0 - ${maxMeterage.toLocaleString()})`}
                        value={meterageRange.max}
                        onChange={(e) => {
                          setMeterageRange({
                            ...meterageRange,
                            max: e.target.value,
                          });
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400 text-sm">
                    Max Meterage: {maxMeterage.toLocaleString()} m²
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-300">
                  Found{" "}
                  <span className="text-red-500 font-bold">
                    {filteredHouses.length}
                  </span>{" "}
                  items
                  {filteredHouses.length !== allHouses.length && (
                    <span className="text-gray-400">
                      {" "}
                      (filtered from {allHouses.length} total)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredHouses.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-6"
            >
              {currentItems.map((item: HouseProps) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ItemCard type={"house"} item={item} timeAgo={timeAgo} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaTshirt className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No items found matching your filters
          </p>
          <button
            onClick={clearFilters}
            className="cursor-pointer mt-4 text-red-500 hover:text-red-400 underline"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default HousePage;
