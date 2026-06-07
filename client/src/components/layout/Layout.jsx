import { Suspense, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import MainNavBar from "../header/MainNavBar";
import SideBar from "./SideBar";
import TaskBar from "../phoneview/TaskBar";
import LoaderScreen from "../loaders/loaderScreen";
import { useQuery } from "@tanstack/react-query";
import usePublicApis from "../../services/publicApis";
// import useDeviceSize from "../../hooks/useDeviceSize";

import {
  setLoadingHome,
  setTagslist,
  setUserSuggestions,
} from "../../store/slices/commonSlice";

function Layout() {
  // const [searchParams, setSearchParams] = useSearchParams();

  const { pathname } = useLocation();
  const { isLogin } = useSelector((state) => state.auth);
  const { fetchHomeContent } = usePublicApis();
  // const isDeviceSize = useDeviceSize("1023");
  const dispatch = useDispatch();

  // Fetch home content data
  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ["homeContent"],
    queryFn: fetchHomeContent,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Handle query success/error with useEffect
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUserSuggestions(data.userSuggetion));
      dispatch(setTagslist(data.tags));
      dispatch(setLoadingHome(false));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching home content:", error);
      dispatch(setLoadingHome(false));
    }
  }, [isError, error, dispatch]);
  // Memoize path checks for better performance
  const pathChecks = useMemo(
    () => ({
      isMessagesPath: pathname.startsWith("/messages"),
      // isWritePath: pathname.startsWith("/write"),
      isSearchPath: pathname.startsWith("/search"),
      isAnalysisPath: pathname.startsWith("/analysis"),
      isViewPath: pathname.startsWith("/view"),
      showSidebar:
        isLogin &&
        !pathname.startsWith("/search") &&
        !pathname.startsWith("/analysis"),
      // !pathname.startsWith("/view"),
    }),
    [pathname, isLogin]
  );

  const showNavBar = !pathChecks.isMessagesPath;
  const showTaskBar = isLogin && !pathChecks.isMessagesPath;

  return (
    <main className="relative flex flex-col h-screen max-h-screen bg-inherit border-inherit overflow-hidden">
      {/* Main Content Area */}
      <div className="relative flex justify-start h-full border-inherit">
        {/* Sidebar */}
        {pathChecks.showSidebar && <SideBar />}

        {/* Main Content */}
        <div className=" w-full flex-grow border-inherit">
          {/* Navigation Bar */}
          {showNavBar && <MainNavBar />}
          <section className="  flex border-inherit w-full h-full overflow-y-auto">
            <Suspense fallback={<LoaderScreen />}>
              <Outlet />
            </Suspense>
          </section>
        </div>

        {/* TaskBar - Only on desktop, positioned as sidebar */}
        {showTaskBar && <TaskBar />}
      </div>
    </main>
  );
}

export default Layout;
