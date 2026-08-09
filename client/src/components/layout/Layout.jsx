import { Suspense, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import MainNavBar from "../header/MainNavBar";
import SideBar from "./SideBar";
import TaskBar from "../phoneview/TaskBar";
import LoaderScreen from "../loaders/loaderScreen";
import { useQuery } from "@tanstack/react-query";
import usePublicApis from "../../services/publicApis";

import {
  setLoadingHome,
  setTagslist,
  setUserSuggestions,
} from "../../store/slices/commonSlice";

function Layout() {
  const { pathname } = useLocation();
  const { isLogin } = useSelector((state) => state.auth);
  const { fetchHomeContent } = usePublicApis();
  const dispatch = useDispatch();

  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ["homeContent"],
    queryFn: fetchHomeContent,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

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

  const pathChecks = useMemo(
    () => ({
      isMessagesPath: pathname.startsWith("/messages"),
      isSearchPath: pathname.startsWith("/search"),
      isAnalysisPath: pathname.startsWith("/analysis"),
      isViewPath: pathname.startsWith("/view"),
      showSidebar:
        isLogin &&
        !pathname.startsWith("/search") &&
        !pathname.startsWith("/analysis"),
    }),
    [pathname, isLogin]
  );

  const showNavBar = !pathChecks.isMessagesPath;
  const showTaskBar = isLogin && !pathChecks.isMessagesPath;

  return (
    <main className="relative flex flex-col h-screen max-h-screen bg-light dark:bg-dark text-stone-900 dark:text-stone-100 overflow-hidden border-inherit">
      {/* Main Content Area */}
      <div className="relative flex flex-1 min-h-0 w-full border-inherit overflow-hidden">
        {/* Sidebar */}
        {pathChecks.showSidebar && <SideBar />}

        {/* Main Content Column */}
        <div className="flex flex-col flex-1 min-h-0 min-w-0 w-full border-inherit overflow-hidden">
          {/* Navigation Bar */}
          {showNavBar && <MainNavBar />}
          
          {/* Page Section */}
          <section className="flex flex-1 min-h-0 min-w-0 w-full border-inherit overflow-y-auto pb-16 sm:pb-0">
            <Suspense fallback={<LoaderScreen />}>
              <Outlet />
            </Suspense>
          </section>
        </div>

        {/* Mobile TaskBar */}
        {showTaskBar && <TaskBar />}
      </div>
    </main>
  );
}

export default Layout;
