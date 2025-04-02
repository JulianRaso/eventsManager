export default function InputProfile({title, inputValue, required}){
    return(
        <div className="border-t-1 p-4 flex flex-col gap-2">
            <p>{title}</p>
            <input placeholder={`Ingrese su ${title}`} defaultValue={inputValue} required={required} className="w-full rounded-lg p-2 border" />
        </div>
    )
}