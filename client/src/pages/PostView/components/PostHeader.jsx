import { Link } from "react-router-dom";
import ProfileImage from "../../../component/ProfileImage";
import Follow from "../../../component/buttons/follow";
import FormatedTime from "../../../component/utilityComp/FormatedTime";
import { memo } from "react";

const PostHeader = memo(({ postView, userImageurl, onImageClick }) => (
  <header className="mb-6 border-inherit w-full">
    <div className="flex flex-col gap-2 border-inherit w-full">
      <div className="relative flex items-center sm:text-base text-xs justify-between gap-5 my-4 w-full">
        <div className="flex items-center gap-5">
          <ProfileImage
            className="sm:w-10 sm:h-10 w-8 h-8"
            image={userImageurl}
            alt={postView?.user?.username}
            title="author profile"
          />
          <div>
            <div className="flex gap-2 items-center w-full">
              <Link
                className="w-full text-nowrap hover:underline underline-offset-4"
                to={`/profile/@${postView?.user?.username
                  ?.split(" ")
                  .slice(0, -1)
                  .join("")}/${postView?.user?.id}`}
              >
                {postView?.user?.username}
              </Link>
              <Follow
                person={postView?.user}
                className="relative px-5 py-2 hover:underline underline-offset-4 border-none text-blue-500"
              />
            </div>
            <FormatedTime
              className="text-black dark:text-white sm:text-xs text-[.7em]"
              date={postView?.createdAt}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap justify-start items-start gap-2">
        <h1 className="text-xl break-words lg:text-4xl w-full font-semibold mb-2">
          {postView?.title}
        </h1>
        <p className="text-sm text-black dark:text-white text-opacity-60 dark:text-opacity-70 lg:text-xl leading-relaxed">
          {postView?.subtitle}
        </p>
      </div>
    </div>
  </header>
));

export default PostHeader;
