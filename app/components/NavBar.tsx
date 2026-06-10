import { useState } from "react";
import { NavLink } from "react-router";
import { FaTimes, FaBars, FaShoppingBag } from "react-icons/fa";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const base =
    "transition hover:text-red-500 duration-200 text-white text-base py-1";
  const active = "text-red-500 font-semibold text-base text-lg py-1 ";

  return (
    <nav className="bg-pink-950 border-b border-red-700 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center ">
        <div className="flex items-center gap-4  justify-between">
          <NavLink
            to="/"
            className={
              "flex items-center gap-2 text-2xl font-bold text-red-100 hover:text-red-400 transition group"
            }
          >
            <FaShoppingBag className="text-red-100 text-xl h-7 w-7 duration-300 transition group-hover:scale-110 group-hover:rotate-12" />
            <span className="relative">
              Sell ya
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </NavLink>
          <p className="text-[12px] font-semibold text-red-200 animate-pulse">
            Easy Sell, Easy Buy and Enjoy
          </p>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="space-x-4 text-sm text-gray-300 ">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/electronics"
            >
              Electronics
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/cars"
            >
              Cars
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/house"
            >
              House
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/clothes"
            >
              Clothes
            </NavLink>
          </div>
        </div>
        <div className="md:hidden text-xl flex items-center text-gray-300 transition">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-red-400 text-xl cursor-pointer hover:text-red-500 "
            title="Change Theme"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}

      {menuOpen && (
        <>
          {" "}
          <div className="md:hidden bg-red-950 border-red-700 px-6 py-4 space-y-2 space-x-4 text-center text-white transition duration-200">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? active : base)}
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/electronics"
            >
              Electronics
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/cars"
            >
              Cars
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/house"
            >
              House
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/clothes"
            >
              Clothes
            </NavLink>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
