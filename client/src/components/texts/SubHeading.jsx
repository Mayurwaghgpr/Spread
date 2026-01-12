const SubHeading = ({ children, className }) => {
  return (
    <h2 className={`font-medium opacity-50  ${className}`}>{children || ""}</h2>
  );
};

export default SubHeading;
