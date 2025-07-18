// Component that accepts props for configuration
const ImageFigure = ({
  imageUrl,
  caption,
  altText,
  objectFit = "cover",
  className = "",
  imageClassName = "",
  captionClassName = "",
  ...props
}) => {
  return (
    <figure className={`w-full ${className}`}>
      <img
        {...props}
        className={`w-full  ${imageClassName}`}
        src={imageUrl}
        alt={altText}
        loading="lazy"
      />
      {caption && (
        <figcaption className={captionClassName}>{caption}</figcaption>
      )}
    </figure>
  );
};

export default ImageFigure;
