import "./InputComponent.css"
export default function InputField({ label, value, setValue, type = "text" ,placeholder})
 {
  return (
    <div className="FieldStyle">
      <label className="LabelStyle">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
