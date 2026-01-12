import { useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import ProfileImage from "../../../components/ProfileImage";
import Ibutton from "../../../components/buttons/Ibutton";
import ToggleCheckbox from "../../../components/inputComponents/ToggleCheckBox";
import useIcons from "../../../hooks/useIcons";
import ChatApi from "../../../services/ChatApi";

import { setToast } from "../../../store/slices/uiSlice";
import { selectConversation } from "../../../store/slices/messangerSlice";

function InfoSection() {
  const dispatch = useDispatch();
  const icons = useIcons();
  const { user } = useSelector((state) => state.auth);
  const { selectedConversation } = useSelector((state) => state.messanger);
  const [isOptMute, setIsOptMute] = useState(false);

  const { setMessageToMute } = ChatApi();

  // Mutation for toggling mute
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

      dispatch(setToast({ message: data.message, type: "success" }));
    },
    onError: () => {
      dispatch(setToast({ message: "Failed to mute messages", type: "error" }));
    },
    onSettled: () => {
      setIsOptMute(false);
    },
  });

  const loggedInMemberInfo = useMemo(
    () => selectedConversation?.members.find((member) => member.id === user.id),
    [selectedConversation?.members, user.id]
  );

  const handleMuteToggle = () => {
    setIsOptMute((prev) => !prev);
    mutate({
      isMuteMessage: loggedInMemberInfo?.Members?.isMuteMessage,
      conversationId: selectedConversation.id,
    });
  };

  // use apposite member image and name to group image and group name for private conversation
  const currentConversationProfileInfo = useMemo(() => {
    if (selectedConversation?.conversationType === "private") {
      const oppositeMember = selectedConversation.members.find(
        (member) => member.id !== user.id
      );
      return {
        ...selectedConversation,
        image: oppositeMember.userImage,
        groupName: oppositeMember.displayName,
      };
    }
    return selectedConversation;
  }, [selectedConversation, user.id]);

  return (
    <section className="p-4 w-full overflow-y-auto h-full">
      <header>
        <h1 className="text-xl font-medium">
          {selectedConversation?.conversationType === "group"
            ? "Group Info"
            : "User Info"}
        </h1>
      </header>

      {/* Profile Section */}
      <div className="flex flex-col justify-center items-center gap-2 w-full p-5">
        <ProfileImage
          className="sm:w-20 sm:h-20 h-10 w-10 border-2 rounded-full"
          image={currentConversationProfileInfo?.image}
        />
        <h2 className="sm:text-base text-sm">
          {currentConversationProfileInfo?.groupName}
        </h2>
        {currentConversationProfileInfo?.conversationType === "group" && (
          <small className="sm:text-sm text-xs opacity-30">
            {currentConversationProfileInfo?.members?.length} members
          </small>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 w-full p-5 text-black">
        {/* Mute Toggle */}
        <div className="flex items-center justify-between border p-2 rounded-lg bg-white gap-2 w-full">
          <span className="inline-flex items-center gap-1">
            {icons["bellO"]} Mute
          </span>
          <ToggleCheckbox
            checked={isOptMute || loggedInMemberInfo?.Members?.isMuteMessage}
            onChange={handleMuteToggle}
          />
        </div>

        {/* Clear Conversation */}
        <div className="flex items-center justify-between border p-2 rounded-lg bg-white gap-2 w-full">
          <Ibutton className="text-red-500">Clear Conversation</Ibutton>
        </div>

        {/* Block Conversation */}
        <div className="flex items-center justify-between border p-2 rounded-lg bg-white gap-2 w-full">
          <Ibutton className="text-red-500">Block This Conversation</Ibutton>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
