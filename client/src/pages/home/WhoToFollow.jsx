import Follow from "../../component/buttons/follow";
import { Link } from "react-router-dom";
import ProfileListItemLoadingSkeleton from "../../component/loaders/ProfileListItemLoadingSkeleton";
import SubHeading from "../../component/texts/SubHeading";
import Paragraph from "../../component/texts/Paragraph";
import ProfileImage from "../../component/ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import Heading from "../../component/texts/Heading";
import { useSelector } from "react-redux";
import UserPopover from "../../component/utilityComp/UserPopover";
function WhoToFollow({ className }) {
  const { userSuggestions, isLoadingHome } = useSelector(
    (state) => state.common
  );
  return (
    <div className={className}>
      <h1 className=" text-start text-lg font-medium"> Follow people </h1>
      {userSuggestions === 0 && isLoadingHome ? (
        <ProfileListItemLoadingSkeleton count={5} />
      ) : (
        <ul className="flex flex-wrap gap-5 py-3 w-full  border-inherit">
          {userSuggestions?.map((person, idx, arr) => {
            const { userImageurl } = userImageSrc(person);
            return (
              <li
                key={person?.id}
                className="flex items-center justify-between w-full bg-light dark:bg-dark  border-inherit"
              >
                {/* Left Section - Profile Info */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 pr-4 border-inherit">
                  {/* Profile Image */}
                  <Link
                    className=" cursor-pointer "
                    to={`/profile/@${person?.username}/${person?.id}`}
                  >
                    <ProfileImage
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700 transition-all duration-200 hover:ring-gray-300 dark:hover:ring-gray-600"
                      image={person && userImageurl}
                    />
                  </Link>
                  {/* Profile Details */}
                  <div className="flex-1 min-w-0 w-full border-inherit">
                    <div className=" relative group flex items-center justify-between w-full border-inherit">
                      <Link
                        className=" cursor-pointer  hover:underline"
                        to={`/profile/@${person?.username}/${person?.id}`}
                      >
                        {/* Display Name */}
                        <Heading className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {person?.displayName || "Unknown User"}
                        </Heading>
                      </Link>
                      <UserPopover
                        className="absolute z-10 bottom-8 left-0 right-10  min-w-fit p-3 text-nowrap bg-light dark:bg-dark opacity-0 pointer-events-none group-hover:pointer-events-auto  transition-all duration-300 delay-500 group-hover:opacity-100"
                        person={person}
                      />
                    </div>
                    {/* Username */}
                    <SubHeading className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      @{person?.username || "username"}
                    </SubHeading>

                    {/* Bio */}
                    <Paragraph className=" sm:text-xs text-xs/4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="line-clamp-1 sm:line-clamp-2">
                        {person?.bio}
                      </span>
                    </Paragraph>
                  </div>
                </div>

                {/* Right Section - Follow Button */}
                <div className="flex-shrink-0">
                  <Follow
                    className="inline-flex items-center justify-center px-4 py-2  min-w-[80px] sm:min-w-[100px]"
                    person={person}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        to={"/suggestions/find_peoples"}
        className="w-full text-xs  text-blue-500  p-1 transition-all ease-in-out duration-300"
      >
        See More
      </Link>
    </div>
  );
}

export default WhoToFollow;
