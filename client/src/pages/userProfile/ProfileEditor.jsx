import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { setToast } from "../../store/slices/uiSlice";
import { debounce } from "../../utils/functions/debounce";
import useProfileApi from "../../services/useProfileApis";
import userImageSrc from "../../utils/functions/userImageSrc";
import CommonInput from "../../components/inputComponents/CommonInput";
import Selector from "../../components/utilityComp/Selector";
import Spinner from "../../components/loaders/Spinner";
import { CheckCircle, AlertCircle, Camera, Trash2, Sparkles, User, Mail, FileText, ArrowLeft } from "lucide-react";
import profileOutlook from "/ProfOutlook.png";
import { Link, useNavigate } from "react-router-dom";

function ProfileEditor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { editUserProfile, searchUsername } = useProfileApi();
  const uNameRef = useRef();
  const [newInfo, setNewInfo] = useState(user || {});
  const [profileImage, setProfileImage] = useState();

  const { userImageurl, IsUserFromOAth } = userImageSrc(newInfo);

  // Username availability check mutation
  const {
    mutate: nameMutate,
    isPending: nameLoading,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (username) => searchUsername(username),
    onSuccess: (data) => {
      uNameRef.current?.focus();
      setNewInfo((prev) => ({ ...prev, ...data }));
    },
    onError: () => {
      uNameRef.current?.focus();
    },
  });

  // Profile update mutation
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: editUserProfile,
    onSuccess: (data) => {
      uNameRef.current?.blur();
      dispatch(setUser(data));
      dispatch(
        setToast({
          message: "Profile updated successfully! ✨",
          type: "success",
        })
      );
    },
    onError: (err) => {
      uNameRef.current?.blur();
      dispatch(
        setToast({
          message: err?.response?.data?.message || err?.data?.message || "Profile update failed.",
          type: "error",
        })
      );
    },
  });

  // Input change handler
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
        if (username && username !== user?.username) {
          nameMutate({ username });
        }
      }, 500),
    [user?.username, nameMutate]
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

  // Update profile image display preview
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
    <div className="flex flex-col items-center w-full min-h-screen border-inherit px-3 sm:px-6 py-8 max-w-3xl mx-auto space-y-6">
      {/* Back Navigation & Container Card */}
      <div className="w-full spread-card p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl backdrop-blur-xl space-y-8 animate-in fade-in duration-150">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-5">
          <Link
            to={-1}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
              Edit Profile
              <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            </h1>
          </div>
        </div>

        {/* Profile Image Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-2xl bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/60">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-full ring-4 ring-stone-300 dark:ring-stone-700 shadow-lg overflow-hidden relative">
              <img
                className="w-full h-full object-cover object-top"
                src={profileImage}
                alt="Profile Avatar"
                loading="lazy"
              />
              <label
                htmlFor="fileInput"
                className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <Camera className="w-7 h-7 text-white" />
              </label>
            </div>

            <label
              htmlFor="fileInput"
              className="absolute -bottom-1 -right-1 spread-btn-primary p-2.5 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
              title="Change avatar photo"
            >
              <Camera className="w-4 h-4" />
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

          <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                Profile Photo
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Upload a high quality square avatar image (JPG, PNG, WebP)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={!newInfo?.NewImageFile && !newInfo?.userImage}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-full hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Avatar</span>
              </button>

              <div className="shrink-0">
                <Selector
                  name="pronouns"
                  className="px-3.5 py-1.5 text-xs font-semibold spread-card rounded-full border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 outline-none cursor-pointer"
                  setOptions={handleInputChange}
                  options={["he/him", "she/her", "they/them"]}
                  defaultValue={newInfo?.pronouns}
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="space-y-5">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-500" />
              Username
            </label>
            <div className="relative">
              <CommonInput
                ref={uNameRef}
                className={`w-full p-3 rounded-xl border bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 text-sm font-semibold outline-none transition-all ${
                  isError
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                    : isSuccess
                    ? "border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                    : "border-stone-300 dark:border-stone-700 focus:ring-2 focus:ring-stone-400/50"
                }`}
                type="text"
                name="username"
                disabled={isUpdating}
                onChange={handleUsernameChange}
                maxLength={15}
                defaultValue={newInfo?.username}
                value={newInfo?.username}
                placeholder="Enter unique username"
                aria-invalid={isError}
              />

              {/* Status Indicator Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {nameLoading && <Spinner className="w-4 h-4 text-stone-900 dark:text-stone-100" />}
                {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {isError && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
            </div>

            {isError && (
              <p className="text-red-500 text-xs flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {error?.data?.message || "Username is unavailable"}
              </p>
            )}

            <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              <span>Choose your unique handle</span>
              <span>{newInfo?.username?.length || 0}/15</span>
            </div>
          </div>

          {/* Full Name & Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-500" />
                Display Name
              </label>
              <CommonInput
                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-stone-400/50 transition-all"
                type="text"
                name="displayName"
                disabled={isUpdating}
                maxLength={50}
                onChange={handleInputChange}
                defaultValue={newInfo?.displayName}
                value={newInfo?.displayName}
                placeholder="Your full display name"
              />
              <div className="text-right text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                {newInfo?.displayName?.length || 0}/50
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                Email Address
              </label>
              <CommonInput
                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 text-sm outline-none focus:ring-2 focus:ring-stone-400/50 transition-all"
                type="email"
                name="email"
                disabled={isUpdating}
                maxLength={40}
                onChange={handleInputChange}
                defaultValue={newInfo?.email}
                value={newInfo?.email}
                placeholder="your.email@example.com"
              />
              <div className="text-right text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                {newInfo?.email?.length || 0}/40
              </div>
            </div>
          </div>

          {/* Bio Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              Bio
            </label>
            <CommonInput
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 text-sm outline-none focus:ring-2 focus:ring-stone-400/50 transition-all"
              type="text"
              name="bio"
              disabled={isUpdating}
              maxLength={120}
              onChange={handleInputChange}
              defaultValue={newInfo?.bio}
              value={newInfo?.bio}
              placeholder="Tell the community about yourself..."
            />
            <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              <span>Short profile description</span>
              <span>{newInfo?.bio?.length || 0}/120</span>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            {hasChanges ? (
              <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Unsaved changes pending
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                All profile information saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="spread-pill px-5 py-2.5 text-xs font-bold rounded-full hover:scale-105 transition-transform cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isUpdating || isError || !hasChanges}
              onClick={handleSubmit}
              className={`spread-btn-primary px-7 py-2.5 text-xs font-bold rounded-full shadow-md flex items-center justify-center gap-2 transition-transform ${
                isUpdating || isError || !hasChanges
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:scale-105 cursor-pointer"
              }`}
            >
              {isUpdating ? (
                <>
                  <Spinner className="w-4 h-4 text-stone-900 dark:text-stone-100" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes ✨</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default memo(ProfileEditor);
