import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full bg-[#8A1912] py-2 md:py-4">
      <div className="max-w-screen-2xl mx-auto md:px-40 flex items-center md:justify-center">
        <Link href={"/"}>
          <img
            className="md:h-[100px] h-[60px] cursor-pointer"
            src="/logo.png"
            alt="logo image"
          />
        </Link>
        <div>
          <h1 className="md:text-[40px] text-[18px] font-light text-[#FFFAF0]">
            RADHA SOAMI SATSAND BAES
          </h1>
          <hr />
          <h4 className="md:text-[24px] text-[16px] font-light text-[#FFFAF0] text-center">
            Chatrapati Shambhajinagar Area
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
