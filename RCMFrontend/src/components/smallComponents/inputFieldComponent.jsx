export function InputFieldComponent({
  type,
  name,
  value,
  placeholder,
  onChange,
  onSubmit,
  className,
}) {
  return (
    <div className={className}>
      <input
        className="border-2 border-teal-400 rounded-md hover:bg-teal-100/75"
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
