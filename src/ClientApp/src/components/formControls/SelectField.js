import React, { useState, useRef } from "react";
import useOnClickOutside from "use-onclickoutside";
import className from "classnames";

import "./SelectField.css";

export const SelectField = ({
  name,
  label,
  value,
  placeholder,
  options,
  disabled,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState();
  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOpen(false));
  return (
    <div className="SelectField form-group">
      {label ? <label htmlFor={name}>{label}</label> : null}
      <div className="dropdown" ref={ref}>
        <button
          className={className({
            "btn btn-primary dropdown-toggle": true,
          })}
          type="button"
          id="modelSelectButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {value ? value.label : placeholder}
        </button>
        <div
          className={className({ "dropdown-menu": true, show: isOpen })}
          aria-labelledby="modelSelectButton"
        >
          {options.map((option) => (
            <button
              key={option.value}
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                onChange(option);
                setIsOpen(!isOpen);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
