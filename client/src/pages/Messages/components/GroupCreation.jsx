import React, { useEffect, useState } from "react";
import CommonInput from "../../../component/inputComponents/CommonInput.jsx";
import { BsBack, BsCamera } from "react-icons/bs";
import SelectedGroupMemberList from "./SelectedGroupMemberList.jsx";
import Ibutton from "../../../component/buttons/Ibutton.jsx";
import { useMutation } from "react-query";
import ChatApi from "../../../Apis/ChatApi.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../redux/slices/uiSlice.js";
import {
  selectConversation,
  setOpenNewConverstionBox,
} from "../../../redux/slices/messangerSlice.js";
import { useNavigate } from "react-router-dom";
import useIcons from "../../../hooks/useIcons.jsx";
function GroupCreation({ handleGroupConfig, hashMap, users }) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const icons = useIcons();
  const [groupConfig, setGroupConfig] = useState({
    groupName: "",
    membersArr: [],
  });
  const { createGroup } = ChatApi();
  const { mutate } = useMutation(
    ["GroupCreation"],
    () => createGroup(groupConfig),
    {
      onSuccess: (data) => {
        sessionStorage.setItem(
          "conversationMeta",
          JSON.stringify(data.newGroupConversation)
        );
        // console.log(first);
        dispatch(selectConversation(data.newGroupConversation));
        navigate(`c?Id=${data.newGroupConversation.id}`, { replace: true });
        dispatch(setToast({ message: data.message, type: "success" }));
      },
      onError: (error) => {
        dispatch(setToast({ message: error.data.message, type: "error" }));
      },
      onSettled: () => {
        dispatch(setOpenNewConverstionBox());
      },
    }
  );
  useEffect(() => {
    const usersObjArry = users
      ?.map((userInMap) => hashMap[userInMap.id])
      .filter((userObj) => userObj); // Adding user in membersArr whose id present in hashMap as key and data value e.g('5dss5a5-ds:{userId:'dasdsa'}')

    setGroupConfig((prev) => ({
      ...prev,
      membersArr: [...usersObjArry, hashMap[user.id]], //Pushing data of the login user who is creating group **/ Its done separatly because 'users' array dose not contain login user/**
    }));
  }, [hashMap, user, users]);
  return (
    <div className="w-full border-inherit">
      <div className="flex justify-start items-center gap-3 text-2xl p-3 w-full  border rounded-lg border-inherit">
        <CommonInput
          labelname={icons["pCamera"]}
          type={"file"}
          Iname="groupInput"
          className={" hidden cursor-pointer"}
        />
        <CommonInput
          onChange={(e) =>
            setGroupConfig((prev) => ({ ...prev, groupName: e.target.value }))
          }
          className={"text-lg font-light w-full"}
          placeholder={"Group name"}
          Iname={"groupName"}
          required
        />
      </div>
      <SelectedGroupMemberList
        users={users}
        hashMap={hashMap}
        handleGroupConfig={handleGroupConfig}
      />
      <Ibutton className={"mx-auto p-1  rounded-full"} action={() => mutate()}>
        Create
      </Ibutton>
    </div>
  );
}

export default GroupCreation;
