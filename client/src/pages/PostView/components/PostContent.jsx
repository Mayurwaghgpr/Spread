import { lazy, memo } from "react";
import ImageFigure from "../../../component/utilityComp/ImageFigure";
import DOMPurify from "dompurify";
// Lazy loaded components
const CopyToClipboardInput = lazy(
  () => import("../../../component/CopyToClipboardInput")
);

const PostContent = memo(({ postContent, onImageClick }) => {
  return (
    <>
      {postContent?.map((item) => (
        <section
          key={item.id}
          className=" w-full border-inherit sm:text-base text-xs"
        >
          {item.type === "image" && item.content && (
            <ImageFigure
              onClick={() => onImageClick(item.content)}
              imageUrl={item.content}
              altText="Post content image"
              caption={item.title}
            />
          )}
          {item?.type === "text" ? (
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.content),
              }}
              className="w-full"
            />
          ) : (
            item?.type !== "text" &&
            item?.type !== "image" && <CopyToClipboardInput item={item} />
          )}
        </section>
      ))}
    </>
  );
});

export default PostContent;
