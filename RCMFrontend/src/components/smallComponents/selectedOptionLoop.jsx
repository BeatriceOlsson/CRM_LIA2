export function SelectedOptionLoop({
  value,
  text,
  onChange,
  name,
  arrayList,
  className,
  labelText,
}) {
  return (
    <div>
      <div>
        <label className="text-lg">{labelText}</label>
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-46 border-2 rounded-lg border-teal-400 ${className}`}
      >
        <option value="">{text}</option>

        {arrayList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
