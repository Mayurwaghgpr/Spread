import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import profileIcon from "/ProfOutlook.png";
import { setUser } from "../../redux/slices/authSlice";
import { useMutation, useQueryClient } from "react-query";
import { setToast } from "../../redux/slices/uiSlice";
import { debounce } from "../../utils/debounce";
import useProfileApi from "../../Apis/ProfileApis";
import userImageSrc from "../../utils/userImageSrc";
import CommonInput from "../../component/UtilityComp/commonInput";
import Selector from "../../component/UtilityComp/Selector";
import Spinner from "../../component/loaders/Spinner";
function ProfileEditor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { editUserProfile, searchUsername } = useProfileApi();
  const uNameRef = useRef();
  const [newInfo, setNewInfo] = useState(user);
  const [profileImage, setProfileImage] = useState(profileIcon);

  const { userImageurl, IsUserFromOAth } = userImageSrc(newInfo);

  const {
    mutate: nameMutate,
    isLoading: nameLoading,
    isSuccess,
    isError,
    error,
  } = useMutation((username) => searchUsername(username), {
    onSuccess: (data) => {
      uNameRef.current.focus();
      setNewInfo((prev) => ({ ...prev, ...data }));
    },
    onError: () => {
      uNameRef.current.focus();
    },
  });

  const debouncedHandleChange = useCallback(
    debounce((event) => {
      const { name, value, files } = event.target;
      if (name === "image" && files.length > 0) {
        setNewInfo((prev) => ({
          ...prev,
          NewImageFile: files[0],
          userFromOAth: IsUserFromOAth,
        }));
      } else {
        setNewInfo((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }, 500),
    []
  );

  const debouncedHandleUsername = useCallback(
    debounce((event) => {
      nameMutate({ username: event.target.value });
    }, 500),
    []
  );

  useEffect(() => {
    setNewInfo(user);
  }, [user]);

  useEffect(() => {
    if (newInfo?.removeImage) setProfileImage(profileIcon);
    else if (newInfo?.NewImageFile)
      setProfileImage(URL.createObjectURL(newInfo.NewImageFile));
    else if (newInfo?.userImage) setProfileImage(userImageurl);
    else setProfileImage(profileIcon);
  }, [newInfo?.removeImage, newInfo?.NewImageFile, newInfo?.userImage]);

  const handleRemoveImage = useCallback(() => {
    setNewInfo((prev) => ({
      ...prev,
      NewImageFile: undefined,
      removeImage: true,
      userFromOAth: IsUserFromOAth,
    }));
  }, [IsUserFromOAth]);

  const { mutate, isLoading } = useMutation(editUserProfile, {
    onSuccess: (data) => {
      uNameRef.current?.blur();
      dispatch(setUser(data));
      dispatch(
        setToast({ message: "Profile updated successfully!", type: "success" })
      );
    },
    onError: () => {
      uNameRef.current?.blur();
      dispatch(setToast({ message: "Profile update failed.", type: "error" }));
    },
  });

  return (
    <section className=" relative f sm:h-screen h-1/2 dark:*:border-[#0f0f0f] overflow-y-auto dark:bg-black">
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
              onChange={debouncedHandleChange}
              style={{ display: "none" }}
            />
            <img
              className="cursor-pointer h-full w-full object-cover object-top rounded-full "
              src={profileImage}
              alt="Profile"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center items-start w-full ">
            <div className="">
              <button
                className="rounded-xl text-md  text-red-500 flex gap-2"
                onClick={handleRemoveImage}
                disabled={!newInfo?.NewImageFile && !newInfo?.userImage}
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
              setOptions={debouncedHandleChange}
              options={["he/him", "she/her"]}
              defaultValue={newInfo.pronouns}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-col w-full items-end h-full bg-inherit gap-10   dark:*:border-black  px-2 ">
          <div className="w-full h-full  flex flex-col capitalize  items-end bg-inherit gap-3 ">
            {" "}
            <div className="w-full">
              <CommonInput
                ref={uNameRef}
                className={`border transition-all duration-500 ${isError ? "outline outline-red-500" : "outline-none"} ${isSuccess ? "  outline-green-500" : " outline-none"} rounded-md w-full border-inherit text-sm mt-3 flex flex-col gap-3 bg-inherit `}
                type={"text"}
                Iname={"username"}
                labelname={"username"}
                disabled={isLoading}
                onChange={debouncedHandleUsername}
                maxLength={10}
                comp={nameLoading && <Spinner className={"w-5 h-5"} />}
                defaultValue={newInfo?.username}
              />
              {isError && (
                <span className="text-red-500 text-xs w-full">
                  {error.data.message}
                </span>
              )}
            </div>
            <CommonInput
              className="w-full border  rounded-md border-inherit text-sm  flex flex-col gap-3 bg-inherit "
              type={"text"}
              Iname={"displayName"}
              labelname={"Full Name"}
              disabled={isLoading}
              maxLength={20}
              onChange={debouncedHandleChange}
              defaultValue={newInfo?.displayName}
            />
            <span className=" flex text-xs text-black dark:text-white text-opacity-15 dark:text-opacity-30 justify-end">
              {`${newInfo?.displayName?.length || 0} / 20`}
            </span>{" "}
            <CommonInput
              className="w-full border  rounded-md border-inherit text-sm  flex flex-col gap-3 bg-inherit "
              type={"email"}
              Iname={"email"}
              labelname={"email"}
              disabled={isLoading}
              maxLength={30}
              onChange={debouncedHandleChange}
              defaultValue={newInfo?.email}
            />
            <span className=" flex text-xs text-black dark:text-white text-opacity-15 dark:text-opacity-30 justify-end">
              {`${newInfo?.email?.length || 0} / 30`}
            </span>{" "}
            <CommonInput
              className="w-full border  rounded-md border-inherit text-sm  flex flex-col gap-3 bg-inherit "
              type={"text"}
              Iname={"bio"}
              labelname={"Bio"}
              disabled={isLoading}
              maxLength={50}
              onChange={debouncedHandleChange}
              defaultValue={newInfo?.bio}
            />
            <span className=" flex text-xs text-black dark:text-white text-opacity-15 dark:text-opacity-30 justify-end">
              {`${newInfo?.bio?.length || 0} / 50`}
            </span>
          </div>
          <button
            className={`px-4 py-1 text-white rounded-xl  border bg-sky-400`}
            onClick={useCallback(() => mutate(newInfo), [newInfo])}
          >
            {isLoading ? "Updating..." : "Save"}
          </button>
        </div>
      </article>
    </section>
  );
}

export default memo(ProfileEditor);
