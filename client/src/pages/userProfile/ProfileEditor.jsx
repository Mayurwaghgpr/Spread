import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileIcon from "/ProfOutlook.png";
import { setUser } from "../../redux/slices/authSlice";
import { useMutation } from "react-query";
import { setToast } from "../../redux/slices/uiSlice";
import { debounce } from "../../utils/debounce";
import useProfileApi from "../../Apis/ProfileApis";
import userImageSrc from "../../utils/userImageSrc";
import CommonInput from "../../component/inputComponents/CommonInput";
import Selector from "../../component/utilityComp/Selector";
import Spinner from "../../component/loaders/Spinner";
import Ibutton from "../../component/buttons/Ibutton";
import useIcons from "../../hooks/useIcons";
import FedInBtn from "../../component/buttons/FedInBtn";
function ProfileEditor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { editUserProfile, searchUsername } = useProfileApi();
  const uNameRef = useRef();
  const [newInfo, setNewInfo] = useState(user);
  const [profileImage, setProfileImage] = useState(profileIcon);

  const { userImageurl, IsUserFromOAth } = userImageSrc(newInfo);
  const icons = useIcons();

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
    <section className=" relative flex sm:h-screen w-full h-1/2 border-inherit overflow-y-auto bg-light dark:bg-dark ">
      <article className=" flex flex-col sm:w-fit  sm:h-fit rounded-xl m-auto bg-light dark:bg-dark  my-14 px-4  border-inherit  gap-6 py-5">
        <h1 className="w-full text-center text-2xl p-2  bg-inherit  ">
          User Information
        </h1>
        <div
          className=" flex justify-start gap-5 w-full border-inherit "
          aria-label="Upload profile picture"
        >
          <div className="relative  group flex justify-center items-center  max-h-32 max-w-32 h-fit w-full border-2 rounded-full border-inherit ">
            <label
              className="absolute left-1 bottom-3 p-1 border border-inherit hover:opacity-50 rounded-full text-nowrap w-fit h-fit bg-white dark:bg-black cursor-pointer "
              htmlFor="fileInput"
            >
              {icons["penO"]}
            </label>
            <input
              className=" bg-inherit hidden  border border-inherit"
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
            <FedInBtn
              className="rounded-xl text-md text-red-500 flex gap-2"
              action={handleRemoveImage}
              disabled={!newInfo?.NewImageFile && !newInfo?.userImage}
            >
              {icons["delete"]}
              Remove
            </FedInBtn>
            <p className="text-start text-xs break-words opacity-50 ">
              Importent: Insert image in JPG,JPEG,PNG format and high quality
            </p>
            <Selector
              name={"pronouns"}
              className={
                "w-fit outline-none self-start my-2 text-xs flex flex-col gap-3 bg-inherit cursor-pointer"
              }
              setOptions={debouncedHandleChange}
              options={["he/him", "she/her"]}
              defaultValue={newInfo.pronouns}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-col w-full items-end h-full bg-inherit gap-10   border-inherit px-2 ">
          <div className="flex flex-col items-end justify-center gap-3 w-full h-full capitalize bg-inherit border-inherit  ">
            {" "}
            <div className="w-full border-inherit">
              <CommonInput
                ref={uNameRef}
                className={` flex flex-col gap-3 transition-all duration-500  w-full border-inherit text-sm mt-3 bg-inherit `}
                type={"text"}
                IClassName={`${isError ? "outline outline-red-500" : "outline-none"} ${isSuccess ? "  outline-green-500" : " outline-none"} border`}
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
              className="flex flex-col items-start w-full border-inherit text-sm gap-3 bg-inherit  "
              type={"text"}
              Iname={"displayName"}
              IClassName={"w-full border"}
              labelname={"Full Name"}
              disabled={isLoading}
              maxLength={20}
              onChange={debouncedHandleChange}
              defaultValue={newInfo?.displayName}
            />
            <span className=" flex text-xs text-black dark:text-white text-opacity-15 dark:text-opacity-30 justify-end">
              {`${newInfo?.displayName?.length || 0} / 20`}
            </span>
            <CommonInput
              className="flex flex-col gap-3 w-full border-inherit text-sm  bg-inherit "
              type={"email"}
              Iname={"email"}
              IClassName={"border"}
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
              className="flex flex-col gap-3 w-full rounded-md border-inherit text-sm   bg-inherit "
              IClassName={"border rounded-lg"}
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
            className={`px-4 py-1 text-white rounded-xl  border bg-sky-700`}
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
