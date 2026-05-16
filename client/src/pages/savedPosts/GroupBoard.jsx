import { useMutation, useQuery } from "react-query";
import usePostsApis from "../../services/usePostsApis";
import useIcons from "../../hooks/useIcons";
import GroupCard from "./components/GroupCard";
import { useDispatch, useSelector } from "react-redux";
import { memo, useState } from "react";
import CreateNewGroupForm from "./components/CreateNewGroupForm";
import { setToast } from "../../store/slices/uiSlice";

function GroupBoard() {
  const { user } = useSelector((state) => state.auth);
  const [isCreateGroupFormOpen, setIsCreateGroupFormOpen] = useState(false);
  const dispatch = useDispatch();

  const icons = useIcons();
  const { fetchSavedPostsGroup } = usePostsApis();
  const { createNewGroup } = usePostsApis();

  const { data } = useQuery({
    queryKey: "SavedPostGroups",
    queryFn: fetchSavedPostsGroup,
  });

  const { mutate } = useMutation({
    mutationFn: createNewGroup,
    onSuccess: () => {
      dispatch(
        setToast({ type: "success", message: "Group created successfully" }),
      );
    },
    onError: () => {
      dispatch(setToast({ type: "error", message: "Failed to create group" }));
    },
    onSettled: () => {
      setIsCreateGroupFormOpen(false);
    },
  });
  return (
    <div className="flex flex-col justify-start items-center w-full h-full  xl:items-center border-inherit overflow-scroll ">
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
      <button className="p-5 w-full grid sm:grid-cols-4 grid-cols-2 gap-3 border-inherit">
        <GroupCard
          className={" min-h-[10rem]  p-5 text-xl"}
          heading={"All posts"}
          stub={"read/all"}
          count={user?.savedPostsList?.length}
        />

        {data?.groups?.map((group) => (
          <GroupCard
            className={" min-h-[10rem]  p-5 text-xl"}
            stub={`read/${group?.id}`}
            groupId={group?.id}
            heading={group?.groupName}
            count={group?.postCount}
          />
        ))}
        <button
          onClick={() => setIsCreateGroupFormOpen(true)}
          className="flex justify-center items-center bg-black/5 dark:bg-white/10 border border-inherit rounded-lg  min-h-[10rem]"
        >
          <span className="flex justify-center items-center p-3 rounded-full border-black/40 dark:border-white/50 border-dashed border-2 ">
            {" "}
            {icons["plus"]}
          </span>
        </button>
      </button>
      {isCreateGroupFormOpen && (
        <CreateNewGroupForm
          action={() => setIsCreateGroupFormOpen(false)}
          mutation={mutate}
        />
      )}
    </div>
  );
}

export default memo(GroupBoard);
