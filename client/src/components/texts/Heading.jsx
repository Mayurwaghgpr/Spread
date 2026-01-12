const Heading = ({ children, className }) => {
  return <h1 className={`font-bold  ${className}`}>{children || ""}</h1>;
};

export default Heading;
