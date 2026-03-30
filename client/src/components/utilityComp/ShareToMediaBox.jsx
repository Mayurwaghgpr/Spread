import { useDispatch, useSelector } from "react-redux";
import useIcons from "../../hooks/useIcons";
import { PopupBox } from "./PopupBox";
import { setShareToMedia, setToast } from "../../store/slices/uiSlice";
import { useMemo } from "react";

export default function ShareToMediaBox() {
  const shareTomedia = useSelector((state) => state.ui.shareTomedia);
  const dispatch = useDispatch();
  const icons = useIcons();
  const mediaOptions = useMemo(
    () => [
      {
        name: "Facebook",
        icon: icons["facebook"],
        link: `https://www.facebook.com/sharer/sharer.php?u=${shareTomedia.link}`,
      },
      {
        name: "Twitter",
        icon: icons["XCom"],
        link: `https://twitter.com/intent/tweet?text=Check%20out%20this%20link:&url=${shareTomedia.link}`,
      },
      {
        name: "LinkedIn",
        icon: icons["linkedin"],
        link: `https://www.linkedin.com/sharing/share-offsite/?url=${shareTomedia.link}`,
      },
      {
        name: "WhatsApp",
        icon: icons["whatsapp"],
        link: `https://wa.me/?text=${shareTomedia.link}`,
      },
      {
        name: "Reddit",
        icon: icons["reddit"],
        link: `https://www.reddit.com/submit?url=${shareTomedia.link}`,
      },
      {
        name: "Email",
        icon: icons["email"],
        link: `mailto:?body=${shareTomedia.link}`,
      },
    ],
    [icons, shareTomedia.link],
  );
  const handleClose = () => {
    dispatch(setShareToMedia({ status: false, link: "" }));
  };

  if (!shareTomedia.status) return null;
  return (
    <PopupBox action={handleClose} className={"relative w-fit h-fit "}>
      <div className="flex flex-col items-center gap-4  p-10 py-5 border-inherit">
        <div className="flex items-center gap-4 text-primary font-medium">
          {" "}
          <span className="">{icons["share"]}</span>Share{" "}
        </div>
        <div className=" flex flex-col gap-5">
          <div className="flex flex-wrap justify-center gap-4">
            {mediaOptions.map((option, index) => (
              <a
                href={option.link}
                key={index}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="text-sm">{option.name}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full rounded-full p-2 border dark:border-white/50 border-inherit  bg-inherit">
            <input
              className=" text-sm opacity-50 bg-inherit border-inherit w-full"
              type="text"
              value={shareTomedia.link}
              readOnly
            />{" "}
            <button
              onClick={() =>
                window.navigator.clipboard
                  .writeText(shareTomedia.link)
                  .then(() => {
                    dispatch(
                      setToast({
                        message: "Link copied to clipboard",
                        type: "success",
                      }),
                    );
                  })
              }
              className="dark:bg-light bg-zinc-400 text-light dark:text-zinc-400 rounded-full px-2 py-1"
            >
              Copy
            </button>{" "}
          </div>
        </div>
      </div>
    </PopupBox>
  );
}
