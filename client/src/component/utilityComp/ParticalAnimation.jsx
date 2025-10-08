function ParticalAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden ">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-[1.5px] h-[1.5px] rounded-full animate-ping bg-white dark:bg-gradient-to-br dark:from-sky-300 dark:to-amber-200  z-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        ></div>
      ))}
    </div>
  );
}

export default ParticalAnimation;
