import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import Menu from "../../../components/menus/Menu";
import useClickOutside from "../../../hooks/useClickOutside";
import { useMutation } from "@tanstack/react-query";
import usePostsApis from "../../../services/usePostsApis";
import { useQueryClient } from "@tanstack/react-query";
import { setToast } from "../../../store/slices/uiSlice";
import { useDispatch } from "react-redux";

function GroupCard({
  onClick,
  heading,
  stub,
  className,
  count,
  imageArry,
  groupId,
}) {
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { menuId, setMenuId } = useClickOutside(menuRef);
  const { deleteSavedPostGroup } = usePostsApis();
  const queryClient = useQueryClient();
  const { mutate: deleteGroupMutate } = useMutation({
    mutationFn: deleteSavedPostGroup,
    onSuccess: () => {
      queryClient.invalidateQueries("SavedPostGroups");
      dispatch(
        setToast({ type: "success", message: "Group deleted successfully" }),
      );
      setMenuId(null);
    },
    onError: (error) => {
      console.error("Error deleting group:", error);
    },
  });

  return (
    <div
      className={` border rounded-xl space-y-3 ${className} border-inherit  `}
    >
      {" "}
      <div className="flex  justify-between items-center gap-4">
        <div className="flex  items-center gap-2">
          <h1 className=" sm:text-lg text-sm">{heading}</h1>
          <span className="opacity-50 text-sm">{count && count}</span>
        </div>
        <div>
          <Menu
            className={"text-sm"}
            ref={menuRef}
            content={{ id: groupId }}
            items={[
              {
                id: "delete",
                icon: "delete",
                action: () => deleteGroupMutate(groupId),
                itemName: "Delete Group",
              },
            ]}
            menuId={menuId}
            setMenuId={setMenuId}
          />
        </div>
      </div>
      <Link
        to={stub}
        onClick={onClick}
        className=" grid grid-cols-2 gap-2 h-full "
      >
        {/* {imageArry?.map((data) => (
          <div className=" relative rounded-lg overflow-hidden ">
            <img
              src={data.post.previewImage}
              alt=""
              className=" object-fill object-center w-full h-full "
            />
          </div>
        ))} */}
      </Link>
    </div>
  );
}

export default memo(GroupCard);
