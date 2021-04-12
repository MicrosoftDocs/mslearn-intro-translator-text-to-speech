import React from "react";
import className from "classnames";

export const TextInput = ({
  name,
  label,
  placeholder,
  disabled,
  isMultiline = false,
  onChange,
  value,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <>
        <input
          id={name}
          disabled={disabled}
          placeholder={placeholder}
          multiple={isMultiline}
          type="text"
          className={className({
            "form-control": true,
          })}
          onChange={(e) => onChange(e.target.value)}
          value={value ? value : ""}
        />
      </>
    </div>
  );
};
