import React, { useMemo, useState } from "react";
import ProfileImage from "../../../component/ProfileImage";
import Ibutton from "../../../component/buttons/Ibutton";
import useIcons from "../../../hooks/useIcons";
import { useOutletContext } from "react-router-dom";
import ToggleCheckbox from "../../../component/inputComponents/ToggleCheckBox";
import { useMutation } from "react-query";
import ChatApi from "../../../Apis/ChatApi";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../redux/slices/uiSlice";

function InfoSection() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const [isMute, setIsMute] = useState(false);
  const icons = useIcons();
  const dispatch = useDispatch();
  const { isGroup, conversationData } = useOutletContext();
  const { setMessageToMute } = ChatApi();
  const currentUser = useMemo(() => {
    const userInfo = conversationData?.members?.find(
      (member) => member.id === user.id
    );
    setIsMute(userInfo?.Members?.isMuteMessage);
    return userInfo;
  }, [conversationData?.members, user?.id]);

  const { mutate } = useMutation({
    mutationFn: (config) => setMessageToMute(config),
    onSuccess: (data) => {
      setIsMute(data.updatedMember.isMuteMessage);
      dispatch(setToast({ message: data.message, type: "success" }));
    },
    onError: () => {
      dispatch(setToast({ messge: "Fail to mute messages", type: "error" }));
    },
  });

  return (
    <section className="p-4 w-full overflow-y-auto h-full">
      <header>
        <h1 className="text-xl font-medium">
          {isGroup ? "Group Info" : "User Info"}
        </h1>
      </header>
      <div className="flex flex-col justify-center items-center gap-2 w-full p-5 ">
        <ProfileImage
          className={"w-20 h-20 border-2 rounded-full"}
          image={conversationData?.image}
        ></ProfileImage>
        <h2>{conversationData?.groupName}</h2>
        <small className=" opacity-30">
          {conversationData?.members?.length} ⁠members{" "}
        </small>
      </div>
      <div className="  w-full p-5 ">
        <div className="flex gap-3">
          <Ibutton className={"flex justify-start  p-2 rounded-lg"}>
            {icons["bell"]} Mute
            <ToggleCheckbox
              checked={isMute}
              onChange={() =>
                mutate({
                  isMuteMessage: isMute,
                  conversationId: conversationData.id,
                })
              }
            />
          </Ibutton>
          {/* <Ibutton className={"flex justify-start p-2 rounded-lg"}>
            {icons["duration"]} temporary message
          </Ibutton> */}
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
