import React from "react";
import { Link } from "react-router-dom";
import Footer from "../component/footer/Footer";
import homelight from "../assets/images/HomeLight.png";
import homedark from "../assets/images/HomeDark.png";
import coverImg2 from "../assets/images/coverImage2.jpg";

function Heros() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return (
    <>
      <main className="relative h-[80vh] mt-[4rem]  dark:bg-inherit dark:*:border-[#383838]">
        <section className=" bg-inherit h-full px-10 flex m-auto sm:flex-row flex-col-reverse gap-8 justify-center items-center   text-start border-inherit">
          <div className=" sm:w-[50%] z-[5] animate-fedin1s rounded-lg h-fit flex flex-col gap-4 border-inherit">
            <h1 className="xl:text-2xl lg:text-xl flex items-center text-lg mb-4">
              <span>Spread.. </span>
              <i className="bi bi-feather pb-2"></i>
            </h1>
            <h2 className="xl:text-7xl  lg:text-4xl sm:text-3xl text-2xl">
              Unleash Your ideas, Inspire the World
            </h2>
            <p className=" text-gray-500">Read Write Code Share & Explore</p>
            <div className="w-full flex justify-center py-4 border-inherit">
              <Link
                to="/auth/signin"
                className="py-4 w-52 text-center hover:shadow-lg px-5 text-inherit text-sm rounded-full hover:bg-gray-500 hover:bg-opacity-20 border z-0 transition-all duration-300 border-inherit"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="">
            <img
              className="sm:w-[35rem] shadow-inner shadow-black sm:h-[25rem] rounded-sm  object-fill object-center "
              src={coverImg2}
              loading="lazy"
            />
          </div>
        </section>

        <section
          className={
            "w-full bg-inherit sm:px-15 lg:px-20 min-h-[40rem] flex items-start *:border-inherit"
          }
        >
          <div
            id="homeArtical"
            className={`flex sm:justify-evenly items-center w-full flex-col h-full rounded-xl `}
          >
            <div
              className={`text-center flex justify-center items-center w-[80%] border-inherit`}
            >
              <div className="w-full text-center  h-full flex flex-col gap-2 items-end mt-10 mb-10 sm:items-center break-words text-2xl sm:text-5xl sm:px-8  border-inherit">
                <h1>Explore stories and new ideas</h1>

                <p className="text-xs"></p>
              </div>
            </div>
            <div className="flex flex-col gap-3 h-full justify-center items-center w-full px-3 z-0 rounded-e-xl border-inherit">
              <div className="shadow-lg flext justify-center items-center rounded-xl w-full max-w-[800px] border  overflow-hidden border-inherit">
                <img
                  className="sm:object-cover dark:hidden flex object-center w-full rounded-xl border-inherit"
                  src={homelight}
                  alt=""
                />
                <img
                  className="sm:object-cover dark:flex hidden object-center w-full rounded-xl border-inherit"
                  src={homedark}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
        <section></section>
        <Footer />
      </main>
    </>
  );
}

export default Heros;
