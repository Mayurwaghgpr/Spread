import profileIcon from "/ProfOutlook.png";
 const userImageSrc = (user) => {
   let userImageurl=profileIcon;
   let IsuserFromOAth =false 
  if (user?.userImage) {
    if (user.userImage.startsWith("http")) {
      userImageurl = user.userImage
      IsuserFromOAth= true
    } else {
      userImageurl = `${import.meta.env.VITE_BASE_URL}/${user.userImage.replace(/^\//, "")}`
    }
  }
  return {userImageurl ,IsuserFromOAth};
}
export default userImageSrc