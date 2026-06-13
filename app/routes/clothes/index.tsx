import type { Route } from "./+types";
import type { ClotheProps } from "~/types";
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

const Clothes = ({ loaderData }: Route.ComponentProps) => {
  const { items } = loaderData;
  const allClothes = items.categories.clothes;

  // State for filters
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const itemsPerPage = 6;

  // Get max price
  const maxPrice = useMemo(
    () => Math.max(...allClothes.map((item: ClotheProps) => item.price), 0),
    [allClothes],
  );

  // Filter options based on title keywords
  const genderOptions = [
    {
      value: "Male",
      label: "Men",
      keywords: ["Male"],
    },
    {
      value: "women",
      label: "Women",
      keywords: ["Women", "Female", "woman", "lady"],
    },
    { value: "Boy", label: "Boy", keywords: ["Boy", "Boys"] },
    { value: "Girl", label: "Girl", keywords: ["Girl", "Girls"] },
  ];

  const ageGroupOptions = [
    {
      value: "Adult",
      label: "Adult",
      keywords: ["men", "women", "Adult", "male", "female"],
    },
    {
      value: "Kids",
      label: "Kids",
      keywords: ["Kids", "children", "boy", "girl", "child"],
    },
    { value: "baby", label: "Baby", keywords: ["Baby", "infant", "toddler"] },
  ];

  // Check if item matches gender filter based on title
  const matchesGender = (item: ClotheProps) => {
    if (selectedGenders.length === 0) return true;

    const Gender = item.specificData.gender;
    return selectedGenders.some((gender) => {
      const option = genderOptions.find((opt) => opt.value === gender);
      if (!option) return false;
      return option.keywords.some((keyword) => Gender.includes(keyword));
    });
  };

  // Check if item matches age group filter based on title
  const matchesAgeGroup = (item: ClotheProps) => {
    if (selectedAgeGroups.length === 0) return true;

    const age = item.specificData.ageGroup;
    return selectedAgeGroups.some((ageGroup) => {
      const option = ageGroupOptions.find((opt) => opt.value === ageGroup);
      if (!option) return false;
      return option.keywords.some((keyword) => age.includes(keyword));
    });
  };

  const matchesSearch = (item: ClotheProps) => {
    if (!searchFilter || searchFilter.trim() === "") return true;

    const title = item.title.toLowerCase();
    const search = searchFilter.toLowerCase().trim();

    return title.includes(search);
  };

  // Filter clothes based on gender, age group, and price
  const filteredClothes = useMemo(() => {
    return allClothes.filter((item: ClotheProps) => {
      // Gender filter
      if (!matchesGender(item)) return false;

      // Search Filter
      if (!matchesSearch(item)) return false;

      // Age group filter
      if (!matchesAgeGroup(item)) return false;

      // Price filter
      const minPrice = priceRange.min === "" ? 0 : Number(priceRange.min);
      const maxPriceVal =
        priceRange.max === "" ? Infinity : Number(priceRange.max);
      if (item.price < minPrice || item.price > maxPriceVal) return false;

      return true;
    });
  }, [
    allClothes,
    selectedGenders,
    selectedAgeGroups,
    priceRange,
    searchFilter,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClothes.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredClothes.slice(indexOfFirst, indexOfLast);

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenders([]);
    setSelectedAgeGroups([]);
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  // Check if any filter is active
  const hasActiveFilters =
    selectedGenders.length > 0 ||
    selectedAgeGroups.length > 0 ||
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

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
      <div className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold flex items-center gap-2">
              <FaTshirt /> Clothes
            </h2>
            <div className="h-1 w-20 bg-red-500 mt-2 rounded-full"></div>
          </div>

          {/* Filter Toggle Button and Search Input */}
          <div className="flex gap-4">
            {" "}
            <input
              placeholder="Search ..."
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              type="text"
              className="cursor-pointer flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              <FaFilter />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && (
                <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-2 py-0.5">
                  {selectedGenders.length +
                    selectedAgeGroups.length +
                    (priceRange.min !== "" || priceRange.max !== "" ? 1 : 0)}
                </span>
              )}
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
                {/* Gender Filter */}
                <div>
                  <label className="text-white block mb-3 font-medium">
                    Gender
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedGenders((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((g) => g !== option.value)
                              : [...prev, option.value],
                          );
                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                          selectedGenders.includes(option.value)
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Filters by title (Men, Women, Boy, Girl)
                  </p>
                </div>

                {/* Age Group Filter */}
                <div>
                  <label className="text-white block mb-3 font-medium">
                    Age Group
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ageGroupOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedAgeGroups((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((a) => a !== option.value)
                              : [...prev, option.value],
                          );
                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                          selectedAgeGroups.includes(option.value)
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Filters by title (Adult, Kids, Baby)
                  </p>
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
                    {filteredClothes.length}
                  </span>{" "}
                  items
                  {filteredClothes.length !== allClothes.length && (
                    <span className="text-gray-400">
                      {" "}
                      (filtered from {allClothes.length} total)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      {filteredClothes.length > 0 ? (
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
              {currentItems.map((item: ClotheProps) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ItemCard type="clothes" item={item} timeAgo={timeAgo} />
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

export default Clothes;
