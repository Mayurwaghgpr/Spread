import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setElements } from "../../../store/slices/postSlice";
import { setToast } from "../../../store/slices/uiSlice";
import { useMutation } from "react-query";
import PostsApis from "../../../services/usePostsApis";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Spinner from "../../../component/loaders/Spinner";
import { createPortal } from "react-dom";
import CommonInput from "../../../component/inputComponents/CommonInput";
import useIcons from "../../../hooks/useIcons";

const DEFAULT_ELEMENT = { type: "text", data: "", id: uuidv4(), index: 0 };

function PostPreviewEditor() {
  const [imageFiles, setImageFiles, handleTextChange] = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const icons = useIcons();

  // const [Topic, setTopic] = useState();
  const { elements } = useSelector((state) => state.posts);
  const { AddNewPost } = PostsApis();

  const mutation = useMutation((NewPosts) => AddNewPost(NewPosts), {
    onSuccess: (response) => {
      // queryClient.invalidateQueries(["posts"]);
      dispatch(
        setToast({
          message: `New Blog ${response.message} fully created`,
          type: "success",
        })
      );
      dispatch(setElements([DEFAULT_ELEMENT]));
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.error || "An error occurred. Please try again.";
      dispatch(setToast({ message: errorMessage, type: "error" }));
      dispatch(setElements([DEFAULT_ELEMENT]));
      navigate(-1, { replace: true });
    },
  });
  const EditTitleImage = useCallback(
    (id, index, el) => {
      const newImage = el.files[0];
      const updatedElements = elements.map((el) =>
        el.index === index ? { ...el, file: URL.createObjectURL(newImage) } : el
      );
      const updatedImageFiles = imageFiles.map((file) =>
        file.index === index ? { ...file, file: newImage } : file
      );
      setImageFiles(updatedImageFiles);
      dispatch(setElements(updatedElements));
    },
    [dispatch, elements, imageFiles]
  );

  const handeSubmit = useCallback((e) => {
    if (elements.some((el) => el.data === "" && !el.file)) {
      return;
    }

    const formData = new FormData();
    formData.append("blog", JSON.stringify(elements));
    imageFiles?.forEach((el, idx) => {
      console.log({ el });
      formData.append(`image-${el.index}`, el.file);
      formData.append(`description-${el.index}`, el.data);
    });
    console.log(formData);
    if (e === "fetch") {
      mutation.mutate(formData);
    }
  }, []);

  const imageElements = elements?.filter((el) => el.type === "image");

  return createPortal(
    <main className=" fixed top-0 right-0 z-50  px-10 bg-black/10   w-full flex justify-center min-h-screen h-full flex-col gap-10 m-auto items-center overflow-y-auto border-inherit">
      <div className="w-full  ">
        <Link
          className=" absolute right-5 text-xl top-5"
          to={-1}
          replace={true}
        >
          {icons["close"]}
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center gap-10 bg-light h-fit max-w-3xl min-w-[36rem] dark:bg-black p-10 rounded-xl">
        {" "}
        <hgroup className="text-center ">
          <h1 className="text-lg">Define your Preview</h1>
          <p className="text-[.6rem] sm:text-sm px-10  dark:text-white  text-black dark:opacity-50 text-opacity-20"></p>
        </hgroup>
        <div className="  w-full  h-full flex flex-col  justify-center items-start gap-5 text-start border-inherit  ">
          <h1 className="">Post Preview</h1>
          <div className="flex justify-center h-20 w-full items-center bg-inherit">
            <label className="relative flex h-full w-full" htmlFor="titleimage">
              {imageElements?.length ? (
                <img
                  className=" object-cover object-center "
                  src={imageElements[0]?.file}
                  alt="title image"
                  loading="lazy"
                />
              ) : (
                <div className=" w-full h-full flex justify-center items-center hover:bg-gray-100 border-2 border-dashed border-inherit rounded-lg ">
                  <p>Add Title Image</p>
                </div>
              )}
            </label>
            <input
              className=""
              hidden
              type="file"
              name=""
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

          <CommonInput
            label={"Title"}
            className=" p-1 w-full border rounded-lg placeholder:text-sm  outline-none focus:border-black bg-inherit"
            type="text"
            name="title"
            defaultValue={elements[0]?.data}
            title=""
            placeholder="Write Preview title"
            onChange={(e) => handleTextChange(elements[0]?.id, e.target.value)}
          />
          <CommonInput
            type="text"
            label={"Subetitle"}
            name={"subtitle"}
            className=" p-2 w-full border rounded-lg placeholder:text-sm  outline-none focus:border-black bg-inherit"
            defaultValue={elements[1]?.data}
            placeholder=" Write Preview Subtitle"
            onChange={(e) => handleTextChange(elements[1]?.id, e.target.value)}
          />

          <div className=" w-full flex my-7 gap-5 flex-col border-inherit">
            <div className="h-full flex gap-3 items-start border-inherit">
              <button
                onClick={() => handeSubmit("fetch")}
                className={`flex gap-2 ${
                  mutation.isLoading && " opacity-50 "
                } dark:bg-white dark:text-black text-white bg-oplight px-4 py-2 rounded-full`}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading && (
                  <Spinner
                    className={" w-5 h-5 p-0.5 bg-black dark:bg-white"}
                  />
                )}
                {mutation.isLoading ? `Submitting...` : "Submit"}
              </button>

              <Link
                className=" border px-4 py-2 rounded-full border-inherit"
                to={-1}
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>,
    document.getElementById("portal")
  );
}

export default PostPreviewEditor;
