import { memo } from "react";
import { Link } from "react-router-dom";

function GroupCard({ onClick, heading, stub, className, count, imageArry }) {
  return (
    <Link
      to={stub}
      onClick={onClick}
      className={` border rounded-xl space-y-3 ${className} border-inherit  `}
    >
      {" "}
      <div className="flex justify-between items-center">
        <h1 className="">{heading}</h1>
        <span className="opacity-50">{count && count}</span>
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
