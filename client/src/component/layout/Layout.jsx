import React, { Suspense, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import MainNavBar from "../header/MainNavBar";
import SideBar from "./SideBar";
import TaskBar from "../phoneview/TaskBar";
import LoaderScreen from "../loaders/loaderScreen";
import { useQuery } from "react-query";
import usePublicApis from "../../services/publicApis";
import useDeviceSize from "../../hooks/useDeviceSize";
import Aside from "./Aside";
import {
  setLoadingHome,
  setTopiclist,
  setUserSuggestions,
} from "../../store/slices/commonSlice";
import { setIsLogin } from "../../store/slices/authSlice";

function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { pathname } = useLocation();
  const { isLogin } = useSelector((state) => state.auth);
  const { fetchHomeContent } = usePublicApis();
  const isDeviceSize = useDeviceSize("1023");
  const dispatch = useDispatch();

  // Fetch home content data
  useQuery("homeContent", fetchHomeContent, {
    onSuccess: (data) => {
      dispatch(setUserSuggestions(data.userSuggetion));
      dispatch(setTopiclist(data.topics));
    },
    onSettled: (data) => {
      dispatch(setLoadingHome(false));
    },
    onError: (error) => {
      console.error("Error fetching home content:", error);
    },
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  // Memoize path checks for better performance
  const pathChecks = useMemo(
    () => ({
      isMessagesPath: pathname.startsWith("/messages"),
      isWritePath: pathname.startsWith("/write"),
      isSearchPath: pathname.startsWith("/search"),
      isAnalysisPath: pathname.startsWith("/analysis"),
      isViewPath: pathname.startsWith("/view"),
      showSidebar:
        isLogin &&
        !pathname.startsWith("/write") &&
        !pathname.startsWith("/search") &&
        !pathname.startsWith("/analysis") &&
        !pathname.startsWith("/view"),
    }),
    [pathname, isLogin]
  );

  const showNavBar = !pathChecks.isMessagesPath;
  const showTaskBar = isLogin && !pathChecks.isMessagesPath;

  return (
    <main className="relative flex flex-col h-screen max-h-screen bg-inherit border-inherit overflow-hidden">
      {/* Navigation Bar */}
      {showNavBar && <MainNavBar />}

      {/* Main Content Area */}
      <div className="flex flex-1 w-full min-h-0 border-inherit h-full lg:px-20 ">
        {/* Sidebar */}
        {pathChecks.showSidebar && <SideBar />}

        {/* Main Content */}
        <section className="flex border-inherit w-full overflow-y-auto">
          <Suspense fallback={<LoaderScreen />}>
            <Outlet />
          </Suspense>
        </section>

        {/* TaskBar - Only on desktop, positioned as sidebar */}
        {showTaskBar && <TaskBar />}
      </div>
    </main>
  );
}

export default Layout;
