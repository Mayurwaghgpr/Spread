import { useCallback } from "react";
import CommonInput from "../../../components/inputComponents/CommonInput";
import { useDispatch, useSelector } from "react-redux";
import { setElements } from "../../../store/slices/postSlice";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import PostsApis from "../../../services/usePostsApis";
import { useMutation } from "@tanstack/react-query";
import Spinner from "../../../components/loaders/Spinner";
import { setToast } from "../../../store/slices/uiSlice";
import { ArrowLeft, Sparkles, Upload, Send } from "lucide-react";

function PostPreviewEditor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postCreateApi } = PostsApis();

  const { isDraftMode, isPublishLoading, isPostUpdating } = useOutletContext();
  const { elements, imageElements } = useSelector((state) => state.posts);

  const EditTitleImage = useCallback(
    (id, index, el) => {
      const file = el.files[0];
      if (file && elements) {
        const updated = elements.map((item) =>
          item.id === id
            ? { ...item, file: URL.createObjectURL(file), rawFile: file }
            : item
        );
        dispatch(setElements(updated));
      }
    },
    [elements, dispatch]
  );

  const handleTextChange = useCallback(
    (id, data) => {
      if (elements) {
        const updated = elements.map((item) =>
          item.id === id ? { ...item, data } : item
        );
        dispatch(setElements(updated));
      }
    },
    [elements, dispatch]
  );

  const { mutate: createPostMutate } = useMutation({
    mutationFn: (data) => postCreateApi(data),
    onSuccess: (data) => {
      navigate(`/p/${data?.post?.title.replaceAll(" ", "-")}-${data?.post?.id}`);
      dispatch(setToast({ message: data?.message || "Story published ✨", type: "success" }));
    },
    onError: (error) => {
      dispatch(
        setToast({
          message: error?.response?.data?.message || error?.message || "Failed to publish post",
          type: "error",
        })
      );
    },
  });

  return (
    <div
      onClick={() => navigate(-1)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-label="Post preview modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col w-full max-w-xl max-h-[90vh] spread-card rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-150 p-6 sm:p-8 space-y-6 overflow-y-auto"
      >
        {/* Navigation Back Link */}
        <Link
          to={-1}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editor</span>
        </Link>

        {/* Modal Header */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            Publish Story Preview
            <Sparkles className="w-5 h-5 text-stone-700 dark:text-stone-300" />
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Review your cover image, title, and subtitle before publishing to Spread
          </p>
        </div>

        {/* Title Image Upload Area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Cover Image
          </label>
          <label
            htmlFor="titleimage"
            className="relative flex items-center justify-center h-44 sm:h-52 w-full rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 overflow-hidden bg-stone-100/60 dark:bg-stone-900/60 transition-all cursor-pointer group"
          >
            {imageElements?.length ? (
              <img
                className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-300"
                src={imageElements[0]?.file}
                alt="Title preview cover"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                <Upload className="w-8 h-8" />
                <span className="text-xs font-semibold">Click to upload cover image</span>
              </div>
            )}
          </label>
          <input
            hidden
            type="file"
            id="titleimage"
            accept="image/*"
            onChange={(el) =>
              EditTitleImage(
                imageElements[0]?.id,
                imageElements[0]?.index,
                el.target
              )
            }
          />
        </div>

        {/* Preview Input Controls */}
        <div className="space-y-4">
          <CommonInput
            label="Title"
            className="p-3 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-stone-400/50"
            type="text"
            name="title"
            defaultValue={elements[0]?.data}
            placeholder="Write preview title..."
            onChange={(e) => handleTextChange(elements[0]?.id, e.target.value)}
          />

          <CommonInput
            label="Subtitle / Summary"
            className="p-3 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 text-sm outline-none focus:ring-2 focus:ring-stone-400/50"
            type="text"
            name="subtitle"
            defaultValue={elements[1]?.data}
            placeholder="Write preview subtitle..."
            onChange={(e) => handleTextChange(elements[1]?.id, e.target.value)}
          />
        </div>

        {/* Modal Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="spread-pill text-xs font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-transform cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => createPostMutate(isDraftMode)}
            disabled={isPublishLoading || isPostUpdating}
            className="spread-btn-primary px-6 py-2.5 text-xs font-bold rounded-full shadow-md flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          >
            {isPublishLoading || isPostUpdating ? (
              <Spinner className="w-4 h-4 text-stone-900 dark:text-stone-100" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{isDraftMode ? "Publish Story" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPreviewEditor;
