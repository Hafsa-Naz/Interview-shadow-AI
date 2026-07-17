function Button({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        bg-purple-600
        hover:bg-purple-700
        transition-all
        duration-300
        text-white
        font-semibold
        px-6
        py-3
        rounded-xl
        shadow-lg
        hover:scale-105
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;