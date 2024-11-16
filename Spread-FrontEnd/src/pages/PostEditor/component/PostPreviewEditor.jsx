import React, { useRef, useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setElements } from "../../../redux/slices/postSlice";
import { setToast } from "../../../redux/slices/uiSlice";
import { useMutation, useQueryClient } from "react-query";
import PostsApis from "../../../Apis/PostsApis";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Spinner from "../../../component/loaders/Spinner";

const DEFAULT_ELEMENT = { type: "text", data: "", id: uuidv4(), index: 0 };

function PostPreviewEditor() {
  const [imageFiles, setImageFiles, handleTextChange] = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Topic, setTopic] = useState();
  const { elements } = useSelector((state) => state.posts);

  console.log(imageFiles);
  const { user } = useSelector((state) => state.auth);
  const { AddNewPost } = PostsApis();
  const queryClient = useQueryClient();

  const mutation = useMutation((NewPosts) => AddNewPost(NewPosts), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["posts"]);
      dispatch(
        setToast({
          message: `New Blog ${response.message} fully created`,
          type: "success",
        })
      );
      dispatch(setElements([DEFAULT_ELEMENT]));
    },
    onError: (error) => {
      const errorMessage =
        error.response?.error || "An error occurred. Please try again.";
      dispatch(setToast({ message: errorMessage, type: "error" }));
      dispatch(setElements([DEFAULT_ELEMENT]));
    },
    onSettled: () => navigate("/", { replace: true }),
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

  const handeSubmit = useCallback(() => {
    console.log(elements);
    if (elements.some((el) => el.data === "" && !el.file)) {
      return;
    }

    const formData = new FormData();
    // const textElements = elements.filter((el) => el.type == "image");
    formData.append("blog", JSON.stringify(elements));
    formData.append("Topic", Topic);
    imageFiles.forEach((el, idx) => {
      formData.append(`image-${el.index}`, el.file);
      formData.append(`description-${el.index}`, el.data);
    });
    // console.log(elements);
    mutation.mutate(formData);
  }, [dispatch, elements, Topic, mutation]);

  const imageElements = elements?.filter((el) => el.type === "image");

  return (
    <main className="fixed top-0 right-0 left-0 z-[100] bg-white dark:bg-[#222222] bottom-0 w-full h-screen flex justify-center flex-col gap-5 items-center">
      <div className="w-full max-w-[900px] text-center ">
        <div className="w-full text-end">
          <Link to={-1}> X</Link>
        </div>
        <hgroup>
          <h1 className="text-2xl font-light text-black">
            Define your Preview
          </h1>
          <p className=" text-slate-700">
            Define your posts preview and Add topice to know whats your post
            content about
          </p>
        </hgroup>
      </div>

      <article
        aria-disabled={mutation.isLoading}
        className="max-h-[500px] h-full w-full max-w-[900px] flex gap-2  "
      >
        <div className=" w-full flex flex-col justify-center items-center bg-inherit">
          <h1 className="w-full text-lg mb-2">Post Preview</h1>
          <div className="w-full h-[300px]   flex justify-center items-center bg-inherit">
            <label className=" w-full h-full " htmlFor="titleimage">
              {imageElements?.length ? (
                <img
                  className=" w-full h-full "
                  src={imageElements[0]?.file}
                  alt="title image"
                />
              ) : null}
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
          <div className="w-full h-full gap-1 flex flex-col justify-start items-center ">
            <input
              className=" p-2 w-full border-b placeholder:text-sm  outline-none focus:border-black bg-inherit"
              type="text"
              name="title"
              defaultValue={elements[0]?.data}
              title=""
              placeholder="Write Preview title"
              onChange={(e) =>
                handleTextChange(elements[0]?.id, e.target.value)
              }
            />
            <input
              className=" p-2 w-full border-b placeholder:text-sm  outline-none focus:border-black bg-inherit"
              type="text"
              name="subtitle"
              defaultValue={elements[1]?.data}
              placeholder=" Write Preview Subtitle"
              onChange={(e) =>
                handleTextChange(elements[1]?.id, e.target.value)
              }
            />
          </div>
        </div>
        <div className="w-full flex  flex-col  px-3">
          <div className="h-full flex  flex-col gap-3">
            <div>
              <h2 className="">Add Topics </h2>
              <p className="text-md font-thin"></p>
            </div>
            <div>
              <input
                className=" p-2 w-full border-b placeholder:text-sm  outline-none focus:border-black bg-inherit"
                type="text"
                placeholder="Add Topics ..."
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className=" flex justify-start items-center  gap-1">
              <h1>Author :</h1>
              <p>{user.username}</p>
            </div>
          </div>
          <div className="h-full flex px-5 gap-3 items-start">
            <button
              onClick={handeSubmit}
              className={`flex gap-2 ${
                mutation.isLoading ? "bg-orange-100 text-slate-400" : ""
              } bg-orange-300 px-4 py-2 rounded-lg`}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading && <Spinner className={" w-5 h-5"} />}
              {mutation.isLoading ? `Submitting...` : "Submit"}
            </button>

            <Link className=" bg-slate-200 px-4 py-2 rounded-lg" to={-1}>
              Cancel
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

export default PostPreviewEditor;
