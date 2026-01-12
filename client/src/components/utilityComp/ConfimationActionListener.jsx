import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useDeleteHandlers from "../../hooks/useDeleteHandlers";
import { resetConfirmBox } from "../../store/slices/uiSlice";

export default function ConfirmationActionListener() {
  const { delPost, delComment } = useDeleteHandlers();
  const dispatch = useDispatch();

  const { isConfirm, event, contentId } = useSelector(
    (state) => state.ui.confirmBox
  );

  useEffect(() => {
    if (!isConfirm) return;
    switch (event) {
      case "DELETE_POST":
        delPost(contentId);
        break;

      case "DELETE_COMMENT":
        delComment(contentId);
        break;

      default:
        break;
    }

    dispatch(resetConfirmBox());
  }, [isConfirm, event, contentId]);
  return null;
}
