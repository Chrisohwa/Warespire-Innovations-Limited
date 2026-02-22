"use client";
import React, { useEffect, useRef, useState } from "react";

import Picture from "../picture/Picture";
import { useCategories, WooCommerce } from "../lib/woocommerce";
import ProductCard from "../Cards/ProductCard";
import HomeCard from "../Cards/HomeCard";
import Carousel from "../Reusables/Carousel";
import Link from "next/link";
import { convertToSlug, convertToSlug2 } from "@constants";
import { useEncryptionHelper } from "../EncryptedData";
import { useDispatch } from "react-redux";
import { updateCategorySlugId } from "../config/features/subCategoryId";
import { useRouter } from "next/navigation";
import { heroBg } from "@public/images";
import HeroCarousel from "../Cards/HeroCarousel";
import Image from "next/image";

const AllCategorySection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [maxScrollTotal, setMaxScrollTotal] = useState(0);
  const [scrollLeftTotal, setScrollLeftTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // State to hold products by category
  const [categoryProductsMap, setCategoryProductsMap] = useState<{
    [key: string]: ProductType[];
  }>({});
  // WooCommerce API Category
  const {
    data: categories,
    isLoading: categoryWpIsLoading,
    isError: categoryIsError,
  } = useCategories("");

  const Categories: CategoryType[] = categories;
  const TotalCatgory = Categories?.length - 1;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setIsLoading(true);

        const filteredCategories = categories
          ?.filter((category: CategoryType) => category?.count > 0)
          ?.slice(0, 5);

        if (filteredCategories) {
          const productsPromises = filteredCategories.map(
            async (category: CategoryType) => {
              const response = await WooCommerce.get(
                `products?category=${category?.id}`,
              );

              // Check if there is at least one product in the category
              const firstProductImage =
                response?.data.length > 0
                  ? response?.data[0]?.images[0]?.src
                  : null;

              return {
                categoryId: category?.id,
                firstProductImage: firstProductImage, // Store the first product's image
              };
            },
          );

          const productsResults = await Promise.all(productsPromises);

          // Update the state with the first product images mapped by category
          const productsMap = productsResults.reduce(
            (acc: any, result: any) => ({
              ...acc,
              [result.categoryId]: result.firstProductImage,
            }),
            {},
          );

          setCategoryProductsMap(productsMap);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categories?.length) {
      fetchCategoryProducts();
    }
  }, [categories]);

  const handleNext = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);

      sliderRef.current.scrollLeft += 600; // Adjust the scroll distance as needed
      setCurrentIndex((prevIndex) =>
        prevIndex < TotalCatgory - 1 ? prevIndex + 1 : prevIndex,
      );
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);
      // console.log(scrollLeft);
      if (scrollLeft > 0) {
        sliderRef.current.scrollLeft -= 600; // Adjust the scroll distance as needed
        setCurrentIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      }
    }
  };

  return (
    <>
      {/* Hero Concept inspired by the image */}
      <div className="relative min-h-screen bg-[#060809] overflow-hidden flex items-center">
        <div className="max-w-[1440px] w-full mx-auto  flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left p-2 md:p-1 ">
            <h1 className="text-[24px] sm:text-4xl lg:text-5xl xl:text-6xl max-w-[680px] font-bold text-white leading-tight xl:leading-[60px]">
              Your Top Technology Service Provider
            </h1>

            <p className="text-gray-300 text-[16px] sm:text-lg leading-relaxed max-w-[601px] ">
              Your trusted technology service provider delivering innovative
              solutions, reliable support, and seamless digital experiences to
              power your business growth and success.
            </p>

            <div>
              <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-sm transition-transform hover:scale-105">
                Shop Now
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[700px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Picture
                src={heroBg}
                alt="Technology Service Setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="w-full bg-[#f1f3f5] py-12">
        <div className="max-w-[1450px] mx-auto  grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Speed */}
          <div className="flex items-center gap-6 space-y-4 max-w-[393px] ">
            <div className="w-[72px] h-[72px] flex items-center justify-center  bg-white shadow-sm">
              <Image
                width={72}
                height={72}
                src="/images/speedImage.png"
                alt="speed-image"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold text-gray-900">Speed</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Experience unmatched speed with high-performance computer
                accessories.
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="flex items-center gap-6 space-y-4 max-w-[393px]  ">
            <div className="w-[72px] h-[72px] flex items-center justify-center  bg-white shadow-sm">
              <Image
                width={72}
                height={72}
                src="/images/securityImage.png"
                alt="security-image"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                safe device built to safeguard data, ensure privacy, and deliver
                reliable protection for everyday use.
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="flex items-center space-y-4 max-w-[393px] gap-6 ">
            <div className="w-[72px] h-[72px] flex items-center justify-center  bg-white shadow-sm">
              <Image
                width={72}
                height={72}
                src="/images/supportImage.png"
                alt="security-image"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold text-gray-900">Support</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Expert assistance, quick solutions, and dedicated service to
                keep your devices running smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Category Section Styling Idea */}
      <h5 className="max-w-[1440px] mx-auto mt-[50px] text-#181818 font-bold text-[30px] lg:text-[48px]">
        Browse categories
      </h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mx-auto max-w-[1440px] px-2 lg:px-0  mt-6 gap-10">
        {Categories?.slice(0, 5).map((cat) => {
          const productImage = categoryProductsMap[cat?.id];
          return (
            <Link
              key={cat.id}
              href={`/category/${convertToSlug(cat.name)}-${cat.id}`}
              className="group relative h-40 sm:h-48 bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all"
            >
              <Picture
                src={cat.image?.src ?? productImage}
                alt={cat.image?.name}
                className="w-full h-full object-contain opacity-60 group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute bottom-4 left-4">
                <h3 className="text-sm sm:text-lg font-bold text-white uppercase">
                  {cat.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* </Carousel> */}
    </>
  );
};

export default AllCategorySection;
