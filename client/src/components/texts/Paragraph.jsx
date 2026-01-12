const Paragraph = ({ children, className }) => {
  return (
    <p className={` leading-relaxed opacity-50 ${className} `}>{children}</p>
  );
};

export default Paragraph;
