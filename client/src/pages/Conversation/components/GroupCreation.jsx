import { useEffect, useState } from "react";
import CommonInput from "../../../components/inputComponents/CommonInput.jsx";
import SelectedGroupMemberList from "./SelectedGroupMemberList.jsx";
import { useMutation } from "@tanstack/react-query";
import ChatApi from "../../../services/ChatApi.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../store/slices/uiSlice.js";
import { selectConversation } from "../../../store/slices/messangerSlice.js";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import Spinner from "../../../components/loaders/Spinner.jsx";

function GroupCreation({ handleGroupConfig, hashMap, users, selectedMembers }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [groupConfig, setGroupConfig] = useState({
    groupName: "",
    membersArr: [],
  });
  const { createGroup } = ChatApi();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => createGroup(groupConfig),
    onSuccess: (data) => {
      sessionStorage.setItem(
        "conversationMeta",
        JSON.stringify(data.newGroupConversation)
      );
      dispatch(selectConversation(data.newGroupConversation));
      navigate(`/messages/c?Id=${data.newGroupConversation.id}`, { replace: true });
      dispatch(setToast({ message: data.message || "Group created ✨", type: "success" }));
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create group";
      dispatch(setToast({ message: errorMessage, type: "error" }));
    },
  });

  useEffect(() => {
    const memberIds = selectedMembers ? Object.keys(selectedMembers) : [];
    const membersArr = memberIds.map((id) => ({
      memberId: id,
      memberType: id === user.id ? "admin" : "member",
    }));

    setGroupConfig((prev) => ({
      ...prev,
      membersArr,
    }));
  }, [selectedMembers, user.id]);

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center gap-3 p-3 rounded-2xl spread-card border border-stone-200 dark:border-stone-800">
        <div className="p-2.5 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100">
          <Camera className="w-5 h-5" />
        </div>
        <CommonInput
          onChange={(e) =>
            setGroupConfig((prev) => ({ ...prev, groupName: e.target.value }))
          }
          className="text-sm font-semibold w-full bg-transparent outline-none border-none placeholder:text-stone-400 text-stone-900 dark:text-stone-100"
          placeholder="Enter group name..."
          Iname="groupName"
          required
        />
      </div>

      <SelectedGroupMemberList
        users={users}
        hashMap={hashMap}
        handleGroupConfig={handleGroupConfig}
        selectedMembers={selectedMembers}
      />

      <div className="flex justify-center pt-2">
        <button
          type="button"
          disabled={isLoading || !groupConfig.groupName.trim()}
          onClick={() => mutate()}
          className={`spread-btn-primary px-6 py-2.5 text-xs font-bold rounded-full shadow-md transition-all ${
            isLoading || !groupConfig.groupName.trim()
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105 cursor-pointer"
          }`}
        >
          {isLoading ? <Spinner className="w-4 h-4 text-stone-900 dark:text-stone-100" /> : "Create Group ✨"}
        </button>
      </div>
    </div>
  );
}

export default GroupCreation;
