import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layouts/HomeLayout.tsx", [
    index("./routes/home/index.tsx"),
    route("electronics", "./routes/electronics/index.tsx"),
    route("cars", "./routes/cars/index.tsx"),
    route("house", "./routes/house/index.tsx"),
    route("clothes", "./routes/clothes/index.tsx"),
    route("clothes/:id", "./routes/clothes/ClothesDetails.tsx"),
    route("cars/:id", "./routes/cars/CarsDetails.tsx"),
  ]),
] satisfies RouteConfig;
