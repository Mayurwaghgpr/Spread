import React, {
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { format } from "date-fns";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import "boxicons";
import { useMutation, useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";
import Bookmark from "../../component/buttons/Bookmark";
import usePublicApis from "../../Apis/publicApis";
import Like from "../../component/buttons/Like/Like";
import Menu from "../../component/postsComp/menu";
import Follow from "../../component/buttons/follow";
import userImageSrc from "../../utils/userImageSrc";
import { FaRegComment } from "react-icons/fa6";
import abbreviateNumber from "../../utils/numAbrivation";
import { setCommentCred } from "../../redux/slices/postSlice";
import { WiStars } from "react-icons/wi";
import AIResponse from "../../component/AIComp/AiResponse";
import PostsApis from "../../Apis/PostsApis";
import { IoClose, IoReloadCircle } from "react-icons/io5";
import { TiArrowSync } from "react-icons/ti";
import { setToast } from "../../redux/slices/uiSlice";

const SomthingWentWrong = lazy(() => import("../ErrorPages/somthingWentWrong"));
const CopyToClipboardInput = lazy(
  () => import("../../component/CopyToClipboardInput")
);

function PostView() {
  const { commentCred } = useSelector((state) => state.posts);
  const [show, setshow] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchDataById } = usePublicApis();
  const { getAiGenAnalysis } = PostsApis();

  const {
    data: postView,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fullpostData", id],
    queryFn: () => fetchDataById(id),
    refetchOnWindowFocus: false,
  });
  const {
    mutate,
    data,
    isLoading: isAnalyzing,
    error: aiError,
  } = useMutation({
    mutationFn: getAiGenAnalysis,
    onSuccess: () => {
      setshow(true);
    },
    onError: ({ data }) => {
      setToast({ message: data, type: "success" });
    },
  });

  useEffect(() => {
    dispatch(
      setCommentCred({
        ...commentCred,
        postId: postView?.id,
      })
    );
  }, [postView?.id]);

  const handelComment = useCallback(() => {
    //Setting data initialy
    navigate("comments");
  }, []);
  const userImage = useMemo(
    () => userImageSrc(postView?.User),
    [postView?.User]
  );
  const Comments = useMemo(
    () =>
      postView?.comments?.filter((comment) => comment.topCommentId === null),
    [postView?.comments]
  );
  if (isError || error) {
    return <SomthingWentWrong />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1>Loading...</h1>
      </div>
    );
  }

  console.log(aiError);
  console.log(data);
  return (
    <main
      className={`relative flex justify-center h-full border-inherit transition-all duration-500 min-w-full  my-16 dark:*:border-[#383838]`}
    >
      {!show ? (
        <article
          className={`relative animate-fedin1s max-w-4xl p-2  flex flex-col justify-center items-center 
           border-inheri
    ${isAnalyzing ? "shimmer-effect dark:shimmer-effect-dark" : ""}
  `}
        >
          <div
            onClick={() => {
              data && setshow(true);
              !data && mutate({ id });
            }}
            className="z-50 border-inherit before:transition-all before:text-xs text-xl flex justify-center  before:content-['Gerente_AI_analysis_for_this_post'] before:border-inherit before:text-center before:p-2  before:duration-200 before:bg-[#efecec] before:dark:bg-black before:hover:opacity-100 before:opacity-0 before:pointer-events-none before:border before:shadow-sm before:w-52  before:absolute before:top-14 before:-left before:rounded-lg cursor-pointer fixed top-4 sm:right-60"
          >
            {" "}
            <span>AI</span>
            <WiStars className="text-2xl" />
          </div>
          <header className="mb-6 w-full px-3  border-inherit">
            <section className="flex flex-col gap-2  border-inherit">
              <div className="w-full flex justify-end text-lg  border-inherit">
                {" "}
                <Menu post={postView} />
              </div>
              <h1 className="text-xl break-words lg:text-5xl w-full font-semibold mb-2">
                {postView?.title}
              </h1>
              <p className="text-md text-black dark:text-white text-opacity-60 dark:text-opacity-70 lg:text-2xl leading-relaxed">
                {postView?.subtitelpagraph}
              </p>
            </section>
            <div className=" relative  flex gap-5 items-center my-4">
              <div className="w-10 h-10">
                {" "}
                <img
                  alt={`${postView?.User?.username}`}
                  src={userImage.userImageurl}
                  className="w-full h-full rounded-full mr-4 object-cover object-top"
                  loading="lazy"
                />
              </div>

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

                <span className="text-xs  text-black dark:text-white dark:text-opacity-50 text-opacity-50">
                  {format(new Date(postView?.createdAt), "LLL dd, yyyy")}
                </span>
              </div>
            </div>
          </header>

          <div className="flex justify-between sm:text-lg  items-center border-inherit border-y px-3 py-3 w-full">
            <div className="flex gap-4 text-[#383838] ">
              <Like className={"min-w-10"} post={postView} />
              <button
                onClick={handelComment}
                className="flex items-center gap-1 min-w-10"
              >
                <FaRegComment />
                <span>{abbreviateNumber(Comments?.length)}</span>
              </button>
            </div>
            <div className="flex gap-7 text-[#383838]  justify-between">
              <Bookmark post={postView} />
            </div>
          </div>

          {postView?.titleImage && (
            <figure className="my-6 w-full px-4">
              <img
                className="w-full rounded-lg object-fill object-center "
                src={`${postView?.titleImage}`}
                alt="Title Image"
                loading="lazy"
              />
              <figcaption></figcaption>
            </figure>
          )}
          {postView?.postContent?.map((item) => (
            <section key={item.id} className="mb-6 w-full px-2 border-inherit ">
              {item.type === "image" && item.content && (
                <figure className="my-6 w-full h-auto">
                  <img
                    src={`${item.content}`}
                    alt="Content"
                    className="w-full rounded-lg object-cover object-center"
                    loading="lazy"
                  />
                  <figcaption className="text-center">{item.title}</figcaption>
                </figure>
              )}
              {item?.type === "text" ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.content),
                  }}
                  className="text-lg w-full "
                ></p>
              ) : (
                item?.type !== "text" &&
                item?.type !== "image" && <CopyToClipboardInput item={item} />
              )}
            </section>
          ))}
        </article>
      ) : (
        <AIResponse
          setshow={setshow}
          mutate={mutate}
          isAnalyzing={isAnalyzing}
          aiError={aiError}
          data={data}
          postData={postView}
        />
      )}
      <Outlet context={postView} />
    </main>
  );
}

export default memo(PostView);
