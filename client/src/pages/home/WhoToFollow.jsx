import Follow from "../../component/buttons/follow";
import { Link, useNavigate } from "react-router-dom";
import ProfileListItemLoadingSkeleton from "../../component/loaders/ProfileListItemLoadingSkeleton";
import SubHeading from "../../component/texts/SubHeading";
import Paragraph from "../../component/texts/Paragraph";
import ProfileImage from "../../component/ProfileImage";
import userImageSrc from "../../utils/userImageSrc";
import Heading from "../../component/texts/Heading";
import UserPopover from "../../component/utilityComp/UserPopover";
import { useSelector } from "react-redux";
function WhoToFollow({ className }) {
  const navigate = useNavigate();
  const { userSuggestions, isLoadingHome } = useSelector(
    (state) => state.common
  );
  return (
    <div className={className}>
      <h1 className=" text-start  text-xl font-medium"> Follow people </h1>
      {isLoadingHome ? (
        <ProfileListItemLoadingSkeleton count={5} />
      ) : (
        <ul className="flex flex-wrap gap-5 py-3 w-full">
          {userSuggestions?.map((person, idx, arr) => {
            const { userImageurl } = userImageSrc(person);
            return (
              <li
                key={person?.id}
                className="flex items-center justify-between w-full bg-light dark:bg-dark"
              >
                {/* Left Section - Profile Info */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
                  {/* Profile Image */}
                  <Link className=" cursor-pointer " to={person.profileLink}>
                    <ProfileImage
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700 transition-all duration-200 hover:ring-gray-300 dark:hover:ring-gray-600"
                      image={person && userImageurl}
                    />
                  </Link>
                  {/* Profile Details */}
                  <div className="flex-1 min-w-0 space-y-1 sm:space-y-2 w-full">
                    <div className=" relative group flex items-center justify-between w-full">
                      <Link
                        className=" cursor-pointer  hover:underline"
                        to={`/profile/@${person?.username}/${person?.id}`}
                      >
                        {/* Display Name */}
                        <Heading className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {person?.displayName || "Unknown User"}
                        </Heading>
                      </Link>
                      {/* <UserPopover
                        // ref={}
                        className="absolute z-50 left-0 right-0 bottom-10 min-w-fit p-3 text-nowrap bg-light dark:bg-dark opacity-0 pointer-events-none group-hover:pointer-events-auto  transition-all duration-300 delay-500 group-hover:opacity-100 text-red-600"
                        person={person}
                      /> */}
                    </div>
                    {/* Username */}
                    <SubHeading className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      @{person?.username || "username"}
                    </SubHeading>

                    {/* Bio */}
                    <Paragraph className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
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
        className="w-full text-blue-500 self-center p-1 transition-all ease-in-out duration-300"
      >
        See More
      </Link>
    </div>
  );
}

export default WhoToFollow;
