import React from "react";
import className from "classnames";

import "./TextAreaField.css";

export const TextAreaField = ({
  name,
  label,
  placeholder,
  disabled,
  isMultiline = false,
  onChange,
  value,
}) => {
  return (
    <div className="TextAreaField form-group">
      <label htmlFor={name}>{label}</label>
      <>
        <textarea
          id={name}
          disabled={disabled}
          placeholder={placeholder}
          cols={isMultiline ? "40" : undefined}
          rows={isMultiline ? "5" : undefined}
          multiple={isMultiline}
          type="text"
          className={className({
            "form-control": true,
          })}
          onChange={(e) => onChange(e.target.value)}
          value={value ? value : ""}
          autoComplete="nope"
        />
      </>
    </div>
  );
};
