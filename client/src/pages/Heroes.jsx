import React from "react";
import { Link } from "react-router-dom";
import Footer from "../component/footer/Footer";
import ImageFigure from "../component/utilityComp/ImageFigure";
import coverImg from "./../assets/images/coverImage2.jpg";
import spreadLogo from "/spread_logo_03_robopus.png";
function Heroes() {
  // Scroll to top when this component renders
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return (
    <main className="relative w-full dark:bg-inherit dark:*:border-[#383838]">
      {/* --- Primary Hero Section: Branding, Headline, CTA, and Main Image --- */}
      <section className="relative bg-inherit  h-screen  flex sm:flex-row flex-col-reverse gap-8 justify-center items-center">
        <div className="relative z-10 flex justify-start  items-center w-full h-full bg-gradient-to-t from-[#fff9f3]  dark:from-black to-transparent">
          <div className="animate-fedin1s rounded-lg  flex flex-col gap-20  sm:mx-40 mx-10 h-full w-full  overflow-hidden">
            <div className=" text-2xl font-bold flex items-center justify-start gap-4 pt-10">
              <ImageFigure
                imageClassName="w-full h-full object-cover rounded-full"
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                imageUrl={spreadLogo}
              />
              <span>Spread</span>
            </div>
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span>Code.</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Collaborate.
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Create.
                </span>
              </h1>

              <p className={`text-xl leading-relaxed max-w-2xl `}>
                The ultimate platform where developers{" "}
                <span className="text-cyan-500 font-semibold">share ideas</span>
                ,
                <span className="text-purple-500 font-semibold">
                  {" "}
                  collaborate on projects
                </span>
                , and
                <span className="text-green-500 font-semibold">
                  {" "}
                  build the future together
                </span>
                .
              </p>

              <Link
                to="/auth/signin"
                className="w-fit group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                Get Started
              </Link>
              <div className="mt-4 text-sm ">Trusted by creators worldwide</div>
            </div>
          </div>
        </div>
        {/* <div className="absolute top-0 bottom-0 right-0 left-0 w-full h-full">
            <img
              className=" w-full h-full  shadow-inner shadow-black  rounded-sm object-cover object-center"
              src={coverImg}
              alt="Showcase of Spread platform"
              loading="lazy"
            />
          </div> */}
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
      {/* <section></section> */}

      {/* --- Footer Section --- */}
      <Footer />
    </main>
  );
}

export default Heroes;
