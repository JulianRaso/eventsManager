interface inputProps {
  title: string;
  inputValue: string;
  required: boolean;
  disabled: boolean;
}

export default function InputProfile({
  title,
  inputValue,
  required,
  disabled,
}: inputProps) {
  return (
    <div className="border-t-1 p-4 flex flex-col gap-2">
      <p>{title}</p>
      <input
        placeholder={`Ingrese su ${title}`}
        defaultValue={inputValue}
        required={required}
        className="w-full rounded-lg p-2 border"
        disabled={disabled}
      />
    </div>
  );
}
