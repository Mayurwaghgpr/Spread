import React, { useMemo, useState } from "react";
import ProfileImage from "../../../component/ProfileImage";
import Ibutton from "../../../component/buttons/Ibutton";
import useIcons from "../../../hooks/useIcons";
import { useOutletContext } from "react-router-dom";
import ToggleCheckbox from "../../../component/inputComponents/ToggleCheckBox";
import { useMutation } from "react-query";
import ChatApi from "../../../services/ChatApi";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../store/slices/uiSlice";
import { selectConversation } from "../../../store/slices/messangerSlice";

function InfoSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const [isOptMute, setIsOptMute] = useState(false);
  const icons = useIcons();
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.messanger);

  const { setMessageToMute } = ChatApi();

  const { mutate } = useMutation({
    mutationFn: (config) => setMessageToMute(config),
    onSuccess: (data) => {
      const updatedConversetion = {
        ...selectedConversation,
        members: selectedConversation.members.map((member) =>
          member.id == data.updatedMember.memberId
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
      dispatch(selectConversation(updatedConversetion));
      sessionStorage.setItem(
        "conversationMeta",
        JSON.stringify(updatedConversetion)
      );
      dispatch(setToast({ message: data.message, type: "success" }));
    },
    onError: () => {
      dispatch(setToast({ messge: "Fail to mute messages", type: "error" }));
    },
    onSettled: () => {
      setIsOptMute(false);
    },
  });

  const conversationInfo = useMemo(
    () => selectedConversation?.members.find((member) => member.id === user.id),
    [selectedConversation?.members]
  );

  console.log({ selectedConversation });
  const handleMuteToggleMutation = () => {
    setIsOptMute((prev) => !prev);
    mutate({
      isMuteMessage: conversationInfo?.Members?.isMuteMessage,
      conversationId: selectedConversation.id,
    });
  };

  return (
    <section className="p-4 w-full overflow-y-auto h-full">
      <header>
        <h1 className="text-xl font-medium">
          {selectedConversation.conversationType == "group"
            ? "Group Info"
            : "User Info"}
        </h1>
      </header>
      <div className="flex flex-col justify-center items-center gap-2 w-full p-5 ">
        <ProfileImage
          className={"sm:w-20 sm:h-20 h-10 w-10 border-2 rounded-full"}
          image={selectedConversation.image || conversationInfo.userImage}
        ></ProfileImage>
        <h2 className="sm:text-base text-sm">
          {selectedConversation?.groupName || conversationInfo.username}
        </h2>
        {selectedConversation.conversationType === "group" && (
          <small className="sm:text-sm text-xs opacity-30">
            {selectedConversation?.members?.length} members ⁠
          </small>
        )}
      </div>
      <div className=" space-y-1 w-full p-5 text-black ">
        <div className="flex items-center justify-between border p-2 rounded-lg bg-white gap-2 w-full">
          <span className=" inline-flex items-center justify-start gap-1">
            {" "}
            {icons["bellO"]} Mute
          </span>
          <ToggleCheckbox
            checked={isOptMute || conversationInfo?.Members?.isMuteMessage}
            onChange={handleMuteToggleMutation}
          />
        </div>
        <div className="flex items-center justify-between border p-2 rounded-lg bg-white gap-2 w-full">
          <Ibutton className={"text-red-500 "}>clear conversation</Ibutton>
          {/* <Ibutton className={"text-red-500 "}></Ibutton> */}
        </div>
        <div className="flex items-center justify-between border p-2 rounded-lg bg-white gap-2 w-full">
          <Ibutton className={"text-red-500 "}>Block this conversation</Ibutton>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
