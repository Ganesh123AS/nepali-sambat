import React, { useState, useRef, useEffect } from "react";
import { formatDate } from "../utils/inputFormat";
import { isValidBsDate } from "../utils/convertor";
import type { DateInputProps } from "../types/types";

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  formatOptions = { format: "YYYY-MM-DD" },
  onFocus,
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value ? formatDate(value, formatOptions) : ""
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && isValidBsDate(value)) {
      setInputValue(formatDate(value, formatOptions));
    } else if (value === null) {
      setInputValue("");
    }
  }, [value, formatOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: "1rem",
    borderRadius: 4,
    border: "1px solid #ccc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    ...(disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}),
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      style={inputStyle}
    />
  );
};

export default DateInput;
