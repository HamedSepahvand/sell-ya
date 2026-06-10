import { Outlet } from "react-router";

const HomeLayout = () => {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 my-10">
        <Outlet />
      </section>
    </>
  );
};

export default HomeLayout;
