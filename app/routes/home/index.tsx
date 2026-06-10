import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sell ya" },
    {
      name: "description",
      content: "Custom website you can sell or buy whatever you want",
    },
  ];
}

export default function Home() {
  return <>Hello</>;
}
