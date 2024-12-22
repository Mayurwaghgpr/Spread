import React, { memo } from "react";
import userImageSrc from "../../utils/userImageSrc";

function Comment({ comt }) {
  console.log(comt);
  const commenterImg = userImageSrc(comt?.commenter);
  return (
    <div className=" shadow-md flex p-3 justify-center items-start gap-2">
      <div>
        {" "}
        <img
          className="w-10 h-10 rounded-full"
          src={commenterImg}
          alt={comt?.commenter?.username}
        />
      </div>

      <article className="p-2 flex flex-col gap-2">
        <div>
          <h1>{comt?.commenter?.username}</h1>
        </div>
        <div>
          <p>
            {comt.content} Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Fugiat, voluptas libero! Ipsam aperiam sed, modi repudiandae
            quasi exercitationem, ut totam provident itaque libero accusantium
            doloribus corrupti perspiciatis, praesentium fugit suscipit!
          </p>
        </div>
      </article>
    </div>
  );
}

export default memo(Comment);
