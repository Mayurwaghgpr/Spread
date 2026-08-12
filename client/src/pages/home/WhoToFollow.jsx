import Follow from "../../components/buttons/follow";
import { Link } from "react-router-dom";
import ProfileListItemLoadingSkeleton from "../../components/loaders/ProfileListItemLoadingSkeleton";
import SubHeading from "../../components/texts/SubHeading";
import Paragraph from "../../components/texts/Paragraph";
import ProfileImage from "../../components/ProfileImage";
import userImageSrc from "../../utils/functions/userImageSrc";
import Heading from "../../components/texts/Heading";
import ProfileHoverCard from "../../components/utilityComp/ProfileHoverCard";
import usePublicApis from "../../services/publicApis";
import { useQuery } from "@tanstack/react-query";

function WhoToFollow({ className }) {
  const { fetchQuickUserSuggestion } = usePublicApis();

  const { data: userSuggetion, isLoading } = useQuery({
    queryKey: ["user_suggestion"],
    queryFn: fetchQuickUserSuggestion,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-start text-base font-bold text-stone-900 dark:text-stone-100">
        Follow people
      </h2>
      {isLoading ? (
        <ProfileListItemLoadingSkeleton count={5} />
      ) : (
        <ul className="flex flex-col gap-3 py-2 w-full border-inherit">
          {userSuggetion?.map((person) => {
            const { userImageurl } = userImageSrc(person);
            return (
              <li
                key={person?.id}
                className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-stone-200/50 dark:hover:bg-stone-800/40 transition-colors border-inherit"
              >
                {/* Single Combined Profile Hover Wrapper */}
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-2 border-inherit">
                  <ProfileHoverCard person={person} className="w-full">
                    <div className="flex items-start gap-3 w-full">
                      {/* Profile Image */}
                      <Link
                        className="cursor-pointer shrink-0"
                        to={`/profile/@${person?.username}/${person?.id}`}
                      >
                        <ProfileImage
                          className="w-9 h-9 rounded-full shrink-0 ring-1 ring-stone-300 dark:ring-stone-700 transition-all duration-200 hover:ring-stone-500"
                          image={person && userImageurl}
                        />
                      </Link>

                      {/* Profile Details */}
                      <div className="flex-1 min-w-0 border-inherit">
                        <Link
                          className="cursor-pointer hover:underline block"
                          to={`/profile/@${person?.username}/${person?.id}`}
                        >
                          <Heading className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {person?.displayName || "Unknown User"}
                          </Heading>
                        </Link>

                        {/* Username */}
                        <SubHeading className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          @{person?.username || "username"}
                        </SubHeading>

                        {/* Bio */}
                        {person?.bio && (
                          <Paragraph className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight mt-0.5 line-clamp-1">
                            {person?.bio}
                          </Paragraph>
                        )}
                      </div>
                    </div>
                  </ProfileHoverCard>
                </div>

                {/* Right Section - Follow Button */}
                <div className="shrink-0">
                  <Follow person={person} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        to={"/suggestions/find_peoples"}
        className="spread-pill text-xs font-semibold px-3 py-1 hover:opacity-80 inline-block mt-1"
      >
        See More
      </Link>
    </div>
  );
}

export default WhoToFollow;
