import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setuserProfile } from "../../redux/slices/profileSlice";
import profileIcon from "/ProfOutlook.png";
import ProfilImage from "../../component/ProfileButton";
import { setUser } from "../../redux/slices/authSlice";
import { useMutation, useQueryClient } from "react-query";
import { setToast } from "../../redux/slices/uiSlice";
import { debounce } from "../../utils/debounce";
import useProfileApi from "../../Apis/ProfileApis";
import userImageSrc from "../../utils/userImageSrc";
import CommonInput from "../../component/UtilityComp/commonInput";
import { v4 as uuidv4 } from "uuid";
import Selector from "../../component/UtilityComp/Selector";
function ProfileEditor() {
  const { user } = useSelector((state) => state.auth);
  const [newInfo, setNewInfo] = useState(user);

  const [ProfileImage, SetProfileImage] = useState();
  const { editUserProfile } = useProfileApi();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { userImageurl, IsUserFromOAth } = userImageSrc(newInfo);

  const { isLoading, isError, mutate } = useMutation(
    (profileUpdated) => editUserProfile(profileUpdated),
    {
      onSuccess: (data) => {
        dispatch(
          setToast({
            message: "Profile updated successfully !",
            type: "success",
          })
        );
        dispatch(setUser(data));
      },
    }
  );

  useEffect(() => {
    setNewInfo(user);
  }, [user]);

  useMemo(() => {
    if (newInfo?.removeImage) {
      SetProfileImage(profileIcon);
    } else if (newInfo.NewImageFile) {
      SetProfileImage(URL.createObjectURL(newInfo.NewImageFile));
    } else if (newInfo?.userImage !== null) {
      SetProfileImage(userImageurl);
    } else {
      SetProfileImage(profileIcon);
    }
  }, [newInfo?.removeImage, newInfo.NewImageFile, newInfo?.userImage]);

  // Handle input changes
  const handleChange = debounce((event) => {
    const { name, value, files } = event.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      setNewInfo((prev) => ({
        ...prev,
        NewImageFile: file,
        userFromOAth: IsUserFromOAth,
      }));
      event.target.value = "";
    } else {
      setNewInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, 600);

  // console.log(newInfo);
  const RemoveSelecteImage = () => {
    if (newInfo.userImage && newInfo.NewImageFile) {
      delete newInfo.NewImageFile;
      setNewInfo((prev) => ({
        ...prev,
      }));
    } else {
      setNewInfo((prev) => ({
        ...prev,
        removeImage: true,
        userFromOAth: IsUserFromOAth,
      }));
    }
  };
  const Inputcontant = [
    {
      id: uuidv4(),
      labelname: "User Name",
      Iname: "username",
      defaultValue: newInfo?.username,
      maxLength: 20,
      length: `${newInfo?.username?.length || 0} / 20`,
    },
    {
      id: uuidv4(),
      labelname: "Email",
      Iname: "email",
      defaultValue: newInfo?.email,
      maxLength: 30,
      length: `${newInfo?.email?.length || 0} / 30`,
    },
    {
      id: uuidv4(),
      labelname: "Bio",
      Iname: "bio",
      defaultValue: newInfo?.bio,
      maxLength: 100,
      length: `${newInfo?.bio?.length || 0} / 100`,
    },
  ];

  return (
    <div className=" relative f sm:h-screen h-1/2 dark:*:border-[#0f0f0f] overflow-y-auto dark:bg-black">
      <article className=" flex flex-col sm:w-fit  sm:h-fit rounded-xl m-auto  dark:bg-black   my-14 px-4  border-inherit  gap-6 py-5">
        <h1 className="w-full text-center text-2xl p-2  bg-inherit  ">
          User Information
        </h1>
        <div
          className=" flex justify-start gap-5 w-full border-inherit "
          aria-label="Upload profile picture"
        >
          <div className="relative sm:w-32 sm:h-24  group flex  flex-col">
            <label
              className="absolute h-full w-full cursor-pointer "
              htmlFor="fileInput"
            >
              <span className="absolute transition-all duration-300 top-10  bg-gray-500 p-[.2rem] rounded-md bg-opacity-60 left-5 group-hover:opacity-100 opacity-0  z-10 text-xs m-auto">
                {" "}
                add image..{" "}
              </span>{" "}
            </label>
            <input
              className="w-full h-full p-3 bg-inherit hidden  border border-inherit"
              id="fileInput"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
            />
            <img
              className="cursor-pointer  object-cover object-top rounded-full "
              src={ProfileImage}
              alt="Profile"
            />
          </div>
          <div className="flex flex-col justify-center items-start w-full ">
            <div className="">
              <button
                className="rounded-xl text-md  text-red-500 flex gap-2"
                onClick={() =>
                  (newInfo?.userImage !== null || newInfo?.NewImageFile) &&
                  RemoveSelecteImage()
                }
              >
                <i className="bi bi-trash3"></i>
                Remove
              </button>
            </div>
            <p className="text-start text-xs  break-words text-black dark:text-white text-opacity-15 dark:text-opacity-30 ">
              Importent: Insert image in JPG,JPEG,PNG format and high quality
            </p>
            <Selector
              name={"pronouns"}
              className={
                "w-fit outline-none self-start my-2 text-xs flex flex-col gap-3 bg-inherit"
              }
              setOptions={handleChange}
              options={["he/him", "she/her"]}
              defaultValue={newInfo.pronouns}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-col w-full items-end h-full bg-inherit gap-10   dark:*:border-black  px-2 ">
          <div className="w-full h-full  flex flex-col  items-end bg-inherit gap-3 ">
            {Inputcontant.map((input) => (
              <>
                {" "}
                <CommonInput
                  key={input.id}
                  className="w-full border-inherit text-sm  flex flex-col gap-3 bg-inherit "
                  type={input.type}
                  Iname={input.Iname}
                  labelname={input.labelname}
                  disabled={isLoading}
                  maxLength={input.maxLength}
                  onChange={handleChange}
                  defaultValue={input.defaultValue}
                />
                <span className=" flex text-xs text-black dark:text-white text-opacity-15 dark:text-opacity-30 justify-end">
                  {input.length}
                </span>
              </>
            ))}
          </div>
          <button
            className={`px-4 py-1 text-white rounded-xl  border bg-sky-400`}
            onClick={() => mutate(newInfo)}
          >
            {isLoading ? "Updating..." : "Save"}
          </button>
        </div>
      </article>
    </div>
  );
}

export default ProfileEditor;
