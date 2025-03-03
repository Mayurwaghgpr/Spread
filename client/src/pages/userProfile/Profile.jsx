import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import PostPreview from "../../component/postsComp/PostPreview";
import { setuserProfile } from "../../redux/slices/profileSlice";
import ProfileHeader from "./component/ProfileHeader";
import { useInfiniteQuery, useMutation } from "react-query";
import Spinner from "../../component/loaders/Spinner";
import ProfileinfoCard from "../../component/ProfileinfoCard";
import { useLastItemObserver } from "../../hooks/useLastItemObserver";
import useProfileApi from "../../Apis/ProfileApis";
import ErrorPage from "../ErrorPages/ErrorPage";

function Profile() {
  const dispatch = useDispatch();
  const params = useParams();
  const { fetchUserProfile, fetchUserData } = useProfileApi();

  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile, FollowInfo } = useSelector((state) => state.profile);
  const profileId = params.id || user?.id;

  const {
    mutate,
    isError: isProfileError,
    error: profileError,
    isFetching,
    isLoading,
  } = useMutation(["userProfile"], async (id) => fetchUserProfile(id), {
    onSuccess: (data) => {
      dispatch(setuserProfile(data));
    },
  });
  useEffect(() => {
    if (profileId !== user.id) {
      mutate(profileId);
    }
    dispatch(setuserProfile(user));
  }, [profileId]);

  const {
    data: postsData,
    isError: isPostError,
    isFetchingNextPage,
    isLoading: postIsLoading,
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
          : undefined; // Use last post's timestamp as cursor
      },
      refetchOnWindowFocus: false,
    }
  );

  const { lastItemRef } = useLastItemObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  const posts = useMemo(
    () => postsData?.pages.flatMap((page) => page) || [],
    [postsData]
  );
  if (isProfileError || isPostError) {
    console.log(profileError);
    const errorMessage = profileError?.data.message || postError?.data.message;
    const statusCode = profileError?.status || postError?.status;
    return <ErrorPage message={errorMessage} statusCode={statusCode} />;
  }
  if (isLoading) {
    return (
      <div className="flex h-screen w-full  justify-center items-center dark:*:border-[#383838]">
        <h1>Loading profile...</h1>
      </div>
    );
  }

  return (
    <section className="flex h-screen w-full lg:justify-start justify-end dark:*:border-[#383838] overflow-y-auto">
      <div className="flex flex-col h-full md:w-[80%]  lg:w-[70%]  w-full  mt-20 ">
        <div id="Profile" className="flex-grow w-full sm:p-4 border-inherit">
          <ProfileHeader profileId={profileId} />
          <div className="w-full flex gap-5  p-2 px-4 border-inherit">
            <div className="w-full flex gap-5 underline-offset-[.5rem] transition-all duration-400 ">
              <p className="hover:underline pb-1 cursor-pointer">Home</p>
              <p className="hover:underline pb-1 cursor-pointer">About</p>
            </div>
          </div>
          <div
            className={` py-20 w-full flex  justify-center items-center flex-col border-inherit pt-5 dark:*:border-[#383838] `}
          >
            {/* <RenderPosts /> */}
            {userProfile?.posts?.length > 0
              ? posts.map((post, idx, arr) => (
                  <PostPreview
                    className="border-b w-full"
                    ref={arr.length % 3 === 0 ? lastItemRef : null}
                    key={post.id}
                    post={post}
                  />
                ))
              : profileId === user?.id &&
                !postIsLoading && (
                  <div className="max-w-[38rem] min-w-[13rem] w-full flex flex-col justify-center items-center sm:text-3xl border-dashed border-2 rounded-lg max-h-[38rem] h-full min-h-[13rem] border-inherit mx-5">
                    No posts yet{" "}
                    {isLogin && (
                      <Link
                        to="/write"
                        className=" sm:text-lg text-xs text-gray-500 font-thin "
                      >
                        Add New Post +
                      </Link>
                    )}
                  </div>
                )}
            {postIsLoading &&
              [...Array(3)].map((_, idx) => (
                <PostPreview key={idx} className="border-inherit px-2" />
              ))}
            {isFetchingNextPage && (
              <div className="w-full flex justify-center items-center h-24">
                <Spinner
                  className={"w-10 h-10 border-t-black dark:border-t-white"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {FollowInfo.Info && <ProfileinfoCard className={``} />}
    </section>
  );
}

export default Profile;
