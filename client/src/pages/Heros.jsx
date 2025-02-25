import React from "react";
import { Link } from "react-router-dom";
import Footer from "../component/footer/Footer";
import homelight from "../assets/images/HomeLight.png";
import homedark from "../assets/images/HomeDark.png";
import coverImg2 from "../assets/images/coverImage2.jpg";

function Heros() {
  // Scroll to top when this component renders
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return (
    <>
      {/* Main Container */}
      <main className="relative h-[80vh] w-full mt-[3.6rem] dark:bg-inherit dark:*:border-[#383838]">
        {/* --- Primary Hero Section: Branding, Headline, CTA, and Main Image --- */}
        <section className="relative bg-inherit h-full  flex sm:flex-row flex-col-reverse gap-8 justify-center items-center">
          <div className="relative z-10   flex justify-start sm:pl-40 px-10 items-center w-full h-full bg-gradient-to-t from-[#fff9f3]  dark:from-black to-transparent">
            <div className="sm:w-1/2  z-[5] animate-fedin1s rounded-lg h-fit flex flex-col gap-4  overflow-hidden">
              <h1 className="xl:text-2xl lg:text-xl flex items-center text-lg mb-4">
                <span>Spread.. </span>
                <i className="bi bi-feather pb-2"></i>
              </h1>
              <h2 className="sm:text-6xl text-3xl  font-semibold">
                Unleash Your Ideas, Inspire the World
              </h2>
              <p className="dark:text-white text-xs sm:text-lg dark:text-opacity-60 text-wrap">
                Connect with fellow creators, share your work, and spark new
                ideas—join a vibrant community of innovators.
              </p>
              <div className="w-full flex justify py-4">
                <Link
                  to="/auth/signin"
                  className="py-4  text-center hover:shadow-lg px-10 text-sm rounded-full bg-gray-500 bg-opacity-20 hover:bg-gray-800 hover:bg-opacity-40 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-4 text-sm ">Trusted by creators worldwide</div>
            </div>
          </div>
          <div className="absolute top-0 bottom-0 right-0 left-0 w-full h-full">
            <img
              className=" w-full h-full  shadow-inner shadow-black  rounded-sm object-cover object-center"
              src={coverImg2}
              alt="Showcase of Spread platform"
              loading="lazy"
            />
          </div>
        </section>

        {/* --- Secondary/Supporting Section: Content Teaser and Visual Demo --- */}
        {/* <section className="w-full bg-inherit sm:px-15 lg:px-20 min-h-[40rem] flex items-start">
          <div
            id="homeArtical"
            className="flex sm:justify-evenly items-center w-full flex-col h-full rounded-xl"
          >
            <div className="text-center flex justify-center items-center w-[80%]">
              <div className="w-full text-center h-full flex flex-col gap-2 items-end mt-10 mb-10 sm:items-center break-words text-2xl sm:text-5xl sm:px-8">
                <h1>Explore stories and new ideas</h1>
                <p className="text-xs"></p>
              </div>
            </div>
            <div className="flex flex-col gap-3 h-full justify-center items-center w-full px-3 z-0 rounded-e-xl">
              <div className="shadow-lg flex justify-center items-center rounded-xl w-full max-w-[800px] overflow-hidden">
                <img
                  className="sm:object-cover dark:hidden flex object-center w-full rounded-xl"
                  src={homelight}
                  alt="Light theme view"
                       loading="lazy"
                />
                <img
                  className="sm:object-cover dark:flex hidden object-center w-full rounded-xl"
                  src={homedark}
                  alt="Dark theme view"
                       loading="lazy"
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* --- Additional/Optional Section: Reserved for Future Content --- */}
        <section></section>

        {/* --- Footer Section --- */}
        <Footer />
      </main>
    </>
  );
}

export default Heros;
