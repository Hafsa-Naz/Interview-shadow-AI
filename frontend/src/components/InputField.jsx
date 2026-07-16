function InputField({
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
      w-full
      p-4
      rounded-xl
      bg-slate-800
      border
      border-gray-700
      text-white
      outline-none
      focus:border-purple-500
      transition"
    />
  );
}

export default InputField;