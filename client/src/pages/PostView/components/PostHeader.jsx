import { Link } from "react-router-dom";
import ProfileImage from "../../../component/ProfileImage";
import Follow from "../../../component/buttons/follow";
import FormatedTime from "../../../component/utilityComp/FormatedTime";
import { memo, useMemo } from "react";

const PostHeader = memo(({ postView, userImageurl }) => {
  const usernameSlug = useMemo(() => {
    const username = postView?.user?.username || "";
    const parts = username.trim().split(" ");
    return parts.length > 1 ? parts.slice(0, -1).join("") : username;
  }, [postView?.user?.username]);

  return (
    <header className=" border-inherit w-full">
      <div className="flex flex-col gap-5 border-inherit w-full">
        <div className="relative flex items-center sm:text-base text-xs justify-between gap-5  w-full">
          <div className="flex justify-center items-start gap-4 ">
            <Link to={`/profile/@${usernameSlug}/${postView?.user?.id}`}>
              <ProfileImage
                className="sm:w-10 sm:h-10 w-8 h-8"
                image={userImageurl}
                alt={postView?.user?.username}
                title="author profile"
              />
            </Link>
            <div className="flex sm:items-start items-center  sm:flex-col sm:text-nowrap w-full  gap-1 dark:text-slate-400">
              {postView?.user && (
                <div className="flex items-center justify-center gap-2">
                  <Link
                    to={`/profile/@${usernameSlug}/${postView?.user?.id}`}
                    className="truncate font-medium  w-16 sm:w-fit  hover:underline underline-offset-4"
                  >
                    {postView?.user?.displayName || "Unknown User"}
                  </Link>
                  {postView?.user?.username && (
                    <Link
                      to={`/profile/@${usernameSlug}/${postView?.user?.id}`}
                      className="truncate w-16 sm:w-fit text-sm opacity-50"
                    >
                      @{postView?.user?.username}
                    </Link>
                  )}
                </div>
              )}
              <FormatedTime
                className="text-xs text-nowrap "
                date={postView?.createdAt}
                formate="MMM-yy"
              />
            </div>
          </div>

          <div className="flex sm:hidden  items-center justify-between gap-2 w-full">
            <Follow
              person={postView?.user}
              className="relative px-5 py-2 hover:underline underline-offset-4 border-none text-blue-500"
            />
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-start items-start gap-2">
          <h1 className="text-xl break-words lg:text-4xl w-full font-semibold ">
            {postView?.title}
          </h1>
          <p className="text-sm text-black dark:text-white text-opacity-60 dark:text-opacity-70 lg:text-xl leading-relaxed">
            {postView?.subtitle}
          </p>
        </div>
      </div>
    </header>
  );
});

export default PostHeader;
