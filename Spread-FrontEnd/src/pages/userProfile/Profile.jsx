import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import PostPreview from "../../component/postsComp/PostPreview";
import { setuserProfile } from "../../redux/slices/profileSlice";
import ProfileHeader from "./component/ProfileHeader";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import Spinner from "../../component/loaders/Spinner";
import ProfileinfoCard from "../../component/ProfileinfoCard";
import { useLastPostObserver } from "../../hooks/useLastPostObserver";
import useProfileApi from "../../Apis/ProfileApis";
import SomthingWentWrong from "../ErrorPages/somthingWentWrong";

function Profile() {
  const dispatch = useDispatch();
  const params = useParams();
  const { fetchUserProfile, fetchUserData } = useProfileApi();

  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile, FollowInfo } = useSelector((state) => state.profile);
  const profileId = params.id || user?.id;

  const { mutate, isError, error, isFetching, isLoading } = useMutation(
    ["userProfile"],
    async (id) => fetchUserProfile(id),
    {
      onSuccess: (data) => {
        dispatch(setuserProfile(data));
      },
    }
  );
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
    ({ pageParam = 1 }) => fetchUserData(profileId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
      refetchOnWindowFocus: false,
    }
  );

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );
  const posts = useMemo(
    () => postsData?.pages.flatMap((page) => page.posts) || [],
    [postsData]
  );
  if (isLoading) {
    return (
      <div className="flex h-screen w-full  justify-center items-center dark:*:border-[#383838]">
        <h1>Loading profile...</h1>
      </div>
    );
  }

  if (isError && !error.status) {
    <SomthingWentWrong />;
  }
  if (isError || (isPostError && postError?.message !== "404")) {
    return <h1>Error {postError?.message}. Please try again.</h1>;
  }
  return (
    <div className="flex lg:justify-center justify-end dark:*:border-[#383838]">
      <div className=" md:w-[80%]  lg:w-[70%] xl:w-[60%]  w-full  mt-20 flex flex-col h-full">
        <div id="Profile" className="flex-grow w-full sm:p-4 border-inherit">
          <ProfileHeader profileId={profileId} />
          <div className="w-full flex gap-5  p-2 px-4 border-inherit">
            <div className="w-full flex gap-5 underline-offset-[.5rem] transition-all duration-400 ">
              <p className="hover:underline pb-1 cursor-pointer">Home</p>
              <p className="hover:underline pb-1 cursor-pointer">About</p>
            </div>
          </div>
          <div
            className={`lg:px-5 py-20   border-inherit pt-5 h-full dark:*:border-[#383838] ${
              !userProfile?.posts?.length > 0 &&
              "flex justify-center items-center "
            }`}
          >
            {/* <RenderPosts /> */}
            {userProfile?.posts?.length > 0
              ? posts.map((post, idx, arr) => (
                  <PostPreview
                    ref={arr.length % 3 === 0 ? lastpostRef : null}
                    key={post.id}
                    post={post}
                  />
                ))
              : profileId === user?.id && (
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
    </div>
  );
}

export default Profile;
