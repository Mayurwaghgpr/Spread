import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";

// Component imports
import Bookmark from "../../components/buttons/bookmark/Bookmark";
import Like from "../../components/buttons/Like/Like";
import ErrorPage from "../ErrorPages/ErrorPage";
import Menu from "../../components/menus/Menu";

import ImageFigure from "../../components/utilityComp/ImageFigure";
import FedInBtn from "../../components/buttons/FedInBtn";
import LoaderScreen from "../../components/loaders/loaderScreen";
import PostViewSkeleton from "../../components/loaders/PostViewSkeleton";

// Hook imports
import usePublicApis from "../../services/publicApis";
import useIcons from "../../hooks/useIcons";
import useMenuConstant from "../../hooks/useMenuConstant";
import useClickOutside from "../../hooks/useClickOutside";
import useSocket from "../../hooks/useSocket";

// Utility imports
import userImageSrc from "../../utils/functions/userImageSrc";
import AbbreviateNumber from "../../utils/components/AbbreviateNumber";
import { setCommentCred, setPostViewData } from "../../store/slices/postSlice";
import { setOpenBigFrame } from "../../store/slices/uiSlice";
import AIBtn from "../../components/buttons/AIBtn";
import AIDrawer from "../../components/aiComp/AIDrawer";
import PostHeader from "./components/PostHeader";
import useProfileApi from "../../services/useProfileApis";
import UserPopover from "../../components/utilityComp/UserPopover";
import PostBlocks from "./components/PostBlocks";
// import CommentSection from "../Comment/CommentSection";

// Memoized sub-components for better performance

function PostView() {
  // Redux state
  const { commentCred, postViewData } = useSelector((state) => state.posts);
  // const { user } = useSelector((state) => state.auth);

  // Hooks
  const { fetchPostById } = usePublicApis();
  const { fetchUserProfile } = useProfileApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(
    searchParams.get("ai") === "true"
  );

  useEffect(() => {
    if (searchParams.get("ai") === "true") {
      setIsAIDrawerOpen(true);
    }
  }, [searchParams]);

  const menuRef = useRef(null);
  const icons = useIcons();
  const { menuId, setMenuId } = useClickOutside(menuRef);
  const { socket } = useSocket();
  // Socket event handler for real-time comment updates
  useEffect(() => {
    if (!socket || !postViewData?.id) return;

    const handleUpdateComment = (newComment) => {
      if (newComment?.postId === postViewData?.id) {
        dispatch(
          setPostViewData({
            ...postViewData,
            comments: [...(postViewData.comments || []), newComment],
          }),
        );
      }
    };

    socket.on("update_comment", handleUpdateComment);

    return () => {
      socket.off("update_comment", handleUpdateComment);
    };
  }, [socket, postViewData?.id]);

  // Fetch Post Full View with React Query
  const { data: fetchedPostData, isLoading, isError, error } = useQuery({
    queryKey: ["FullPostData", id],
    queryFn: () => fetchPostById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (fetchedPostData) {
      dispatch(setPostViewData(fetchedPostData));
      dispatch(
        setCommentCred({
          ...commentCred,
          postId: fetchedPostData?.id,
        }),
      );
    }
  }, [fetchedPostData, dispatch]);
  const { data: authorData, isLoading: isAuthorLoading } = useQuery({
    queryKey: ["author_details", postViewData?.author?.id],
    queryFn: () => fetchUserProfile(postViewData?.author?.id),
    enabled: !!postViewData?.author?.id,
    refetchOnWindowFocus: false,
  });

  // Memoized values
  const { POST_MENU } = useMenuConstant(postViewData, "post");

  const { userImageurl } = useMemo(
    () => userImageSrc(postViewData?.author),
    [postViewData?.author],
  );

  const comments = useMemo(
    () =>
      postViewData?.comments?.filter(
        (comment) => comment.topCommentId === null,
      ) || [],
    [postViewData?.comments],
  );

  // Event handlers
  const handleComment = useCallback(() => {
    navigate("comments");
  }, [navigate]);

  const handleBigFrame = useCallback(
    (src) => {
      dispatch(
        setOpenBigFrame({
          src,
          alt: postViewData.title,
        }),
      );
    },
    [dispatch, postViewData.title],
  );
  // Error and loading states
  if (isError) {
    return (
      <ErrorPage
        message={error?.data?.message || "Failed to load post"}
        statusCode={error?.data?.status || 500}
      />
    );
  }

  if (isLoading) {
    return <>
      <PostViewSkeleton />
    </>
  }
  return (
    <div className="relative flex justify-center items-start w-full min-h-screen overflow-y-auto px-4 sm:px-6 py-6 sm:py-10 border-inherit">
      <div className="relative max-w-3xl w-full flex flex-col items-center gap-6 border-inherit mb-36">
        <article className="relative w-full flex flex-col items-center gap-6 border-inherit animate-fedin1s">
          <PostHeader
            postView={postViewData}
            userImageurl={userImageurl}
            onImageClick={handleBigFrame}
          />

          {/* Sleek Action Dock */}
          <div className="flex justify-between items-center text-xs sm:text-sm py-2 px-4 w-full bg-stone-100/80 dark:bg-[#121215]/80 border border-stone-200/80 dark:border-stone-800/80 rounded-full backdrop-blur-xs">
            <div className="flex items-center gap-4">
              <Like post={postViewData} />
              <FedInBtn
                action={handleComment}
                className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
              >
                <span className="text-base">{icons["comment"]}</span>
                <span className="sm:inline hidden font-medium">Comments</span>
                <span className="text-xs font-semibold">
                  <AbbreviateNumber rawNumber={comments?.length} />
                </span>
              </FedInBtn>
              <div className="flex justify-center items-center gap-1.5">
                <Bookmark post={postViewData}>
                  <span className="sm:inline hidden font-medium">Bookmark</span>
                </Bookmark>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Menu
                ref={menuRef}
                menuId={menuId}
                setMenuId={setMenuId}
                items={POST_MENU}
                className="w-full max-h-1/2"
                content={postViewData}
              />
            </div>
          </div>

          {postViewData?.previewImage && (
            <ImageFigure
              onClick={() => handleBigFrame(postViewData?.previewImage)}
              imageUrl={postViewData?.previewImage}
              objectFit="cover"
            />
          )}

          <PostBlocks
            postBlocks={postViewData?.postBlocks}
            onImageClick={handleBigFrame}
          />
        </article>

        {/* Author Profile Footer Card */}
        {authorData && (
          <div className="w-full pt-8 border-t border-stone-200/70 dark:border-stone-800/70">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
              Written by
            </h3>
            <UserPopover
              person={authorData}
              className="relative w-full border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-5 bg-stone-50/50 dark:bg-[#111114]/60 shadow-xs"
            />
          </div>
        )}
      </div>

      <AIBtn
        onClick={() => setIsAIDrawerOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40"
      />

      <AIDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => {
          setIsAIDrawerOpen(false);
          if (searchParams.get("ai")) {
            searchParams.delete("ai");
            setSearchParams(searchParams, { replace: true });
          }
        }}
        postData={postViewData}
      />
      <Outlet />
    </div>
  );
}

export default memo(PostView);
