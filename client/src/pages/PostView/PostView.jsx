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
import Follow from "../../component/buttons/follow";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import ErrorPage from "../ErrorPages/ErrorPage";
import Menu from "../../component/Menus/Menu";
import ProfileImage from "../../component/ProfileImage";
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
import { setCommentCred } from "../../store/slices/postSlice";
import { setOpenBigFrame } from "../../store/slices/uiSlice";
import AIBtn from "../../component/buttons/AIBtn";
import PostContent from "./components/PostContent";
import PostHeader from "./components/PostHeader";

// Lazy loaded components
const CopyToClipboardInput = lazy(
  () => import("../../component/CopyToClipboardInput")
);

// Memoized sub-components for better performance

function PostView() {
  // Redux state
  const { commentCred } = useSelector((state) => state.posts);
  // const { user } = useSelector((state) => state.auth);

  // Local state
  const [postView, setPostView] = useState({});

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
    if (!socket || !postView?.id) return;

    const handleUpdateComment = (newComment) => {
      if (newComment?.postId === postView?.id) {
        setPostView((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), newComment],
        }));
      }
    };

    socket.on("update_comment", handleUpdateComment);

    return () => {
      socket.off("update_comment", handleUpdateComment);
    };
  }, [socket, postView?.id]);

  // Fetch Post Full View with React Query
  const { isLoading, isError, error } = useQuery({
    queryKey: ["fullpostData", id],
    queryFn: () => fetchDataById(id),
    onSuccess: (data) => {
      setPostView(data);
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
  const { POST_MENU } = useMenuConstant(postView, "post");

  const { userImageurl } = useMemo(
    () => userImageSrc(postView?.User),
    [postView?.User]
  );

  const comments = useMemo(
    () =>
      postView?.comments?.filter((comment) => comment.topCommentId === null) ||
      [],
    [postView?.comments]
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
          alt: postView.title,
        })
      );
    },
    [dispatch, postView.title]
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
    <section className="relative flex justify-center w-full h-full px-2 my-16 border-inherit transition-all duration-500 dark:*:border-[#383838]">
      <article className="relative animate-fedin1s max-w-4xl w-full px-4 flex flex-col justify-center items-center border-inherit">
        <PostHeader
          postView={postView}
          userImageurl={userImageurl}
          onImageClick={handleBigFrame}
        />

        <div className="flex justify-between items-center font-light sm:text-base text-xs py-3 w-full">
          <div className="flex items-center gap-4">
            <Like className="min-w-10" post={postView} />
            <FedInBtn
              action={handleComment}
              className="flex items-center gap-1 min-w-10"
            >
              {icons["comment"]}
              <AbbreviateNumber rawNumber={comments?.length} />
            </FedInBtn>
            <Bookmark post={postView} />
          </div>
          <div className="flex gap-7 justify-between">
            <Menu
              ref={menuRef}
              menuId={menuId}
              setMenuId={setMenuId}
              items={POST_MENU}
              className="w-full max-h-1/2"
              content={postView}
            />
          </div>
        </div>

        {postView?.previewImage && (
          <ImageFigure
            onClick={() => handleBigFrame(postView?.previewImage)}
            imageUrl={postView?.previewImage}
            objectFit="fill"
          />
        )}

        <PostContent
          postContent={postView?.postContent}
          onImageClick={handleBigFrame}
        />
      </article>

      <AIBtn
        state={{ postData: postView }}
        className="fixed bottom-20 right-10 rounded-xl bg-blue-600 text-white  before:text-black p-2 shadow-lg hover:bg-blue-700 transition-colors duration-200 z-30"
      />
      <Outlet context={{ postData: postView }} />
    </section>
  );
}

export default memo(PostView);
