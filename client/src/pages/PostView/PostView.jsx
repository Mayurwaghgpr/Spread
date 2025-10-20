import React, {
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "react-query";

// Component imports
import Bookmark from "../../component/buttons/Bookmark";
import Like from "../../component/buttons/Like/Like";
import ErrorPage from "../ErrorPages/ErrorPage";
import Menu from "../../component/Menus/Menu";

import ImageFigure from "../../component/utilityComp/ImageFigure";
import FedInBtn from "../../component/buttons/FedInBtn";
import LoaderScreen from "../../component/loaders/loaderScreen";

// Hook imports
import usePublicApis from "../../services/publicApis";
import useIcons from "../../hooks/useIcons";
import useMenuConstant from "../../hooks/useMenuConstant";
import useClickOutside from "../../hooks/useClickOutside";
import useSocket from "../../hooks/useSocket";

// Utility imports
import userImageSrc from "../../utils/userImageSrc";
import AbbreviateNumber from "../../utils/AbbreviateNumber";
import { setCommentCred, setPostViewData } from "../../store/slices/postSlice";
import { setOpenBigFrame } from "../../store/slices/uiSlice";
import AIBtn from "../../component/buttons/AIBtn";
import PostContent from "./components/PostContent";
import PostHeader from "./components/PostHeader";
import ProfileImage from "../../component/ProfileImage";
import Follow from "../../component/buttons/follow";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import CommentSection from "../Comment/CommentSection";

// Memoized sub-components for better performance

function PostView() {
  // Redux state
  const { commentCred, postViewData } = useSelector((state) => state.posts);
  // const { user } = useSelector((state) => state.auth);

  // Hooks
  const { fetchDataById } = usePublicApis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
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
          })
        );
      }
    };

    socket.on("update_comment", handleUpdateComment);

    return () => {
      socket.off("update_comment", handleUpdateComment);
    };
  }, [socket, postViewData?.id]);

  // Fetch Post Full View with React Query
  const { isLoading, isError, error } = useQuery({
    queryKey: ["FullPostData", id],
    queryFn: () => fetchDataById(id),
    onSuccess: (data) => {
      dispatch(setPostViewData(data));
      dispatch(
        setCommentCred({
          ...commentCred,
          postId: data?.id,
        })
      );
    },
    refetchOnWindowFocus: false,
  });

  // Memoized values
  const { POST_MENU } = useMenuConstant(postViewData, "post");

  const { userImageurl } = useMemo(
    () => userImageSrc(postViewData?.user),
    [postViewData?.user]
  );

  const comments = useMemo(
    () =>
      postViewData?.comments?.filter(
        (comment) => comment.topCommentId === null
      ) || [],
    [postViewData?.comments]
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
        })
      );
    },
    [dispatch, postViewData.title]
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
    return <LoaderScreen message="Loading post..." />;
  }
  return (
    <div className="relative flex justify-end items-start w-full h-screen overflow-auto px-2 sm:py-10 py-5  border-inherit transition-all duration-500 ">
      <article className="relative animate-fedin1s max-w-4xl w-full sm:px-4 px-2 flex flex-col justify-center items-center gap-5 border-inherit mb-40">
        <PostHeader
          postView={postViewData}
          userImageurl={userImageurl}
          onImageClick={handleBigFrame}
        />

        <div className="flex justify-between items-center  sm:text-sm text-xs py-3 w-full border rounded-lg border-inherit px-5">
          <div className="flex items-center gap-4  border-inherit">
            <Like post={postViewData} />
            <FedInBtn
              action={handleComment}
              className="flex items-center gap-2 "
            >
              {icons["comment"]}
              <span className=" sm:block hidden ">Comment</span>
              <AbbreviateNumber rawNumber={comments?.length} />
            </FedInBtn>
            <div className=" flex justify-center items-center gap-2">
              <Bookmark post={postViewData}>
                <span className="sm:block hidden ">Bookmark </span>
              </Bookmark>
            </div>
          </div>
          <div className="flex gap-7 justify-between">
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
            objectFit="fill"
          />
        )}

        <PostContent
          postContent={postViewData?.postContent}
          onImageClick={handleBigFrame}
        />
      </article>

      {/* Author profile */}
      <div className="relative sm:flex hidden items-center sm:text-base text-xs justify-between gap-5  p-5 w-full max-w-sm  border rounded-lg border-inherit">
        <div className="flex items-start gap-5 h-full w-full">
          <div className=" flex justify-center items-start flex-col h-full w-full ">
            <ProfileImage
              className="sm:w-10 sm:h-10 w-8 h-8"
              image={userImageurl}
              alt={postViewData?.user?.display}
              title="author profile"
            />
            <Link
              className="w-full text-nowrap hover:underline underline-offset-4"
              to={`/profile/@${postViewData?.user?.username
                ?.split(" ")
                .slice(0, -1)
                .join("")}/${postViewData?.user?.id}`}
            >
              {postViewData?.user?.displayName}
            </Link>
            <FormatedTime
              className="text-black dark:text-white sm:text-xs text-[.7em]"
              date={postViewData?.createdAt}
            />
          </div>
          <div className="flex justify-center items-start h-full w-full">
            <Follow
              person={postViewData?.user}
              className="relative sm:px-4 sm:py-2 bg-none hover:underline underline-offset-4 border-none text-blue-500"
            />
          </div>
        </div>
      </div>

      <AIBtn
        state={{ postData: postViewData }}
        className="fixed bottom-20 right-10 rounded-xl p-2 transition-colors duration-200"
      />
      <Outlet />
    </div>
  );
}

export default memo(PostView);
