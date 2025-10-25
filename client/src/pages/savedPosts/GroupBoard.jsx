import { useQuery } from "react-query";
import usePostsApis from "../../services/usePostsApis";
import useIcons from "../../hooks/useIcons";
import GroupCard from "./components/GroupCard";
import { useSelector } from "react-redux";
import { memo } from "react";

function GroupBoard() {
  const { user } = useSelector((state) => state.auth);
  const { fetchSavedPostsGroup } = usePostsApis();
  const { data } = useQuery({
    queryKey: "SavedPostGroups",
    queryFn: fetchSavedPostsGroup,
  });
  const icons = useIcons();
  return (
    <div className=" flex flex-col justify-start items-start w-full h-full  xl:items-center border-inherit overflow-scroll ">
      <div className=" sticky top-0 flex  justify-end items-center gap-4 w-full z-10  border-inherit  ">
        <div className=" flex justify-start items-center gap-4 w-full h-full p-7 bg-light dark:bg-dark  border-b border-inherit">
          <span className="border rounded-lg p-2 border-inherit">
            {icons["book"]}
          </span>
          <div>
            <h1 className="text-3xl ">Saved </h1>
            <p className="text-sm opacity-50">
              Select group start reading or create one
            </p>
          </div>
        </div>
      </div>
      <div className="p-5 w-full grid grid-cols-4 gap-3">
        <GroupCard
          heading={"All posts"}
          stub={"read/all"}
          count={user?.savedPostsList?.length}
        />

        {data?.groups?.map((group) => (
          <GroupCard
            stub={`read/${group?.groupName}`}
            heading={group?.groupName}
            count={group?.postCount}
          />
        ))}
        <div className="flex justify-center items-center bg-black/5 border rounded-lg ">
          <div className="flex justify-center items-center p-3 rounded-full border-black/40 border-dashed border-2 ">
            {" "}
            {icons["plus"]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(GroupBoard);
