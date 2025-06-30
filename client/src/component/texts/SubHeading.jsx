const SubHeading = ({ children, className }) => {
  return (
    <h2 className={`font-semibold opacity-50  ${className}`}>
      {children || ""}
    </h2>
  );
};

export default SubHeading;
