function CommenAuthBtn({ children, className, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`bg-oplight text-white dark:bg-white dark:text-black p-2 w-full rounded-full transition-opacity ${
        className
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export default CommenAuthBtn;
