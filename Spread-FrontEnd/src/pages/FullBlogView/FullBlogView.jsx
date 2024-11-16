import React, { lazy, useEffect, useState } from "react";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import "boxicons";
import { useQuery } from "react-query";

import Bookmark from "../../component/buttons/Bookmark";
import usePublicApis from "../../Apis/publicApis";
import Like from "../../component/buttons/Like";
import Menu from "../../component/postsComp/menu";

const SomthingWentWrong = lazy(() => import("../ErrorPages/somthingWentWrong"));
const Comment = lazy(() => import("../../component/postsComp/comment"));
const CopyToClipboardInput = lazy(
  () => import("../../component/CopyToClipboardInput")
);

function FullBlogView() {
  const [openComments, setOpenComments] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { fetchDataById } = usePublicApis();

  const {
    data: postFullview,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fullpostData", id],
    queryFn: () => fetchDataById(id),
  });

  if (isError || error) {
    console.error("Error fetching data:", error);
    return <SomthingWentWrong />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }
  return (
    <main className="container mx-auto py-6 mt-16 dark:*:border-[#383838]">
      <article className="max-w-4xl mx-auto p-6 rounded-lg flex flex-col justify-center items-center px-2 ">
        <header className="mb-6 w-full px-3">
          <section className="mb-6">
            <h1 className="text-3xl break-words lg:text-5xl font-bold mb-2">
              {postFullview?.title}
            </h1>
            <p className="text-lg lg:text-2xl leading-relaxed">
              {postFullview?.subtitelpagraph}
            </p>
          </section>
          <div className="flex items-center my-4">
            <img
              alt={`${postFullview?.User?.username}'s profile`}
              src={
                postFullview?.User?.userImage &&
                `${postFullview?.User?.userImage}`
              }
              className="w-12 h-12 rounded-full mr-4 object-cover object-top"
              loading="lazy"
            />
            <div>
              <Link
                to={`/profile/@${postFullview?.User?.username
                  ?.split(" ")
                  .slice(0, -1)
                  .join("")}/${postFullview?.User?.id}`}
              >
                {postFullview?.User?.username}
              </Link>
              <p className="text-sm ">
                {format(new Date(postFullview?.createdAt), "LLL dd, yyyy")}
              </p>
            </div>
          </div>
        </header>

        <div className="flex justify-between   items-center border-inherit border-y px-3 py-3  font-light  w-full">
          <div className="flex   gap-4">
            <Like className={"text-sm"} post={postFullview} />
            <button
              onClick={() => setOpenComments(true)}
              className="flex items-center gap-1"
            >
              <i className="bi bi-chat"></i>
              <span>100</span>
            </button>
          </div>
          <div className="flex gap-7 justify-between">
            <Bookmark post={postFullview} />
            <Menu post={postFullview} />
          </div>
        </div>

        {postFullview?.titleImage && (
          <figure className="my-6 w-full">
            <img
              className="w-full rounded-lg"
              src={`${postFullview?.titleImage}`}
              alt="Main Blog Image"
              loading="lazy"
            />
            <figcaption></figcaption>
          </figure>
        )}
        {/* {console.log({ postDatabyId })} */}
        {postFullview?.postContent?.map((item) => (
          <section key={item.id} className="mb-6 w-full border-inherit ">
            {item.type === "image" && item.content && (
              <figure className="mb-4">
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
      {openComments && <Comment setOpenComments={setOpenComments} />}
    </main>
  );
}

export default FullBlogView;
