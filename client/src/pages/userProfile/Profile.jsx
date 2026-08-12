import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PostPreview from "../../components/postsComp/PostPreview";
import PostCardSkeleton from "../../components/loaders/PostCardSkeleton";
import { setuserProfile } from "../../store/slices/profileSlice";
import ProfileHeader from "./components/ProfileHeader";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Spinner from "../../components/loaders/Spinner";
import ProfileinfoCard from "../../components/ProfileinfoCard";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import useProfileApi from "../../services/useProfileApis";
import ErrorPage from "../ErrorPages/ErrorPage";
import LoaderScreen from "../../components/loaders/loaderScreen";
import EmptyState from "../../components/utilityComp/EmptyState";
import { BsPostcard } from "react-icons/bs";

function Profile() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [activeDrawer, setActiveDrawer] = useState(null);
  const { fetchUserProfile, fetchUserData } = useProfileApi();

  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  // Safely resolve the effective profile ID or username
  const effectiveProfileId = useMemo(() => {
    if (params.profileId && params.profileId !== "undefined" && params.profileId !== "null") {
      return params.profileId.replace(/^@/, "");
    }
    if (params.username && params.username !== "undefined" && params.username !== "null") {
      return params.username.replace(/^@/, "");
    }
    return user?.id;
  }, [params.profileId, params.username, user?.id]);

  // Profile data query
  const {
    isError: isProfileError,
    error: profileError,
    isFetching: isProfileFetching,
    isLoading: isProfileLoading,
    data: profileData,
  } = useQuery({
    queryKey: ["userProfile", effectiveProfileId],
    queryFn: async () => {
      if (!effectiveProfileId || effectiveProfileId === "undefined") {
        throw new Error("Invalid Profile ID");
      }
      return fetchUserProfile(effectiveProfileId);
    },
    refetchOnWindowFocus: false,
    enabled: !!effectiveProfileId && effectiveProfileId !== "undefined",
  });

  useEffect(() => {
    if (profileData) {
      dispatch(setuserProfile(profileData));
    }
  }, [profileData, dispatch]);

  const activeProfileData = profileData || userProfile;

  const isSelf = useMemo(
    () => user?.id && activeProfileData?.id === user?.id,
    [user?.id, activeProfileData?.id]
  );

  // Posts data query
  const {
    data: postsData,
    isError: isPostError,
    isFetchingNextPage,
    isLoading: isPostsLoading,
    fetchNextPage,
    hasNextPage,
    error: postError,
  } = useInfiniteQuery({
    queryKey: ["UserPosts", activeProfileData?.id || effectiveProfileId],
    queryFn: ({ pageParam = new Date().toISOString() }) =>
      fetchUserData(activeProfileData?.id || effectiveProfileId, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage && Array.isArray(lastPage) && lastPage.length > 0
        ? lastPage[lastPage.length - 1]?.createdAt
        : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: !!(activeProfileData?.id || effectiveProfileId) && !isProfileError,
  });

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isProfileFetching,
    hasNextPage,
    0.1
  );

  const posts = useMemo(
    () => postsData?.pages?.flatMap((page) => (Array.isArray(page) ? page : [])) || [],
    [postsData]
  );

  if (isProfileError) {
    const errorMessage = profileError?.data?.message || profileError?.message || "Profile not found";
    const statusCode = profileError?.status || 404;
    return <ErrorPage message={errorMessage} statusCode={statusCode} />;
  }

  if (isProfileLoading && !activeProfileData) {
    return <LoaderScreen message="Loading profile..." />;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen border-inherit px-3 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <ProfileHeader
        userMeta={activeProfileData}
        isSelf={isSelf}
        onOpenDrawer={(type) => setActiveDrawer(type)}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center justify-start gap-4 w-full border-b border-stone-200 dark:border-stone-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "posts"
              ? "border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100"
              : "border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          Posts ({posts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "about"
              ? "border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100"
              : "border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          About
        </button>
      </div>

      {/* Posts Tab Section */}
      {activeTab === "posts" && (
        <div className="w-full space-y-4">
          {/* Post Loading Skeletons */}
          {isPostsLoading &&
            Array(3)
              .fill(null)
              .map((_, idx) => <PostCardSkeleton key={`post-skel-${idx}`} />)}

          {/* Posts List */}
          {!isPostsLoading &&
            posts.map((post, idx, arr) => (
              <PostPreview
                key={post.id}
                ref={idx === arr.length - 1 ? lastItemRef : null}
                post={post}
              />
            ))}

          {/* Empty Posts State */}
          {!isPostsLoading && posts.length === 0 && (
            <div className="py-12 flex justify-center items-center text-center">
              <EmptyState
                Icon={BsPostcard}
                heading="No stories published yet"
                description={
                  isSelf
                    ? "Start writing your first story to share with the Spread community."
                    : "This user hasn't published any stories yet."
                }
              />
            </div>
          )}

          {/* Pagination Loader */}
          {isFetchingNextPage && (
            <div className="w-full flex justify-center items-center py-6">
              <Spinner className="w-7 h-7 text-stone-900 dark:text-stone-100" />
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage &&
            !isFetchingNextPage &&
            !isPostsLoading &&
            posts.length > 0 && (
              <div className="text-center py-8 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-full spread-pill">
                  <BsPostcard className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                  <span>You've seen all posts</span>
                </div>
              </div>
            )}
        </div>
      )}

      {/* About Tab Section */}
      {activeTab === "about" && (
        <div className="w-full spread-card p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            About {activeProfileData?.displayName || activeProfileData?.username || "User"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {activeProfileData?.bio || "No bio added yet."}
          </p>
        </div>
      )}

      {/* Followers / Following Drawer Modal */}
      {activeDrawer && (
        <ProfileinfoCard
          action={() => setActiveDrawer(null)}
          kind={activeDrawer}
          listData={
            activeDrawer === "followers"
              ? activeProfileData?.Followers || []
              : activeProfileData?.Following || []
          }
        />
      )}
    </div>
  );
}

export default Profile;
