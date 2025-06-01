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
import DOMPurify from "dompurify";
import { useMutation, useQuery } from "react-query";
import Bookmark from "../../component/buttons/Bookmark";
import usePublicApis from "../../Apis/publicApis";
import Like from "../../component/buttons/Like/Like";
import Follow from "../../component/buttons/follow";
import userImageSrc from "../../utils/userImageSrc";
import { setCommentCred } from "../../redux/slices/postSlice";
import AIResponse from "../../component/aiComp/AiResponse";
import PostsApis from "../../Apis/PostsApis";
import FormatedTime from "../../component/utilityComp/FormatedTime";
import { setToast } from "../../redux/slices/uiSlice";
import ErrorPage from "../ErrorPages/ErrorPage";
import Menu from "../../component/Menus/Menu";
import ProfileImage from "../../component/ProfileImage";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import useMenuConstant from "../../hooks/useMenuConstant";
import useClickOutside from "../../hooks/useClickOutside";
import ImageFigure from "../../component/utilityComp/ImageFigure";
import AbbreviateNumber from "../../utils/AbbreviateNumber";
import FedInBtn from "../../component/buttons/FedInBtn";
import useSocket from "../../hooks/useSocket";
import Spinner from "../../component/loaders/Spinner";
import LoaderScreen from "../../component/loaders/loaderScreen";

const CopyToClipboardInput = lazy(
  () => import("../../component/CopyToClipboardInput")
);

function PostView() {
  const [show, setshow] = useState(false);
  const { commentCred } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [postView, setPostView] = useState({});
  const { fetchDataById } = usePublicApis();
  const { getAiGenAnalysis } = PostsApis();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const menuRef = useRef(null);

  const icons = useIcons();
  const { menuId, setMenuId } = useClickOutside(menuRef);
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("update_comment", (newComment) => {
      console.log({ newComment });
      if (newComment?.postId === postView?.id) {
        console.log("matching");
        setPostView((prev) => ({
          ...prev,
          comments: [...prev.comments, newComment],
        }));
      }
    });
  }, [socket, postView?.id]);
  //Fetch Post Full View
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

  //Getting menu items array from hook
  const { POST_MENU } = useMenuConstant(postView, "post");

  // Fetches  Ai generated analysis on post
  const {
    mutate,
    data,
    isLoading: isAnalyzing,
    error: aiError,
  } = useMutation({
    mutationFn: getAiGenAnalysis,
    onSuccess: () => {},
    onError: ({ data }) => {
      setToast({ message: data.message, type: "success" });
    },
  });

  //To Open Comments of post
  const handelComment = useCallback(() => {
    //Setting data initialy
    navigate("comments");
  }, []);

  // Returns the image url by cheking the original path
  const { userImageurl } = useMemo(
    () => userImageSrc(postView?.User),
    [postView?.User]
  );

  // Memoies the filltered topComment data by comments which don't have topCommentId
  const Comments = useMemo(
    () =>
      postView?.comments?.filter((comment) => comment.topCommentId === null),
    [postView?.comments]
  );

  if (isError) {
    return (
      <ErrorPage
        message={error?.data?.message || "Failed to load post"}
        statusCode={error?.data?.status || 500}
      />
    );
  }

  if (!isLoading) {
    return <LoaderScreen message={"loading post..."} />;
  }

  return (
    <section
      className={`relative flex justify-center w-full h-full px-2 my-16 border-inherit transition-all duration-500  dark:*:border-[#383838] `}
    >
      {!show ? (
        <article
          style={{ backgroundColor: "" }}
          className={`relative animate-fedin1s max-w-4xl px-4  flex flex-col justify-center items-center 
           border-inheri ${
             isAnalyzing ? "shimmer-effect dark:shimmer-effect-dark" : " "
           } `}
        >
          <header className="mb-6 w-full border-inherit">
            <section className="flex flex-col gap-2  border-inherit">
              <div className=" relative flex items-center sm:text-base text-xs justify-between gap-5 my-4 ">
                <div className="flex items-center gap-5 ">
                  <ProfileImage
                    className="sm:w-10 sm:h-10 w-8 h-8"
                    image={userImageurl}
                    alt={postView?.User?.username}
                    title={"author profile"}
                  />

                  <div className="">
                    <div className="flex gap-2 items-center w-full">
                      {" "}
                      <Link
                        className="w-full text-nowrap hover:underline underline-offset-4"
                        to={`/profile/@${postView?.User?.username
                          ?.split(" ")
                          .slice(0, -1)
                          .join("")}/${postView?.User?.id}`}
                      >
                        {postView?.User?.username}
                      </Link>
                      <Follow
                        People={postView?.User}
                        className={`relative hover:underline underline-offset-4 border-none  text-blue-500 `}
                      />
                    </div>

                    <FormatedTime
                      className={
                        "text-black dark:text-white sm:text-xs text-[.7em]"
                      }
                      date={postView?.createdAt}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-wrap justify-start ">
                <h1 className="text-xl break-words lg:text-4xl w-full font-semibold mb-2">
                  {postView?.title}
                </h1>
                <p className="text-sm text-black dark:text-white text-opacity-60 dark:text-opacity-70 lg:text-xl leading-relaxed">
                  {postView?.subtitle}
                </p>
              </div>
            </section>
          </header>

          <div className="flex justify-between items-center font-light sm:text-base text-xs py-3 w-full">
            <div className="flex items-center gap-4  ">
              <Like className={"min-w-10"} post={postView} />
              <FedInBtn
                action={handelComment}
                className="flex items-center gap-1 min-w-10"
              >
                {icons["comment"]}
                <AbbreviateNumber rawNumber={Comments?.length} />
              </FedInBtn>
              <Bookmark post={postView} />
            </div>
            <div className="flex gap-7  justify-between">
              <Menu
                ref={menuRef}
                menuId={menuId}
                setMenuId={setMenuId}
                items={POST_MENU}
                className={"w-full max-h-1/2"}
                content={postView}
              />
            </div>
          </div>

          {postView?.previewImage && (
            <ImageFigure imageUrl={postView?.previewImage} objectFit="fill" />
          )}
          {postView?.postContent?.map((item) => (
            <section
              key={item.id}
              className="mb-6 w-full border-inherit sm:text-lg text-sm "
            >
              {item.type === "image" && item.content && (
                <ImageFigure
                  className=""
                  imageUrl={item.content}
                  altText={""}
                  caption={item.title}
                />
              )}
              {item?.type === "text" ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.content),
                  }}
                  className="w-full "
                ></p>
              ) : (
                item?.type !== "text" &&
                item?.type !== "image" && <CopyToClipboardInput item={item} />
              )}
            </section>
          ))}
        </article>
      ) : (
        // To show ai response after post analysis
        <AIResponse
          setshow={setshow}
          mutate={mutate}
          isAnalyzing={isAnalyzing}
          aiError={aiError}
          data={data}
          postData={postView}
        />
      )}
      <Ibutton
        action={() => {
          setshow(true);
          !data && mutate({ id });
        }}
        className="z-40 border-inherit before:transition-all before:text-xs sm:text-xl text-lg flex justify-center  before:content-['Gerente_AI_analysis_for_this_post'] before:border-inherit before:text-center before:p-2  before:duration-200 before:bg-light before:dark:bg-dark before:hover:opacity-100 before:opacity-0 before:pointer-events-none before:border before:shadow-sm before:w-52  before:absolute before:top-14 before:rounded-lg cursor-pointer fixed top-4 sm:right-64"
      >
        AI
        {icons["glitter"]}
      </Ibutton>
      <Outlet context={postView} />
    </section>
  );
}

export default memo(PostView);
