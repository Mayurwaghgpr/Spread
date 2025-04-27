// Component that accepts props for configuration
const ImageFigure = ({
  imageUrl,
  caption,
  altText,
  objectFit = "cover",
  className = "",
  imageClassName = "",
  captionClassName = "",
}) => {
  return (
    <figure className={`w-full ${className}`}>
      <img
        className={`w-full object-${objectFit} object-center ${imageClassName}`}
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
