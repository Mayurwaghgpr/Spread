import React from "react";

function ContentBoxSection({
  children,
  className = "max-w-[1000px]",
  headerClass = "text-5xl ",
  ...props
}) {
  return (
    <section
      className={`flex justify-center  w-full    items-center  ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

export default ContentBoxSection;
