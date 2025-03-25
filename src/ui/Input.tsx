interface InputProps {
  value: string;
  type?: string;
  min?: number;
  max?: number;
  defaultValue?: string;
}

export default function Input({
  value,
  type,
  defaultValue,
  min,
  max,
}: InputProps) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      placeholder={value}
      className="border-1 rounded-xl p-2"
      defaultValue={defaultValue}
    />
  );
}
