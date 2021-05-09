import './RangeField.css'

export const RangeField = ({
  name,
  label,
  value,
  disabled,
  onChange,
  min,
  max,
}) => {
  return (
    <div className="RangeField form-group flex flex-column">
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        id={name}
        value={value}
        disabled={disabled}
        type="range"
        className="form-control-range"
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
      ></input>
    </div>
  );
};
