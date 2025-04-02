interface InputProps {
  value: string;
  name?: string;
  type?: string;
  min?: number;
  max?: number;
  defaultValue?: string;
}

export default function Input({
  value,
  name,
  type,
  defaultValue,
  min,
  max,
}: InputProps) {
  return (
    <input
      name={name}
      type={type}
      min={min}
      max={max}
      placeholder={value}
      className="border-1 rounded-xl p-2"
      defaultValue={defaultValue}
    />
  );
}
