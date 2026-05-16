import { PopupBox } from "../../../components/utilityComp/PopupBox";

export default function CreateNewGroupForm({ action, mutation }) {
  const handleCreateGroup = (e) => {
    e.preventDefault();
    const groupName = e.target[0].value.trim();
    if (groupName) {
      mutation(groupName);
    }
  };
  return (
    <PopupBox
      action={action}
      className=" p-5 w-96 max-w-md flex flex-col gap-4 border-inherit"
    >
      <h1>New Group</h1>
      <form onSubmit={handleCreateGroup} className="border-inherit">
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
