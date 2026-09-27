import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import ProfileImage from "../../../components/ProfileImage";
import ToggleCheckbox from "../../../components/inputComponents/ToggleCheckBox";
import ChatApi from "../../../services/ChatApi";

import { setToast } from "../../../store/slices/uiSlice";
import { selectConversation } from "../../../store/slices/messangerSlice";
import useIcons from "../../../hooks/useIcons";
import EncryptionSecurityModal from "./EncryptionSecurityModal";

function InfoSection() {
  const icons = useIcons();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedConversation } = useSelector((state) => state.messanger);
  const [isOptMute, setIsOptMute] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const { setMessageToMute } = ChatApi();

  const { mutate } = useMutation({
    mutationFn: (config) => setMessageToMute(config),
    onSuccess: (data) => {
      const updatedConversation = {
        ...selectedConversation,
        members: selectedConversation.members.map((member) =>
          member.id === data.updatedMember.memberId
            ? {
                ...member,
                Members: {
                  ...member.Members,
                  isMuteMessage: data.updatedMember.isMuteMessage,
                },
              }
            : member
        ),
      };

      dispatch(selectConversation(updatedConversation));
      sessionStorage.setItem(
        "conversationMeta",
        JSON.stringify(updatedConversation)
      );

      dispatch(setToast({ message: data.message || "Notification settings updated", type: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to update mute settings";
      dispatch(setToast({ message: msg, type: "error" }));
    },
    onSettled: () => {
      setIsOptMute(false);
    },
  });

  const loggedInMemberInfo = useMemo(
    () => selectedConversation?.members?.find((member) => member.id === user?.id),
    [selectedConversation?.members, user?.id]
  );

  const handleMuteToggle = () => {
    setIsOptMute((prev) => !prev);
    mutate({
      isMuteMessage: loggedInMemberInfo?.Members?.isMuteMessage,
      conversationId: selectedConversation?.id,
    });
  };

  const currentConversationProfileInfo = useMemo(() => {
    if (selectedConversation?.conversationType === "private") {
      const oppositeMember = selectedConversation.members?.find(
        (member) => member.id !== user?.id
      );
      return {
        ...selectedConversation,
        image: oppositeMember?.userImage || "",
        groupName: oppositeMember?.displayName || oppositeMember?.username || "User Info",
      };
    }
    return selectedConversation;
  }, [selectedConversation, user?.id]);

  const isGroup = selectedConversation?.conversationType === "group";

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      {/* Profile Overview Card */}
      <div className="flex flex-col items-center text-center p-6 spread-card rounded-3xl border border-stone-200 dark:border-stone-800 w-full space-y-3 shadow-sm">
        <div className="relative">
          <ProfileImage
            className="w-20 h-20 rounded-full ring-2 ring-stone-300 dark:ring-stone-700 shadow-md"
            image={currentConversationProfileInfo?.image}
            alt={currentConversationProfileInfo?.groupName}
          />
          {isGroup && (
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm text-xs">
              {icons.users}
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {currentConversationProfileInfo?.groupName}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
            {isGroup
              ? `${selectedConversation?.members?.length || 0} members`
              : "Direct Message"}
          </p>
        </div>
      </div>

      {/* Settings & Controls */}
      <div className="w-full space-y-2.5">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
          Chat Settings
        </h3>

        {/* End-to-End Encryption Card */}
        <div
          onClick={() => setShowSecurityModal(true)}
          className="flex items-center justify-between p-3 rounded-2xl spread-card border border-stone-200 dark:border-stone-800 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setShowSecurityModal(true)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform text-lg">
              {icons.shieldCheck}
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>End-to-End Encryption</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                Messages are encrypted on your device. Tap to learn more.
              </span>
            </div>
          </div>

          <div className="text-stone-400 dark:text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm pr-1">
            {icons.arrowUpRight}
          </div>
        </div>

        {/* Mute Notifications Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl spread-card border border-stone-200 dark:border-stone-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-base">
              {icons.bellO}
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                Mute Notifications
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Pause alerts for new messages in this chat
              </span>
            </div>
          </div>

          <ToggleCheckbox
            checked={isOptMute || loggedInMemberInfo?.Members?.isMuteMessage}
            onChange={handleMuteToggle}
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            className="flex items-center gap-3 p-3 rounded-2xl spread-card border border-stone-200 dark:border-stone-800 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold w-full text-left cursor-pointer"
          >
            <span className="text-base">{icons.trash}</span>
            <span>Clear Chat History</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-3 p-3 rounded-2xl spread-card border border-stone-200 dark:border-stone-800 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold w-full text-left cursor-pointer"
          >
            <span className="text-base">{icons.ban}</span>
            <span>Block Conversation</span>
          </button>
        </div>
      </div>

      <EncryptionSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
    </div>
  );
}

export default InfoSection;
