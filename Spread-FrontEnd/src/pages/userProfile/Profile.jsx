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

function Profile() {
  const dispatch = useDispatch();
  const params = useParams();
  const { fetchUserProfile, fetchUserData } = useProfileApi();

  const { isLogin, user } = useSelector((state) => state.auth);
  const { userProfile, FollowInfo } = useSelector((state) => state.profile);
  const profileId = params.id || user?.id;

  const { mutate, isError, isFetching, isLoading } = useMutation(
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
  }, []);

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
    }
  );

  const { lastpostRef } = useLastPostObserver(
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage
  );

  const RenderPosts = () => {
    if (postsData?.pages?.length > 0) {
      return postsData.pages.map((page) =>
        page.posts?.map((post, idx, arr) => (
          <PostPreview
            ref={arr.length % 3 === 0 ? lastpostRef : null}
            key={post.id}
            post={post}
          />
        ))
      );
    }

    if (profileId === user?.id) {
      return (
        <div className="max-w-[38rem] min-w-[13rem] w-full flex flex-col justify-center items-center text-2xl border-dashed border-2 rounded-lg max-h-[300px] h-full min-h-[200px] border-inherit">
          No posts yet{" "}
          {isLogin && (
            <Link to="/write" className="text-gray-500 font-thin ">
              Add New Post +
            </Link>
          )}
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return <h1>Loading profile data...</h1>;
  }

  if (isError || (isPostError && postError?.message !== "404")) {
    return <h1>Error {postError?.message}. Please try again.</h1>;
  }
  return (
    <div className="flex justify-center dark:*:border-[#383838]">
      <div className=" md:w-[80%] mt-14  lg:w-[70%] xl:w-[60%]  w-full flex flex-col h-full">
        <div id="Profile" className="flex-grow w-full sm:p-4 border-inherit">
          <ProfileHeader profileId={profileId} />
          <div className="w-full flex gap-5  p-2 px-4 border-inherit">
            <div className="w-full flex gap-5 underline-offset-[.5rem] transition-all duration-400 ">
              <p className="hover:border-b pb-1 cursor-pointer">Home</p>
              <p className="hover:border-b pb-1 cursor-pointer">About</p>
            </div>
          </div>
          <div
            className={`lg:px-5 p-3 pt-5 h-full dark:*:border-[#383838] ${
              !postsData?.pages?.length && "flex justify-center items-center "
            }`}
          >
            <RenderPosts />
            {isFetchingNextPage && (
              <div className="w-full flex justify-center items-center h-24">
                <Spinner />
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
