import { PopupBox } from "../../../components/utilityComp/PopupBox";

export default function CreateNewGroupForm({ action }) {
  return (
    <PopupBox
      action={action}
      className=" p-5 w-96 max-w-md flex flex-col gap-4"
    >
      <h1>New Group</h1>
      <input
        className="w-full p-2 outline-none border border-inherit rounded-lg bg-light dark:bg-dark"
        type="text"
        placeholder="group name"
      />
    </PopupBox>
  );
}
