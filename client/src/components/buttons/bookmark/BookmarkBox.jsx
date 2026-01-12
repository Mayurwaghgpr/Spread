import { useQuery } from "react-query";
import usePostsApis from "../../../services/usePostsApis";

function BookmarkBox({ postId, mutation }) {
  const { fetchSavedPostsGroup } = usePostsApis();

  const { data } = useQuery({
    queryKey: "SavedPostGroups",
    queryFn: fetchSavedPostsGroup,
  });

  return (
    <div className="z-40 group-hover:opacity-100 group-hover:pointer-events-auto opacity-0 pointer-events-none duration-200 transition-all absolute flex flex-col w-48 bg-white shadow-lg border border-gray-200 -left-20 top-5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-700">Save to Group</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col p-2">
        {/* Create new group button */}
        <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 font-medium">
          + Create new group
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-1.5"></div>

        {/* Select group section */}
        <div className="px-3 py-1.5">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Select Group
          </h2>
          {/* Add your group items here */}
          <div className=" flex w-full">
            {data?.groups ? (
              data?.groups?.map((group, idx) => (
                <button
                  key={idx}
                  className={"border rounded-lg h-full text-xs text-black p-1"}
                  onClick={() => {
                    console.log(group?.groupName);
                    mutation({ postId, groupName: group?.groupName });
                  }}
                  //   count={group?.postCount}
                >
                  {group?.groupName}
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-600">No groups yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookmarkBox;
