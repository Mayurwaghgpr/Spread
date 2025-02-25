import profileIcon from "/ProfOutlook.png";
const userImageSrc = (user) => {
  let userImageurl = profileIcon;
  let IsUserFromOAth = false;
  if (user?.userImage) {
    if (!user.userImage.includes("cloudinary")) {
      userImageurl = user.userImage;
      IsUserFromOAth = true;
    } else if (user.userImage.includes("cloudinary")) {
      userImageurl = user.userImage;
    }else{
      userImageurl = `${import.meta.env.VITE_BASE_URL}/${user.userImage.replace(/^\//, "")}`;
    }
  }
  return { userImageurl, IsUserFromOAth };
};
export default userImageSrc;
