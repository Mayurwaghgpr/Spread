const Heading = ({ children, className }) => {
  return (
    <h1 className={`font-bold text-gray-900 ${className}`}>{children || ""}</h1>
  );
};

export default Heading;
