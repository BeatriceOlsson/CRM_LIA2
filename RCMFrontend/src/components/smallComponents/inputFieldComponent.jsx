export function InputFieldComponent({
  type,
  name,
  value,
  placeholder,
  onChange,
  onSubmit,
  className,
  labelText,
}) {
  return (
    <div className={className}>
      <div>
        <label className="text-lg">{labelText}</label>
      </div>
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
