import { PopupBox } from "../../../components/utilityComp/PopupBox";
import { useMutation } from "react-query";
import usePostsApis from "../../../services/usePostsApis";
import { useDispatch } from "react-redux";
import { setToast } from "../../../store/slices/uiSlice";

export default function CreateNewGroupForm({ action }) {
  const dispatch = useDispatch();
  const { createNewGroup } = usePostsApis();
  const { mutate } = useMutation({
    mutationFn: createNewGroup,
    onSuccess: () => {
      dispatch(
        setToast({ type: "success", message: "Group created successfully" })
      );
    },
    onError: () => {
      dispatch(setToast({ type: "error", message: "Failed to create group" }));
    },
    onSettled: () => {
      action();
    },
  });
  const handleCreateGroup = (e) => {
    e.preventDefault();
    const groupName = e.target[0].value.trim();
    if (groupName) {
      mutate(groupName);
    }
  };
  return (
    <PopupBox
      action={action}
      className=" p-5 w-96 max-w-md flex flex-col gap-4"
    >
      <h1>New Group</h1>
      <form onSubmit={handleCreateGroup}>
        <input
          className="w-full p-2 outline-none border border-inherit rounded-lg bg-light dark:bg-dark"
          type="text"
          placeholder="group name"
        />
        <button type="submit" className="mt-4 w-full  rounded-lg">
          done
        </button>
      </form>
    </PopupBox>
  );
}
