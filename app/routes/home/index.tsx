import type { Route } from "./+types";
import type { MobileProps } from "~/types";
import { readDB } from "~/api/local";
import ItemCard from "~/components/ItemCard";
import Pagination from "~/components/Pagination";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FaSearch } from "react-icons/fa";

export async function loader({ request }: Route.LoaderArgs): Promise<any> {
  const data = await readDB();

  return {
    items: data,
  };
}

const HomePage = ({ loaderData }: Route.ComponentProps) => {
  const { items } = loaderData;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");

  const itemsPerPage = 100;

  // فقط آگهی‌های ویژه
  const featuredItems = items.featured;

  /* جمع کردن تمام آگهی‌ها */

  const allItems = useMemo(() => {
    return [
      ...(items?.categories?.cars || []),
      ...(items?.categories?.mobile || []),
      ...(items?.categories?.clothes || []),
      ...(items?.categories?.house?.forSale || []),
      ...(items?.categories?.house?.forRent || []),
    ];
  }, [items]);

  /* سرچ */

  const filteredItems = useMemo(() => {
    if (!searchFilter.trim()) {
      return featuredItems;
    }

    const search = searchFilter.toLowerCase().trim();

    // اگر کاربر سرچ کرد بین تمام آیتم‌ها جستجو کن
    return allItems.filter((item: any) => {
      const searchableText = `
      ${item.title || ""}
      ${item.description || ""}
      ${item.category || ""}
      ${item.city || ""}
      ${item.neighborhood || ""}
      ${JSON.stringify(item.specificData || {})}
    `.toLowerCase();

      return searchableText.includes(search);
    });
  }, [allItems, featuredItems, searchFilter]);

  /* Pagination */

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);

    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#090909]">
      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/30 via-transparent to-orange-500/20" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-white text-5xl md:text-7xl font-black max-w-3xl leading-tight">
              Buy & Sell
              <span className="text-red-500 block">Anything Near You</span>
            </h1>

            <p className="text-gray-400 text-lg mt-6 max-w-2xl">
              Discover amazing deals on cars, mobiles, houses, clothes and much
              more.
            </p>

            {/* SEARCH */}

            <div className="mt-10 max-w-3xl">
              <div className="flex items-center bg-[#161616] rounded-2xl border border-white/10 p-2">
                <FaSearch className="text-gray-500 ml-4 text-xl" />

                <input
                  type="text"
                  placeholder="Search cars, phones, houses..."
                  value={searchFilter}
                  onChange={(e) => {
                    setSearchFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent p-4 text-white outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}

      <section className="container mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentItems.map((item: MobileProps) => (
              <motion.div key={item.id} layout>
                <ItemCard item={item} type={item.category} timeAgo={timeAgo} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl text-gray-500">No items found</h2>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
