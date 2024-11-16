import React from "react";
import { Link } from "react-router-dom";
import Footer from "../component/footer/Footer";
import image from "../assets/homelight.png";
import bgvideo from "../assets/107240-678130070_small.mp4";
import SearchBar from "../component/homeComp/searchBar";

function Home() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return (
    <>
      <main className="relative dark:*:border-[#383838]">
        <div className="relative min-h-[45rem] flex  items-center px-10 sm:py-24  py-10 text-start h-full border-inherit">
          <div className=" absolute bg-black rounded-full min-w-fit min-h-fit  right-10  top-20">
            <video
              className=" sm:size-[35rem] size-[10rem] m-1 border-white border-2 animate-fedin1s  object-cover object-center rounded-full "
              id="background-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={bgvideo} type="video/mp4" />
            </video>
          </div>

          <div className=" p-7 sm:w-[50%] z-10  rounded-lg  flex flex-col gap-2 border-inherit">
            <h1 className="xl:text-2xl lg:text-xl flex  items-center text-lg mb-4">
              <span>Spread.. </span>
              <i className="bi bi-feather pb-2"></i>
            </h1>
            <h2 className="xl:text-5xl lg:text-4xl sm:text-3xl text-2xl font-[440]">
              Unleash Your Stories, Inspire the World
            </h2>
            <p className="sm:text-xl text-sm">
              Where you can read and write inspiring stories. Join our community
              of writers and share your stories with a wider audience.
            </p>
            <div className="w-full flex justify-center py-4 border-inherit">
              <Link
                to="/write"
                className="sm:py-2 px-4 text-inherit text-sm rounded-full border z-0 transition-all duration-300 border-inherit"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* <div
          className={
            "w-full sm:px-15 lg:px-20 min-h-[40rem] flex items-start *:border-inherit"
          }
        >
          <article
            id="homeArtical"
            className={`flex sm:justify-evenly items-center w-full flex-col h-full rounded-xl `}
          >
            <div
              className={`text-center flex justify-center items-center w-[80%] border-inherit`}
            >
              <div className="w-full text-center font-[440] h-full flex flex-col gap-2 items-end mt-10 mb-10 sm:items-center break-words text-2xl sm:text-5xl sm:px-8 z-30 border-inherit">
                <h1>Explore stories and new ideas</h1>

                <p className="text-xs">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Corrupti possimus labore facere repudianda e animi.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 h-full justify-center items-center w-full px-3 z-0 rounded-e-xl border-inherit">
              <div className="shadow-lg flext justify-center items-center rounded-xl w-full max-w-[800px] border  overflow-hidden border-inherit">
                <img
                  className="sm:object-cover object-center w-full rounded-xl border-inherit"
                  src={image}
                  alt=""
                />
              </div>
            </div>
          </article>
        </div> */}
      </main>
      <Footer />
    </>
  );
}

export default Home;
