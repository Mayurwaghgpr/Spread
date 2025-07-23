import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import PostPreview from "../../component/postsComp/PostPreview";
import { setuserProfile } from "../../store/slices/profileSlice";
import ProfileHeader from "./component/ProfileHeader";
import { useInfiniteQuery, useQuery } from "react-query";
import Spinner from "../../component/loaders/Spinner";
import ProfileinfoCard from "../../component/ProfileinfoCard";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import useProfileApi from "../../services/ProfileApis";
import ErrorPage from "../ErrorPages/ErrorPage";
import LoaderScreen from "../../component/loaders/loaderScreen";
import { BsPostcard } from "react-icons/bs";

function Profile() {
  const dispatch = useDispatch();
  const params = useParams();
  const { fetchUserProfile, fetchUserData } = useProfileApi();

  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile, FollowInfo } = useSelector((state) => state.profile);
  const profileId = params.id || user?.id;
  const isOwnProfile = profileId === user?.id;

  // Profile data query
  const {
    isError: isProfileError,
    error: profileError,
    isFetching: isProfileFetching,
    isLoading: isProfileLoading,
  } = useQuery(
    ["userProfile", profileId],
    async () => fetchUserProfile(profileId),
    {
      onSuccess: (data) => {
        dispatch(setuserProfile(data));
      },
      refetchOnWindowFocus: false,
      enabled: !!profileId, // Only fetch if profileId exists
    }
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
  } = useInfiniteQuery(
    ["Userposts", profileId],
    ({ pageParam = new Date().toISOString() }) =>
      fetchUserData(profileId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.length !== 0
          ? lastPage[lastPage.length - 1].createdAt
          : undefined;
      },
      refetchOnWindowFocus: false,
      enabled: !!profileId && !isProfileError, // Only fetch posts if profile exists
    }
  );

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isProfileFetching,
    hasNextPage
  );

  // Memoize posts array
  const posts = useMemo(
    () => postsData?.pages.flatMap((page) => page) || [],
    [postsData]
  );

  // Memoize rendered posts for performance
  const renderedPosts = useMemo(() => {
    return posts.map((post, idx, arr) => (
      <PostPreview
        className="border-b w-full"
        ref={arr.length % 3 === 0 ? lastItemRef : null}
        key={post.id}
        post={post}
      />
    ));
  }, [posts, lastItemRef]);

  // Handle navigation tab clicks
  const handleTabClick = useCallback((tab) => {
    // Implement tab functionality here
    console.log(`Clicked on ${tab} tab`);
  }, []);

  // Error handling - separate profile and post errors
  if (isProfileError) {
    const errorMessage = profileError?.data?.message || "Profile not found";
    const statusCode = profileError?.status || 404;
    return <ErrorPage message={errorMessage} statusCode={statusCode} />;
  }

  if (isPostError && postError?.status !== 404) {
    const errorMessage = postError?.data?.message || "Failed to load posts";
    const statusCode = postError?.status || 500;
    return <ErrorPage message={errorMessage} statusCode={statusCode} />;
  }

  // Show loading screen for initial profile load
  if (isProfileLoading) {
    return <LoaderScreen message={"Loading profile..."} />;
  }

  // Empty state component
  const EmptyPostsState = () => {
    if (isOwnProfile) {
      return (
        <div className="max-w-[38rem] min-w-[13rem] w-full flex flex-col justify-center items-center sm:text-3xl border-dashed border-2 rounded-lg max-h-[38rem] h-full min-h-[13rem] border-inherit mx-5">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No posts yet</p>
          {isLogin && (
            <Link
              to="/write"
              className="sm:text-lg text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              Add New Post +
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="max-w-[38rem] min-w-[13rem] w-full flex flex-col justify-center items-center sm:text-3xl border-dashed border-2 rounded-lg max-h-[38rem] h-full min-h-[13rem] border-inherit mx-5">
        <BsPostcard className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No posts to show</p>
      </div>
    );
  };

  return (
    <section className="flex h-screen w-full justify-start border-inherit overflow-y-auto">
      <div className="flex flex-col h-full md:w-[80%] lg:w-[70%] w-full mt-20 border-inherit">
        <div id="Profile" className="flex-grow w-full sm:p-4 border-inherit">
          <ProfileHeader profileId={profileId} />

          {/* Navigation Tabs */}
          <div className="w-full flex gap-5 p-2 px-4 border-inherit">
            <div className="w-full flex gap-5 underline-offset-[.5rem] transition-all duration-400">
              <button
                onClick={() => handleTabClick("home")}
                className="hover:underline pb-1 cursor-pointer focus:outline-none focus:underline"
                role="tab"
                aria-selected="true"
              >
                Home
              </button>
              <button
                onClick={() => handleTabClick("about")}
                className="hover:underline pb-1 cursor-pointer focus:outline-none focus:underline"
                role="tab"
                aria-selected="false"
              >
                About
              </button>
            </div>
          </div>

          {/* Posts Content */}
          <div className="py-20 w-full flex justify-center items-center flex-col border-inherit pt-5">
            {/*posts if they exist */}
            {posts.length > 0 && renderedPosts}

            {/* empty state if no posts and not loading */}
            {posts.length === 0 && !isPostsLoading && <EmptyPostsState />}

            {/* loading skeletons for initial posts load */}
            {isPostsLoading &&
              [...Array(3)].map((_, idx) => (
                <PostPreview
                  key={`skeleton-${idx}`}
                  className="border-inherit px-2"
                />
              ))}

            {/* loading spinner for infinite scroll */}
            {isFetchingNextPage && (
              <div className="w-full flex justify-center items-center h-24">
                <Spinner className="w-10 h-10 border-t-black dark:border-t-white" />
              </div>
            )}

            {/* End of list indicator */}
            {!hasNextPage &&
              !isFetchingNextPage &&
              !isPostsLoading &&
              posts.length > 0 && (
                <div className="text-center py-8 w-full">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full">
                    <BsPostcard className="w-4 h-4" />
                    <span>You've seen all posts</span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {FollowInfo.Info && <ProfileinfoCard className="" />}
    </section>
  );
}

export default Profile;
