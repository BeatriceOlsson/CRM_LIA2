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
        className="border-2 border-teal-400 rounded-md hover:bg-teal-100/75"
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onSubmit={onSubmit}
      />
    </div>
  );
}
