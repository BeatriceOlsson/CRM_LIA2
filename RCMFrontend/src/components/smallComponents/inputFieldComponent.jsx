export function InputFieldComponent({
  type,
  name,
  value,
  placeholder,
  onSubmit,
}) {
  return (
    <div className="m-2">
      <input
        className="border-1 border-black rounded-md"
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onSubmit={onSubmit}
      />
    </div>
  );
}
