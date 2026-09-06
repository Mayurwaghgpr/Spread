import coverImg2 from "/OctoCoverImage.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import spreadLogo from "/spread_logo_03_robopus.png";
import ProfileImage from "../../components/ProfileImage";
import ThemeBtn from "../../components/buttons/ThemeBtn";
import useIcons from "../../hooks/useIcons";
import ParticalAnimation from "../../components/utilityComp/ParticalAnimation";
import FeatureSection from "./components/FeatureSection";
import Heading from "./components/Heading";

function Heroes() {
  const navigate = useNavigate();
  const icons = useIcons();

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Profile",
      desc: "Sign up in seconds via Google, GitHub, or Email to personalize your author space.",
      icon: "person",
    },
    {
      step: "02",
      title: "Write & Publish Stories",
      desc: "Use our rich dynamic editor with markdown, code syntax highlighting, and media embeds.",
      icon: "share",
    },
    {
      step: "03",
      title: "Analyze & Build Community",
      desc: "Leverage AI post insights, engage with LinkedIn-style reactions, and grow your audience.",
      icon: "handshack",
    },
  ];

  const Modes = [
    { name: "Dark mode", value: "dark", icon: "moonFi" },
    { name: "Light mode", value: "light", icon: "sun" },
    { name: "System", value: "system", icon: "desktopO" },
  ];

  return (
    <main className="relative w-full min-h-screen bg-light dark:bg-dark text-stone-900 dark:text-stone-100 overflow-x-hidden border-inherit">
      {/* Background Particle Animation */}
      <ParticalAnimation />

      {/* Sticky Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 lg:px-20 py-3 flex justify-between items-center bg-light/80 dark:bg-dark/80 backdrop-blur-md border-b border-inherit">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer group transition-all duration-200 hover:opacity-80"
        >
          <ProfileImage
            image={spreadLogo}
            className="w-8 h-8 sm:w-9 sm:h-9 scale-105 transition-all duration-200"
            alt="Spread Logo"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Spread
          </span>
        </div>

        <div className="flex items-center text-sm gap-3 sm:gap-4">
          <ThemeBtn className="text-base sm:text-lg rounded-full p-2 bg-stone-200/60 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 shadow-sm hover:scale-105 transition-transform" Modes={Modes} />
          <Link
            to="/auth/signin"
            className="spread-btn-primary text-xs px-4 sm:px-5 py-1.5 sm:py-2 inline-flex items-center justify-center font-semibold rounded-full"
          >
            Sign In
          </Link>
        </div>
      </header>

      <div className="flex flex-col bg-inherit border-inherit pt-16">
        {/* Main Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-8 py-12 sm:py-20 border-inherit">
          <div className="relative z-20 max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Left Hero Text Column */}
            <div className="space-y-4 sm:space-y-6 text-left w-full">
              {/* Product Launch Badge */}
              <div className="inline-flex items-center gap-2 spread-pill px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold">
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700 dark:text-stone-300">{icons["glitter"]}</span>
                <span>Introducing Spread AI Assistant 2.5</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl xl:text-6xl font-extrabold tracking-tight leading-tight text-stone-900 dark:text-stone-100">
                Unleash Your <br />
                <span className="bg-gradient-to-r from-stone-800 via-stone-600 to-stone-900 dark:from-stone-100 dark:via-stone-300 dark:to-stone-400 bg-clip-text text-transparent">
                  Creative Genius.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base leading-relaxed text-stone-600 dark:text-stone-300 max-w-xl">
                Spread is the next-generation social publishing platform for creators and developers. Share technical stories, analyze posts with instant AI insights, and connect with a thriving community.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <button
                  className="spread-btn-primary flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-lg hover:scale-105 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full"
                  onClick={() => navigate("/auth/signin")}
                >
                  Start Creating Free
                  <span>→</span>
                </button>

                <button
                  className="spread-btn-secondary text-xs sm:text-sm font-semibold hover:scale-105 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full"
                  onClick={() => navigate("/search")}
                >
                  Explore Posts
                </button>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-inherit text-xs text-stone-500 dark:text-stone-400">
                <div className="spread-pill p-2 sm:p-0 sm:bg-transparent sm:border-0 text-center sm:text-left">
                  <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 block">100% Free</span>
                  <span>Gemini AI Engine</span>
                </div>
                <div className="spread-pill p-2 sm:p-0 sm:bg-transparent sm:border-0 text-center sm:text-left">
                  <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 block">Realtime</span>
                  <span>SSE Stream Processing</span>
                </div>
                <div className="spread-pill p-2 sm:p-0 sm:bg-transparent sm:border-0 text-center sm:text-left">
                  <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 block">Dev First</span>
                  <span>Markdown & Code Blocks</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Column */}
            <div className="relative flex justify-center items-center w-full">
              <div className="relative w-52 h-52 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-inherit shadow-2xl bg-[#f5f1ec] dark:bg-[#121212] flex items-center justify-center p-2">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={coverImg2}
                  alt="Spread Cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section Component */}
        <FeatureSection />

        {/* How It Works Section */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-transparent border-t border-inherit">
          <div className="max-w-6xl mx-auto border-inherit">
            <Heading
              title={"How It Works"}
              subtitle={"Get started in minutes and share your stories with thousands of readers"}
            />

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-12 sm:mt-16 border-inherit">
              {/* Steps List */}
              <div className="space-y-4 sm:space-y-6">
                {howItWorks.map((item, i) => (
                  <div
                    key={i}
                    className="spread-card flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-inherit hover:scale-[1.01] transition-transform"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mb-0.5 sm:mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mascot Video Preview */}
              <div className="flex justify-center border-inherit">
                <div className="spread-card p-2 rounded-3xl border border-inherit shadow-2xl w-full max-w-md">
                  <video
                    className="rounded-2xl w-full h-auto object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  >
                    <source src="/mascot_video_2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Heroes;
