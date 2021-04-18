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
  errorMessage,
}) => {
  return (
    <div className="TextAreaField form-group">
      {label ? <label htmlFor={name}>{label}</label> : null}
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
        {errorMessage ? <p className="error">{errorMessage}</p> : null}
      </>
    </div>
  );
};
