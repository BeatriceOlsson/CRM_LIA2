export function BigPopUpp({ isOpen = true, title, content }) {
  return (
    <div
      className={`flex justify-center items-center fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`flex justify-center items-center flex-col  bg-white border-2 border-gray-700 w-[90vw] h-[90vh] rounded-lg`}
      >
        <h2 className=" text-2xl font-bold">{title}</h2>
        <div>{content}</div>
      </div>
    </div>
  );
}
