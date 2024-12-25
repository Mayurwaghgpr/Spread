import React, { lazy, useEffect, useState } from "react";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import "boxicons";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";
import Bookmark from "../../component/buttons/Bookmark";
import usePublicApis from "../../Apis/publicApis";
import Like from "../../component/buttons/Like/Like";
import Menu from "../../component/postsComp/menu";
import Follow from "../../component/buttons/follow";
import userImageSrc from "../../utils/userImageSrc";
import { FaComment, FaCommentDots, FaRegComment } from "react-icons/fa6";
import abbreviateNumber from "../../utils/numAbrivation";
import { setCommentCred } from "../../redux/slices/postSlice";

const SomthingWentWrong = lazy(() => import("../ErrorPages/somthingWentWrong"));
const CommentSection = lazy(() => import("../Comment/CommentSection"));
const CopyToClipboardInput = lazy(
  () => import("../../component/CopyToClipboardInput")
);

function FullBlogView() {
  const [openComments, setOpenComments] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { fetchDataById } = usePublicApis();

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

  if (isError || error) {
    console.error("Error fetching data:", error);
    return <SomthingWentWrong />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1>Loading...</h1>
      </div>
    );
  }

  const userImage = userImageSrc(postView?.User);

  const Comments = postView?.comments?.filter(
    (comment) => comment.topCommentId === null
  );

  return (
    <main className="container  py-4 mt-16 dark:*:border-[#383838]">
      <article className="max-w-4xl 2xl:mx-auto xl:ml-auto xl:mr-16 px-6 rounded-lg flex flex-col justify-center items-center">
        <header className="mb-6 w-full px-3">
          <section className="flex flex-col gap-2">
            <div className="w-full flex justify-end text-lg">
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
                  className={`relative hover:underline underline-offset-4 text-blue-500 `}
                />
              </div>

              <span className="text-xs  text-black dark:text-white dark:text-opacity-50 text-opacity-50">
                {format(new Date(postView?.createdAt), "LLL dd, yyyy")}
              </span>
            </div>
          </div>
        </header>

        <div className="flex justify-between sm:text-lg font-thin items-center border-inherit border-y px-3 py-3 w-full">
          <div className="flex gap-4 text-[#383838] ">
            <Like className={"min-w-10"} post={postView} />
            <button
              onClick={() => setOpenComments(true)}
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
          <section key={item.id} className="mb-6 w-full px-4 border-inherit ">
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
      {openComments && (
        <CommentSection post={postView} setOpenComments={setOpenComments} />
      )}
    </main>
  );
}

export default FullBlogView;
