import React from "react";
import FormatedTime from "../utilityComp/FormatedTime";
import useIcons from "../../hooks/useIcons";
import ProfileImage from "../ProfileImage";

function NotifictionItem({ className, data }) {
  const icons = useIcons();
  return (
    <div
      className={`${className} flex justify-center items-center  gap-5 border-inherit`}
    >
      <div className="flex justify-center items-center border rounded-lg p-5 shadow-inner border-inherit ">
        {icons[data.type]}
      </div>
      <div className=" flex flex-col justify-center items-start gap-2 border-inherit">
        {data.image && (
          <ProfileImage
            className=" block w-6 h-6 rounded-full overflow-hidden border-inherit "
            image={data?.image}
            alt={data?.name}
          />
        )}
        <p className="text-sm">{data.message}</p>
        <FormatedTime className={"text-xs"} date={data.timestamp} />
      </div>
    </div>
  );
}

export default NotifictionItem;
