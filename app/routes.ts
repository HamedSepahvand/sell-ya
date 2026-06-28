import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layouts/HomeLayout.tsx", [
    index("./routes/home/index.tsx"),
    route("mobiles", "./routes//mobiles/index.tsx"),
    route("mobiles/:id", "./routes/mobiles/MobileDetails.tsx"),
    route("cars", "./routes/cars/index.tsx"),
    route("cars/:id", "./routes/cars/CarsDetails.tsx"),
    route("house", "./routes/house/index.tsx"),
    route("house/:id", "./routes/house/HouseDetails.tsx"),
    route("clothes", "./routes/clothes/index.tsx"),
    route("clothes/:id", "./routes/clothes/ClothesDetails.tsx"),
  ]),
] satisfies RouteConfig;
