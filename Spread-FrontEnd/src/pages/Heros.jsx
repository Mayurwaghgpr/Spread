import React from "react";
import { Link } from "react-router-dom";
import Footer from "../component/footer/Footer";
// import image from "../assets/homelight.png";
import bgvideo from "../assets/107240-678130070_small.mp4";
import SearchBar from "../component/homeComp/searchBar";

function Heros() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return (
    <>
      <main className=" h-[80vh] mt-[4.3rem]  dark:*:border-[#383838]">
        <section className="relative h-full px-10 flex m-auto sm:flex-row flex-col-reverse gap-8 justify-center items-center   text-start border-inherit">
          <div className=" sm:w-[50%] z-[5] animate-fedin1s text-white  rounded-lg h-fit  flex flex-col gap-2 border-inherit">
            <h1 className="xl:text-2xl lg:text-xl flex  items-center text-lg mb-4">
              <span>Spread.. </span>
              <i className="bi bi-feather pb-2"></i>
            </h1>
            <h2 className="xl:text-7xl font-[poppins] lg:text-4xl sm:text-3xl text-2xl font-[440]">
              Unleash Your ideas, Inspire the World
            </h2>
            <p className="text-lg">Read,Write,Code,Share and Explor</p>
            <div className="w-full flex justify-center py-4 border-inherit">
              <Link
                to="/write"
                className="py-2 hover:shadow-lg px-4 text-inherit text-sm rounded-full hover:bg-gray-500 hover:bg-opacity-20 border z-0 transition-all duration-300 border-inherit"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className=" absolute top-0 left-0 bottom-0 right-0 z-0 h-full ">
            <video
              className=" border-white  h-full w-full  object-cover object-center "
              id="background-video"
            >
              <source src={bgvideo} type="video/mp4" />
            </video>
          </div>
        </section>

        {/* <section
          className={
            "w-full sm:px-15 lg:px-20 min-h-[40rem] flex items-start *:border-inherit"
          }
        >
          <div
            id="homeArtical"
            className={`flex sm:justify-evenly items-center w-full flex-col h-full rounded-xl `}
          >
            <div
              className={`text-center flex justify-center items-center w-[80%] border-inherit`}
            >
              <div className="w-full text-center font-[440] h-full flex flex-col gap-2 items-end mt-10 mb-10 sm:items-center break-words text-2xl sm:text-5xl sm:px-8 z-30 border-inherit">
                <h1>Explore stories and new ideas</h1>

                <p className="text-xs"></p>
              </div>
            </div>
            <div className="flex flex-col gap-3 h-full justify-center items-center w-full px-3 z-0 rounded-e-xl border-inherit">
              <div className="shadow-lg flext justify-center items-center rounded-xl w-full max-w-[800px] border  overflow-hidden border-inherit">
                <img
                  className="sm:object-cover object-center w-full rounded-xl border-inherit"
                  src={""}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
        <section></section> */}
        <Footer />
      </main>
    </>
  );
}

export default Heros;
