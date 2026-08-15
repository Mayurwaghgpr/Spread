import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usePostsApis from "../../../services/usePostsApis";
import CreateNewGroupForm from "../../../pages/savedPosts/components/CreateNewGroupForm";
import { useState } from "react";
import { setToast } from "../../../store/slices/uiSlice";
import { useDispatch } from "react-redux";
import useIcons from "../../../hooks/useIcons";
import Spinner from "../../loaders/Spinner";

function BookmarkBox({ postId, isOpen, onMouseEnter, onMouseLeave, mutation }) {
  const icons = useIcons();
  const [isCreateGroupFormOpen, setIsCreateGroupFormOpen] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { addSavedPostToGroup, fetchSavedPostsGroup } = usePostsApis();

  const { data, isLoading } = useQuery({
    queryKey: ["SavedPostGroups"],
    queryFn: fetchSavedPostsGroup,
  });

  const { mutate: mutateWithNewGroup } = useMutation({
    mutationFn: (groupName) => addSavedPostToGroup({ postId, groupName }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["loggedInUser"]);
      queryClient.invalidateQueries(["SavedPostGroups"]);
      dispatch(setToast({ message: `${data?.message || "Saved to folder"} ✨`, type: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to update bookmark group";
      dispatch(
        setToast({
          message: msg,
          type: "error",
        })
      );
    },
    onSettled: () => {
      setIsCreateGroupFormOpen(false);
    },
  });

  return (
    <>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`absolute top-full right-0 mt-2 w-56 spread-card rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl z-50 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-1"
        }`}
      >
        {/* Header */}
        <div className="px-3.5 py-2.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/50 dark:bg-stone-800/30">
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="text-stone-700 dark:text-stone-300 text-xs">{icons.bookmarkO}</span>
            Save to Folder
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col p-2 space-y-2">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-xl transition-colors font-medium text-left cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateGroupFormOpen(true);
            }}
          >
            <span className="text-stone-500 text-xs">{icons.plus}</span>
            <span>Create new folder</span>
          </button>

          <hr className="border-stone-200 dark:border-stone-800 my-0.5" />

          <div className="px-1 space-y-1.5">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
              Your Folders
            </span>

            {isLoading ? (
              <div className="flex items-center justify-center p-3">
                <Spinner className="w-4 h-4 text-stone-500" />
              </div>
            ) : data?.groups && data.groups.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {data.groups.map((group, idx) => (
                  <button
                    key={group?.groupName || idx}
                    type="button"
                    className="spread-pill text-[11px] font-semibold px-2.5 py-1 text-stone-800 dark:text-stone-200 hover:scale-105 transition-transform cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      mutation({ postId, groupName: group?.groupName });
                    }}
                  >
                    #{group?.groupName}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-stone-500 italic px-1 py-1">
                No folders created yet
              </div>
            )}
          </div>
        </div>
      </div>

      {isCreateGroupFormOpen && (
        <CreateNewGroupForm
          action={() => setIsCreateGroupFormOpen(false)}
          mutation={mutateWithNewGroup}
        />
      )}
    </>
  );
}

export default BookmarkBox;
