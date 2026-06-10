import { Link } from "react-router";
import type { ClotheProps } from "~/types";

const ItemCard = ({
  item,
  timeAgo,
}: {
  item: ClotheProps;
  timeAgo: (date: string) => string;
}) => {
  return (
    <Link
      key={item.id}
      to={`/clothes/${item.id}`}
      className="group block transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="bg-[#180501] backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/10 transition-all duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden bg-gray-900">
          <img
            src={`/images/clothes-images/${item.images[0]}`}
            alt={item.title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-3 md:p-4 flex justify-between">
          <div className="w-60 h-20 line-clamp-2">
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

        <div className="flex justify-between items-center p-4 md:p-4 pt-0 md:pt-0">
          <h4 className="text-3xl inline font-semibold text-red-500 rounded-lg line-clamp-2 group-hover:text-red-300 transition-colors">
            ${item.price}
          </h4>
          <div>
            <span className="text-[11px] md:text-xs text-gray-300">
              {timeAgo(item.dateTime)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
