const Divider = ({
  text = "or",
  className = "",
  textClassName = "",
  lineClassName = "",
}) => {
  return (
    <div
      className={`w-full text-center text-xl flex items-center ${className}`}
    >
      <hr className={`flex-1 border-inherit ${lineClassName}`} />
      <p className={`mx-2 ${textClassName}`}>{text}</p>
      <hr className={`flex-1 border-inherit ${lineClassName}`} />
    </div>
  );
};

export default Divider;
