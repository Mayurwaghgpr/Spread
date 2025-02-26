import React, { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setElements } from "../../../redux/slices/postSlice";
import { setToast } from "../../../redux/slices/uiSlice";
import { useMutation, useQueryClient } from "react-query";
import PostsApis from "../../../Apis/PostsApis";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Spinner from "../../../component/loaders/Spinner";
import { createPortal } from "react-dom";

const DEFAULT_ELEMENT = { type: "text", data: "", id: uuidv4(), index: 0 };

function PostPreviewEditor() {
  const [imageFiles, setImageFiles, handleTextChange] = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Topic, setTopic] = useState();
  const { elements } = useSelector((state) => state.posts);

  const { user } = useSelector((state) => state.auth);
  const { AddNewPost } = PostsApis();
  const queryClient = useQueryClient();

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

  const handeSubmit = useCallback(
    (e) => {
      // console.log(elements);
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
      console.log(formData);
      if (e === "fetch") {
        mutation.mutate(formData);
      }
    },
    [Topic]
  );

  const imageElements = elements?.filter((el) => el.type === "image");

  return createPortal(
    <main className=" fixed top-0 right-0 z-50 bg-white px-10  dark:bg-black w-full flex justify-center min-h-screen h-full flex-col gap-10 m-auto items-center overflow-y-auto">
      <div className="w-full  text-center ">
        <Link className=" absolute right-5 text-xl top-5" to={-1}>
          <i className="bi bi-x-lg"></i>
        </Link>
        <hgroup>
          <h1 className="text-xl">Define your Preview</h1>
          <p className="text-[.6rem] sm:text-lg px-10  dark:text-white  text-black dark:opacity-50 text-opacity-20">
            Define your posts preview and Add topice to know whats your post
            content about
          </p>
        </hgroup>
      </div>

      <article className="  w-full max-w-[60rem] flex sm:flex-row flex-col sm:gap-5 justify-center items-center  ">
        <div className="w-full flex flex-col justify-center items-start bg-inherit">
          <h1 className="">Post Preview</h1>
          <div className="flex justify-center items-center bg-inherit">
            <label
              className="relative flex max-h-[10rem] w-full  sm:max-h-[20rem] h-full"
              htmlFor="titleimage"
            >
              {imageElements?.length ? (
                <img
                  className=" object-fill object-top "
                  src={imageElements[0]?.file}
                  alt="title image"
                  loading="lazy"
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
        </div>
        <div className=" w-full flex my-7 gap-5 flex-col">
          <div className="w-full h-full gap-6  flex flex-col justify-start items-center ">
            <div className="w-full">
              <label htmlFor="title">Title</label>
              <input
                className=" p-2 w-full border rounded-md placeholder:text-sm  outline-none focus:border-black bg-inherit"
                type="text"
                name="title"
                defaultValue={elements[0]?.data}
                title=""
                placeholder="Write Preview title"
                onChange={(e) =>
                  handleTextChange(elements[0]?.id, e.target.value)
                }
              />
            </div>

            <div className="w-full">
              <label htmlFor="subtitle">Subetitle</label>
              <input
                className=" p-2 w-full border rounded-md placeholder:text-sm  outline-none focus:border-black bg-inherit"
                type="text"
                name="subtitle"
                defaultValue={elements[1]?.data}
                placeholder=" Write Preview Subtitle"
                onChange={(e) =>
                  handleTextChange(elements[1]?.id, e.target.value)
                }
              />
            </div>

            <div className=" w-full">
              <label htmlFor="Topics">Topic</label>
              <input
                className=" p-2 w-full border rounded-md placeholder:text-sm  outline-none focus:border-black bg-inherit"
                type="text"
                placeholder="Add Topics..."
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>
          <div className="h-full flex gap-3 items-start">
            <button
              onClick={() => handeSubmit("fetch")}
              className={`flex gap-2 ${
                mutation.isLoading && "bg-sky-100 "
              } dark:bg-sky-400 bg-sky-400  px-4 py-2 rounded-lg`}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading && <Spinner className={" w-5 h-5"} />}
              {mutation.isLoading ? `Submitting...` : "Submit"}
            </button>

            <Link className=" bg-slate-500 px-4 py-2 rounded-lg" to={-1}>
              Cancel
            </Link>
          </div>
        </div>
      </article>
    </main>,
    document.getElementById("portal")
  );
}

export default PostPreviewEditor;
