import coverImg2 from "/OctoCoverImage.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../component/footer/Footer";
import spreadLogo from "/spread_logo_03_robopus.png";
import ProfileImage from "../../component/ProfileImage";
import ThemeBtn from "../../component/buttons/ThemeBtn";
import useIcons from "../../hooks/useIcons";
import ParticalAnimation from "../../component/utilityComp/ParticalAnimation";
import FeatureSection from "./components/featureSection";
import Heading from "./components/Heading";
function Heroes() {
  const navigate = useNavigate();
  const icons = useIcons();
  const howItWorks = [
    {
      step: "01",
      title: "Create Account",
      desc: "Sign up in seconds and customize your creative profile",
      icon: "person",
    },
    {
      step: "02",
      title: "Share Content",
      desc: "Upload your work, stories, and creative projects",
      icon: "share",
    },
    {
      step: "03",
      title: "Build Community",
      desc: "Connect with like-minded creators and grow together",
      icon: "handshack",
    },
  ];
  const Modes = [
    {
      name: "Dark mode",
      value: "dark",
      icon: "moonFi",
    },
    {
      name: "Light mode",
      value: "light",
      icon: "sun",
    },
    {
      name: "System",
      value: "system",
      icon: "desktopO",
    },
  ];
  return (
    <main className="relative w-full min-h-screen bg-light dark:bg-black overflow-y-auto">
      {/* Animated background particles */}
      <ParticalAnimation />
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 lg:px-20 py-3  flex justify-between items-center">
        <div>
          {" "}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group transition-all duration-200 hover:opacity-80"
          >
            <ProfileImage
              image={spreadLogo}
              className="w-10 h-10 scale-110 transition-all duration-200"
              alt="Spread Logo"
            />
            <span className="sm:block hidden text-xl font-bold bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-700 dark:to-gray-400 bg-clip-text text-transparent">
              Spread
            </span>
          </div>
        </div>{" "}
        <div className=" flex justify-center items-center text-sm  gap-5">
          <ThemeBtn
            className=" text-lg  rounded-full p-2 bg-white/30 backdrop-blur-md   "
            Modes={Modes}
          />
          <Link
            to="/auth/signin"
            className="flex  items-center gap-2 sm:px-8 px-3 sm:py-2 py-1 text-xs bg-white text-black rounded-full  transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </header>
      <div className="flex flex-col bg-inherit">
        {/* Main Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden ">
          <div className="absolute inset-0 z-5 bg-gradient-to-tr from-transparent via-transparent  dark:to-blue-400/30 "></div>
          {/* Content */}
          <div className="relative z-20 flex sm:flex-row flex-col  sm:items-center items-start text-start gap-10 px-8 sm:px-12  ">
            <div className="transform transition-all duration-700 max-w-3xl">
              {/* Headline */}
              <h1 className="text-xl sm:text-2xl xl:text-4xl font-bold leading-tight mb-8 ">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text dark:text-transparent">
                  Unleash Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-100 to-white bg-clip-text dark:text-transparent">
                  Creative Genius
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-lg leading-relaxed mb-8 max-w-2xl dark:text-gray-100">
                Join a <span className="font-semibold ">vibrant community</span>{" "}
                of creators, innovators, and dreamers. Share your vision,
                discover inspiration, and
                <span className="font-semibold ">
                  {" "}
                  transform ideas into reality
                </span>
                .
              </p>
              {/* sign in button */}
              <div className="flex flex-col sm:flex-row gap-4 sm:mb-12  sm:w-full w-fit ">
                <button
                  className="group relative  px-3 py-2  bg-gradient-to-r text-white from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-full font-bold  dark:text-black  sm:text-sm text-xs overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/25 dark:hover:shadow-white/25 border border-gray-600 dark:border-gray-300"
                  onClick={() => navigate("/auth/signin")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-100 dark:to-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Start Creating
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
            <div className="relative max-w-[20rem] max-h-[20rem] sm:w-full sm:h-full w-1/2 rounded-full overflow-hidden ">
              <img
                class="max-w-full h-auto object-cover object-center"
                src={coverImg2}
                alt="cover"
                loading="lazy"
              />
            </div>
          </div>
          {/* Scroll Indicator */}
          <div className="absolute sm:right-1/3 left-1/2 transform -translate-x-1/2 sm:bottom-0 bottom-0 animate-bounce">
            <div className="sm:w-6 sm:h-10 w-4 h-7 border-2 border-gray-300 dark:border-gray-200 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
              <div className="sm:w-1 sm:h-3 w-0.5 h-2 bg-gray-600 dark:bg-gray-200 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>
        <FeatureSection />

        {/* How It Works Section */}
        <section className="relative py-20 bg-oplight dark:bg-transparent text-white ">
          <div className=" absolute inset-0 z-5 dark:bg-gradient-to-tl  dark:from-transparent dark:via-transparent dark:to-gray-800 "></div>

          <div className="max-w-6xl mx-auto px-6">
            <Heading
              title={"How It Works"}
              subtitle={
                "Get started in minutes and join thousands of creators sharing their passion"
              }
            />

            <div className="grid md:grid-row-3 gap-8 relative m-20">
              <div className="hidden md:block absolute top-10 left-5 right-1/4 w-0.5 h-full bg-gradient-to-b from-gray-300 via-gray-400 to-transparent dark:from-gray-600 dark:via-gray-500 dark:to-transparent"></div>
              {howItWorks.map((item, i) => (
                <div
                  key={i}
                  className=" flex items-start justify-start gap-4 relative"
                >
                  <div className="relative">
                    <div className="p-2  bg-gradient-to-br text-black  from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-xl">{icons[item.icon]}</span>
                    </div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 p-1 bg-gray-200 dark:bg-white rounded-full flex items-center justify-center">
                      <span className="text-[9px] font-bold text-black">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="sm:text-lg text-sm font-bold  mb-3">
                      {item.title}
                    </h3>
                    <p className=" sm:text-sm text-xs ">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

export default Heroes;
