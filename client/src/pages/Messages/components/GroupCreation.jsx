import React from "react";
import CommonInput from "../../../component/utilityComp/CommonInput.jsx";
import { BsBack, BsCamera } from "react-icons/bs";
import SelectedGroupMemberList from "./SelectedGroupMemberList.jsx";
import Ibutton from "../../../component/buttons/Ibutton.jsx";
function GroupCreation({ setNext, handleGroupConfig, hashMap, users }) {
  return (
    <div className="w-full">
      <div className="flex justify-start items-center gap-3 text-2xl p-3 w-full  border rounded-lg">
        <CommonInput
          labelname={<BsCamera />}
          type={"file"}
          Iname="groupInput"
          className={" hidden cursor-pointer"}
        />
        <CommonInput
          className={"text-lg font-light w-full"}
          placeholder={"Group name"}
          Iname={"groupName"}
        />
      </div>
      <SelectedGroupMemberList
        users={users}
        hashMap={hashMap}
        handleGroupConfig={handleGroupConfig}
      />
    </div>
  );
}

export default GroupCreation;
