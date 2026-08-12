import { useState } from "react";
import { PopupBox } from "../../../components/utilityComp/PopupBox";
import CommenAuthBtn from "../../auth/components/CommenAuthBtn";
import { FolderPlus } from "lucide-react";

export default function CreateNewGroupForm({ action, mutation }) {
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const cleanName = groupName.trim();
    if (cleanName) {
      mutation(cleanName);
    }
  };

  return (
    <PopupBox
      action={action}
      className="p-6 w-96 max-w-md flex flex-col gap-5 spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100">
          <FolderPlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Create Bookmark Group
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Organize your saved posts into custom folders
          </p>
        </div>
      </div>

      <form onSubmit={handleCreateGroup} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Group Name
          </label>
          <input
            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-light dark:bg-dark border border-stone-300 dark:border-stone-700 rounded-xl outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all text-stone-900 dark:text-stone-100"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Reading List, Tech, Design"
            autoFocus
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={action}
            className="spread-btn-secondary text-xs px-4 py-2 font-semibold"
          >
            Cancel
          </button>
          <CommenAuthBtn
            type="submit"
            className="spread-btn-primary text-xs px-5 py-2 font-bold shadow-md"
            disabled={!groupName.trim()}
          >
            Create & Save
          </CommenAuthBtn>
        </div>
      </form>
    </PopupBox>
  );
}
