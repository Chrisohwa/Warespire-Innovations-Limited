"use client";
import React from "react";
import Link from "next/link";
import Picture from "@src/components/picture/Picture";
import { heroBg, machineImage } from "@public/images";

const MachineMaintenance = () => {
	return (
    <section className="w-full grid grid-cols-1  md:grid-cols-[40%_60%]  bg-white overflow-hidden">
      {/* 1. Image Section (Left) */}
      <div className="relative w-full h-[300px] md:h-[280px]">
        <Picture
          src="/images/compImage.jpg"
          alt="Computer components"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Content Section (Right) */}
      <div className="relative bg-black flex flex-col h-[100%] items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full max-w-3xl px-6 sm:px-8 lg:px-12 py-8 lg:py-0">
          {/* Main Heading */}
          <h2 className="font-light text-[20px] sm:text-4xl md:text-[52px] pb-5  text-[#DC8204] leading-tight tracking-tight  relative z-10 text-center">
            popular Gadget..
          </h2>

          <p className="text-[22px] sm:text-4xl md:text-[36px] font-black text-[#DC8204] leading-tight tracking-tight  relative z-10 text-center">
            Hundreds Gadgets More!
          </p>

          {/* Description */}
          <p className="text-[#fff] place-content-end font-thin text-base md:text-[12px] leading-relaxed max-w-lg relative z-10 text-center mt-4">
            Having quality means you have more joy, a new friend, We have 200+
            different gadget that can meet your needs!
          </p>

          {/* Button */}
          <Link
            href="/contact-us"
            className="w-fit bg-[#DC8204] text-[#fff] text-[14px] font-normal md:font-medium uppercase tracking-widest px-8 py-2 md:py-3 rounded-lg hover:opacity-80 transition-all active:scale-95 shadow-lg relative z-10 mt-6"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MachineMaintenance;
