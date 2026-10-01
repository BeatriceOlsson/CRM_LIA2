export function ButtonComponent({
  buttonClick,
  buttonText,
  type = "button",
  className = "",
  onMouseDown,
}) {
  return (
    <button
      onMouseDown={onMouseDown}
      onClick={buttonClick}
      type={type}
      className={`border-2 border-teal-400 bg-teal-100/25 hover:bg-teal-100/75 hover:text-amber-600 rounded-lg active:border-red-700 hover:underline active:text-red-700 w-32 h-10 ${className}`}
    >
      {buttonText}
    </button>
  );
}
