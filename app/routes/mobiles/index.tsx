import type { Route } from "../mobiles/+types";
import type { MobileProps } from "~/types";
import { readDB } from "~/api/local";
import ItemCard from "~/components/ItemCard";
import { FaFilter, FaTimes, FaMobile } from "react-icons/fa";
import Pagination from "~/components/Pagination";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export async function loader({ request }: Route.LoaderArgs): Promise<any> {
  const data = await readDB();
  return { items: data };
}

const Mobiles = ({ loaderData }: Route.ComponentProps) => {
  const { items } = loaderData;
  const allMobiles = items.categories.mobile;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const itemsPerPage = 6;

  // Get max price
  const maxPrice = useMemo(
    () => Math.max(...allMobiles.map((item: MobileProps) => item.price), 0),
    [allMobiles],
  );

  // Filter options based on title keywords
  const brandOptions = [
    "Samsung",
    "Apple",
    "Xiaomi",
    "Google",
    "OnePlus",
    "Asus",
    "Nothing",
  ];

  const storageOptions = [64, 128, 256, 512, 1024];

  // Check if item matches brand filter based on title
  const matchesBrand = (item: MobileProps) => {
    if (selectedBrands.length === 0) return true;

    return selectedBrands.includes(item.specificData.brand);
  };

  // Check if item matches storage filter based on number
  const matchesStorage = (item: MobileProps) => {
    if (selectedStorage.length === 0) return true;

    return selectedStorage.includes(item.specificData.storageGB);
  };

  const matchesSearch = (item: MobileProps) => {
    if (!searchFilter.trim()) return true;

    const title = item.title.toLowerCase();
    const search = searchFilter.toLowerCase().trim();

    return title.includes(search);
  };

  // Filter mobiles based on brand, storage, and price
  const filteredMobiles = useMemo(() => {
    return allMobiles.filter((item: MobileProps) => {
      if (!matchesBrand(item)) return false;

      if (!matchesStorage(item)) return false;

      if (!matchesSearch(item)) return false;

      const minPrice = priceRange.min === "" ? 0 : Number(priceRange.min);

      const maxPriceVal =
        priceRange.max === "" ? Infinity : Number(priceRange.max);

      if (item.price < minPrice || item.price > maxPriceVal) return false;

      return true;
    });
  }, [allMobiles, selectedBrands, selectedStorage, priceRange, searchFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMobiles.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredMobiles.slice(indexOfFirst, indexOfLast);

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedStorage([]);
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  // Check if any filter is active
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedStorage.length > 0 ||
    priceRange.min !== "" ||
    priceRange.max !== "";

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

  console.log("loaderData", loaderData);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
      <div className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold flex items-center gap-2">
              <FaMobile /> Mobiles
            </h2>
            <div className="h-1 w-20 bg-red-500 mt-2 rounded-full"></div>
          </div>

          {/* Filter Toggle Button and Search Input */}
          <div className="flex gap-2">
            {" "}
            <input
              placeholder="Search ..."
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              type="text"
              className="w-full cursor-pointer flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer w-full"
            >
              <FaFilter />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
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
                {/* Brand Filter */}
                <div>
                  <label className="text-white block mb-3 font-medium">
                    Brand
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {brandOptions.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSelectedBrands((prev) =>
                            prev.includes(brand)
                              ? prev.filter((b) => b !== brand)
                              : [...prev, brand],
                          );

                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                          selectedBrands.includes(brand)
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Filter */}
                <div>
                  <label className="text-white block mb-3 font-medium">
                    Storage
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => {
                          setSelectedStorage((prev) =>
                            prev.includes(storage)
                              ? prev.filter((s) => s !== storage)
                              : [...prev, storage],
                          );

                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                          selectedStorage.includes(storage)
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {storage >= 1024 ? "1TB" : `${storage}GB`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
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
              </div>

              {/* Filter Stats */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-300">
                  Found{" "}
                  <span className="text-red-500 font-bold">
                    {filteredMobiles.length}
                  </span>{" "}
                  items
                  {filteredMobiles.length !== allMobiles.length && (
                    <span className="text-gray-400">
                      {" "}
                      (filtered from {allMobiles.length} total)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      {filteredMobiles.length > 0 ? (
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
              {currentItems.map((item: MobileProps) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ItemCard type="mobiles" item={item} timeAgo={timeAgo} />
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
          <FaMobile className="text-6xl text-gray-600 mx-auto mb-4" />
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

export default Mobiles;
