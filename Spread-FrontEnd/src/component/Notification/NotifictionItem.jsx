import React from "react";
import FormatedTime from "../UtilityComp/FormatedTime";
import { AiFillLike } from "react-icons/ai";
import { HiHeart } from "react-icons/hi2";
import useIcons from "../../hooks/useIcons";

function NotifictionItem({ className, data }) {
  const icons = useIcons();
  return (
    <div className={`${className} flex justify-center items-center  gap-5`}>
      <div className="flex justify-center items-center border rounded-lg p-5 shadow-inner ">
        {icons[data.type]}
      </div>
      <div className=" flex flex-col justify-center items-start gap-2">
        {data.image && (
          <div className=" block w-6 h-6 rounded-full overflow-hidden ">
            {" "}
            <img
              className="object-cover object-center"
              src={data.image}
              alt={data?.name}
            />
          </div>
        )}
        <p className="text-sm">{data.message}</p>
        <FormatedTime className={"text-xs"} date={data.timestamp} />
      </div>
    </div>
  );
}

export default NotifictionItem;
