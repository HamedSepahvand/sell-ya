import type { Route } from "./+types";
import type { CarProps } from "~/types";
import { readDB } from "~/api/local";
import { FaCar, FaFilter, FaTimes } from "react-icons/fa";
import Pagination from "~/components/Pagination";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "~/components/ItemCard";

export async function loader({ request }: Route.LoaderArgs): Promise<any> {
  const data = await readDB();
  return { items: data };
}

const Cars = ({ loaderData }: Route.ComponentProps) => {
  const { items } = loaderData;
  const allCars = items.categories.cars;

  // State for filters
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [mileageRange, setMileageRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const projectPerPage = 6;

  // Get min and max values for price and mileage
  const maxPrice = useMemo(
    () => Math.max(...allCars.map((car: CarProps) => car.price), 0),
    [allCars],
  );
  const maxMileage = useMemo(
    () =>
      Math.max(
        ...allCars.map((car: CarProps) => car.specificData.mileageKm || 0),
        0,
      ),
    [allCars],
  );

  const matchesSearch = (item: CarProps) => {
    if (!searchFilter || searchFilter.trim() === "") return true;

    const title = item.title.toLowerCase();
    const search = searchFilter.toLowerCase().trim();

    return title.includes(search);
  };

  // Filter cars based on price and mileage
  const filteredCars = useMemo(() => {
    return allCars.filter((car: CarProps) => {
      // Price filter
      const minPrice = priceRange.min === "" ? 0 : Number(priceRange.min);
      const maxPriceVal =
        priceRange.max === "" ? Infinity : Number(priceRange.max);
      if (car.price < minPrice || car.price > maxPriceVal) return false;

      // Search filter
      if (!matchesSearch(car)) return false;

      // Mileage filter
      const minMileage = mileageRange.min === "" ? 0 : Number(mileageRange.min);
      const maxMileageVal =
        mileageRange.max === "" ? Infinity : Number(mileageRange.max);
      const carMileage = car.specificData.mileageKm || 0;
      if (carMileage < minMileage || carMileage > maxMileageVal) return false;

      return true;
    });
  }, [allCars, priceRange, mileageRange, searchFilter]);

  const totalPages = Math.ceil(filteredCars.length / projectPerPage);
  const indexOfLast = currentPage * projectPerPage;
  const indexOfFirst = indexOfLast - projectPerPage;
  const currentProjects = filteredCars.slice(indexOfFirst, indexOfLast);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setMileageRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const timeAgo: any = (date: string) => {
    const now: any = new Date();
    const past: any = new Date(date);
    const diffInSeconds: number = Math.floor((now - past) / 1000);

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

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10">
      <div className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold flex items-center gap-2">
              <FaCar /> Cars
            </h2>
            <div className="h-1 w-20 bg-red-500 mt-2 rounded-full"></div>
          </div>

          {/* Filter Toggle Button */}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-semibold">
                  Filter Cars
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <FaTimes /> Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Filter */}
                <div>
                  <label className="text-white block mb-2 font-medium">
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
                          handleFilterChange();
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
                          handleFilterChange();
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400 text-sm">
                    Max price: ${maxPrice.toLocaleString()}
                  </div>
                </div>

                {/* Mileage Filter */}
                <div>
                  <label className="text-white block mb-2 font-medium">
                    Mileage (km)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder={`Min (0 - ${maxMileage.toLocaleString()})`}
                        value={mileageRange.min}
                        onChange={(e) => {
                          setMileageRange({
                            ...mileageRange,
                            min: e.target.value,
                          });
                          handleFilterChange();
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder={`Max (0 - ${maxMileage.toLocaleString()})`}
                        value={mileageRange.max}
                        onChange={(e) => {
                          setMileageRange({
                            ...mileageRange,
                            max: e.target.value,
                          });
                          handleFilterChange();
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400 text-sm">
                    Max mileage: {maxMileage.toLocaleString()} km
                  </div>
                </div>
              </div>

              {/* Filter Stats */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-300">
                  Found{" "}
                  <span className="text-red-500 font-bold">
                    {filteredCars.length}
                  </span>{" "}
                  cars
                  {filteredCars.length !== allCars.length && (
                    <span className="text-gray-400">
                      {" "}
                      (filtered from {allCars.length} total)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cars Grid */}
      {filteredCars.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-6"
            >
              {currentProjects.map((item: CarProps) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ItemCard type="cars" item={item} timeAgo={timeAgo} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaCar className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No cars found matching your filters
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-red-500 hover:text-red-400 underline"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Cars;
