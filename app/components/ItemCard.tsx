import { Link } from "react-router";
import type { ClotheProps, CarProps } from "~/types";

const ItemCard = ({
  item,
  timeAgo,
  type,
}: {
  timeAgo: (date: string) => string;
}) => {
  const listingType =
    item.specificData.areaSqm && item.specificData.listingType === "forSale"
      ? "For Sale"
      : "For Rent";
  return (
    <Link
      key={item.id}
      to={`/${type}/${item.id}`}
      className="group block transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="bg-[#180501] backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/10 transition-all duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden bg-gray-900">
          <img
            src={`/images/${type}-images/${item.images[0]}`}
            alt={item.title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-3 md:p-4 flex justify-between">
          <div className="w-full md:h-20 sm:h-10 line-clamp-2">
            <h3 className="text-2xl inline font-semibold text-red-300 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
              {item.title}
            </h3>
          </div>
          {item.isUrgent ? (
            <h3 className="bg h-8 bg-blue-700 rounded-lg p-1 mb-2">Urgent</h3>
          ) : (
            ""
          )}
        </div>

        {item.specificData.areaSqm && (
          <h3 className="text-lg font-semibold text-yellow-700 mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors p-5">
            Houses - {listingType}
          </h3>
        )}

        {item.specificData.mileageKm && (
          <h3 className="text-lgs font-semibold text-yellow-700 mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors p-5">
            Cars
          </h3>
        )}

        {item.specificData.gender && (
          <h3 className="text-lg font-semibold text-yellow-700 mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors p-5">
            Clothes - {item.specificData.gender}
          </h3>
        )}

        {item.specificData.storageGB && (
          <h3 className="text-lg font-semibold text-yellow-700  line-clamp-2 group-hover:text-orange-500 transition-colors pl-5">
            Electronics - {item.specificData.brand}
          </h3>
        )}

        <div className="flex justify-between items-center p-4 md:p-4 pt-0 md:pt-0">
          <h4 className="text-2xl sm:text-3xl inline font-semibold text-red-500 rounded-lg line-clamp-2 group-hover:text-red-300 transition-colors">
            ${item.price.toLocaleString()}
          </h4>
          <div>
            <h2 className="text-[11px] sm:text-xs text-gray-300 w-full">
              {timeAgo(item.dateTime)}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
