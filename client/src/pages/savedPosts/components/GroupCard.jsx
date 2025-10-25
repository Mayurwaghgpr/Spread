import { memo } from "react";
import { Link } from "react-router-dom";

function GroupCard({ heading, stub, className, count, imageArry }) {
  return (
    <Link
      to={stub}
      className={`container p-5 border rounded-xl space-y-3 ${className} min-h-[10rem] `}
    >
      {" "}
      <div className="flex justify-between items-center">
        <h1 className="text-xl">{heading}</h1>
        <span>{count}</span>
      </div>
      {/* <div className=" grid grid-cols-2 gap-2 ">
        {imageArry?.map((data) => (
          <div className=" relative rounded-lg overflow-hidden ">
            <img
              src={data.post.previewImage}
              alt=""
              className=" object-fill object-center w-full h-full "
            />
          </div>
        ))}
      </div> */}
    </Link>
  );
}

export default memo(GroupCard);
