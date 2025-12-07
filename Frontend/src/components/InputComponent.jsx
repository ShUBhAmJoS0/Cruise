import "./InputComponent.css"
export default function InputField({ label, value, setValue, type = "text" ,placeholder})
 {
  return (
    <div className="flex flex-col">
      <label className="text-black mt-5 mb-2.5">{label}</label>
      <input className="w-[480px] h-[60px] border border-black rounded-md p-4"
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
