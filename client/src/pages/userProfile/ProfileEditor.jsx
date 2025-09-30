import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { useMutation } from "react-query";
import { setToast } from "../../store/slices/uiSlice";
import { debounce } from "../../utils/debounce";
import useProfileApi from "../../services/ProfileApis";
import userImageSrc from "../../utils/userImageSrc";
import CommonInput from "../../component/inputComponents/CommonInput";
import Selector from "../../component/utilityComp/Selector";
import Spinner from "../../component/loaders/Spinner";
import useIcons from "../../hooks/useIcons";
import { CheckCircle, AlertCircle } from "lucide-react";
import profileOutlook from "/ProfOutlook.png";
import Paragraph from "../../component/texts/Paragraph";
function ProfileEditor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { editUserProfile, searchUsername } = useProfileApi();
  const uNameRef = useRef();
  const [newInfo, setNewInfo] = useState();
  const [profileImage, setProfileImage] = useState();

  const { userImageurl, IsUserFromOAth } = userImageSrc(newInfo);
  const icons = useIcons();

  // Username check mutation
  const {
    mutate: nameMutate,
    isLoading: nameLoading,
    isSuccess,
    isError,
    error,
  } = useMutation((username) => searchUsername(username), {
    onSuccess: (data) => {
      uNameRef.current?.focus();
      setNewInfo((prev) => ({ ...prev, ...data }));
    },
    onError: () => {
      uNameRef.current?.focus();
    },
  });

  // Profile update mutation
  const { mutate: updateProfile, isLoading: isUpdating } = useMutation(
    editUserProfile,
    {
      onSuccess: (data) => {
        uNameRef.current?.blur();
        dispatch(setUser(data));
        dispatch(
          setToast({
            message: "Profile updated successfully!",
            type: "success",
          })
        );
      },
      onError: (error) => {
        uNameRef.current?.blur();
        dispatch(
          setToast({
            message: error?.data?.message || "Profile update failed.",
            type: "error",
          })
        );
      },
    }
  );

  // Debounced input handlers
  const handleInputChange = useCallback(
    (event) => {
      const { name, value, files } = event.target;
      if (name === "image" && files?.length > 0) {
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
    },
    [IsUserFromOAth]
  );

  const debouncedUsernameCheck = useMemo(
    () =>
      debounce((username) => {
        if (username && username !== user.username) {
          nameMutate({ username });
        }
      }, 500),
    [user.username]
  );

  const handleUsernameChange = useCallback(
    (event) => {
      const username = event.target.value?.trim();
      setNewInfo((prev) => ({ ...prev, username }));
      debouncedUsernameCheck(username);
    },
    [debouncedUsernameCheck]
  );

  // Handle profile image removal
  const handleRemoveImage = useCallback(() => {
    setNewInfo((prev) => ({
      ...prev,
      NewImageFile: undefined,
      removeImage: true,
      userFromOAth: IsUserFromOAth,
    }));
  }, [IsUserFromOAth]);

  // Initialize form state when user data changes
  useEffect(() => {
    if (user) {
      setNewInfo(user);
    }
  }, [user]);

  // Update profile image display based on current state
  const profileImgPreview = useMemo(() => {
    if (newInfo?.removeImage) return profileOutlook;
    if (newInfo?.NewImageFile) return URL.createObjectURL(newInfo.NewImageFile);
    if (newInfo?.userImage) return userImageurl;
    return profileOutlook;
  }, [
    newInfo?.removeImage,
    newInfo?.NewImageFile,
    newInfo?.userImage,
    userImageurl,
  ]);

  useEffect(() => {
    if (!newInfo?.NewImageFile) return;

    const tempUrl = URL.createObjectURL(newInfo.NewImageFile);
    setProfileImage(tempUrl);

    return () => URL.revokeObjectURL(tempUrl);
  }, [newInfo?.NewImageFile]);

  useEffect(() => {
    if (!newInfo?.NewImageFile) {
      setProfileImage(profileImgPreview);
    }
  }, [profileImgPreview, newInfo?.NewImageFile]);

  // Handle profile update submission
  const handleSubmit = useCallback(() => {
    if (JSON.stringify(newInfo) === JSON.stringify(user)) return;
    updateProfile(newInfo);
  }, [newInfo, user, updateProfile]);

  const hasChanges = JSON.stringify(newInfo) !== JSON.stringify(user);

  return (
    <div className=" mx-auto h-full sm:my-20 my-10 text-sm px-5 border-inherit ">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Profile
        </h1>
        <Paragraph className=" text-sm font-thin">
          Update your personal information and profile settings
        </Paragraph>
      </div>

      {/* Profile Image Section */}
      <div className="border-inherit  ">
        <div className="flex flex-col sm:flex-row items-center gap-8 border-inherit ">
          {/* Profile Image */}
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-full border-4  shadow-xl overflow-hidden ">
              <img
                className="w-full h-full object-cover object-center"
                src={profileImage}
                alt="Profile"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <span className=" text-white opacity-0 group-hover:opacity-100 transition-all text-2xl duration-300">
                  {icons["pCamera"]}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <label
              className="absolute bottom-2 text-sm right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-110"
              htmlFor="fileInput"
              aria-label="Change profile picture"
            >
              {icons["edit"]}
            </label>
            <input
              className="hidden"
              id="fileInput"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>

          {/* Profile Controls */}
          <div className="flex-1 space-y-4 border-inherit ">
            <div className="flex flex-col sm:flex-row gap-3 border-inherit ">
              <button
                onClick={handleRemoveImage}
                disabled={!newInfo?.NewImageFile && !newInfo?.userImage}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {icons["delete"]}
                Remove Image
              </button>

              <Selector
                name="pronouns"
                className="px-4 py-2  border border-inherit bg-inherit rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                setOptions={handleInputChange}
                options={["he/him", "she/her", "they/them"]}
                defaultValue={newInfo?.pronouns}
                disabled={isUpdating}
              />
            </div>

            <Paragraph className="text-sm  p-3 rounded-lg opacity-50 font-thin">
              <span className="font-medium">Tip:</span> Upload high-quality
              images in JPG, JPEG, or PNG format for the best results
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="p-8 space-y-6 border-inherit">
        {/* Username Field */}
        <div className="space-y-2 border-inherit">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Username
          </label>
          <div className="relative border-inherit">
            <CommonInput
              ref={uNameRef}
              className={`w-full px-4 py-3 bg-inherit border-2 rounded-xl transition-all duration-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 ${
                isError
                  ? "border-red-500 focus:border-red-500"
                  : isSuccess
                    ? "border-green-500 focus:border-green-500"
                    : "border-inherit focus:border-blue-500"
              }`}
              type="text"
              name="username"
              disabled={isUpdating}
              onChange={handleUsernameChange}
              maxLength={15}
              defaultValue={newInfo?.username}
              value={newInfo?.username}
              placeholder="Enter your username"
              aria-invalid={isError}
              aria-describedby={isError ? "username-error" : undefined}
            />

            {/* Loading/Status Icons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 border-inherit">
              {nameLoading && <Spinner className="w-5 h-5 text-blue-500" />}
              {isSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          {isError && (
            <p
              id="username-error"
              className="text-red-500 text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error?.data?.message || "Username error"}
            </p>
          )}

          <Paragraph className="flex justify-between text-xs">
            <span>Choose a unique username</span>
            <span>{newInfo?.username?.length || 0}/15</span>
          </Paragraph>
        </div>

        {/* Grid Layout for Other Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-inherit">
          {/* Display Name */}
          <div className="space-y-2 border-inherit">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <CommonInput
              className="w-full px-4 py-3 bg-inherit border-2 border-inherit rounded-xl transition-all duration-200 focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
              type="text"
              name="displayName"
              disabled={isUpdating}
              maxLength={50}
              onChange={handleInputChange}
              defaultValue={newInfo?.displayName}
              value={newInfo?.displayName}
              placeholder="Your full name"
            />
            <Paragraph className="text-xs  text-right ">
              {newInfo?.displayName?.length || 0}/50
            </Paragraph>
          </div>

          {/* Email */}
          <div className="space-y-2 border-inherit">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <CommonInput
              className="w-full px-4 py-3 bg-inherit border-2 border-inherit rounded-xl transition-all duration-200 focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
              type="email"
              name="email"
              disabled={isUpdating}
              maxLength={30}
              onChange={handleInputChange}
              defaultValue={newInfo?.email}
              value={newInfo?.email}
              placeholder="your.email@example.com"
            />
            <Paragraph className="text-xs  text-right">
              {newInfo?.email?.length || 0}/30
            </Paragraph>
          </div>
        </div>

        {/* Bio Field - Full Width */}
        <div className="space-y-2 border-inherit">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <CommonInput
            className="w-full px-4 py-3 bg-inherit border-2 border-inherit rounded-xl transition-all duration-200 focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
            type="text"
            name="bio"
            disabled={isUpdating}
            maxLength={50}
            onChange={handleInputChange}
            defaultValue={newInfo?.bio}
            placeholder="Tell us about yourself..."
          />
          <Paragraph className="flex justify-between text-xs ">
            <span>A short description about yourself</span>
            <span>{newInfo?.bio?.length || 0}/50</span>
          </Paragraph>
        </div>
      </div>

      {/* Footer with Save Button */}
      <div className=" px-8 py-6 border-t  border-inherit ">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {hasChanges ? (
              <span className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                {icons["warning"]}
                You have unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                {icons["check"]}
                All changes saved
              </span>
            )}
          </div>

          <button
            disabled={isUpdating || isError || !hasChanges}
            onClick={handleSubmit}
            className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center gap-2 min-w-32 justify-center"
            aria-busy={isUpdating}
          >
            {isUpdating ? (
              <>
                <Spinner className="w-4 h-4" />
                Saving...
              </>
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileEditor);
