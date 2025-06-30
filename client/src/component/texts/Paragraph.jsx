const Paragraph = ({ children, className }) => {
  return (
    <p className={`text-base leading-relaxed text-gray-700 ${className} `}>
      {children}
    </p>
  );
};

export default Paragraph;
