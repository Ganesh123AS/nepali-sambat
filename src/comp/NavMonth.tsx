import React, { useState } from "react";
import { bsMonthsEng, bsMonthsNep } from "../constants/daysMonths";
import { addMonths } from "../utils/convertor";
import type { MonthNavigationProps } from "../types/types";
import DynamicIcons from "./DynamicIcons";
import { toNepaliLetters } from "../constants/daysMonths";

export const NavMonth: React.FC<MonthNavigationProps> = ({
  viewDate,
  onViewDateChange,
  lang = "nep",
  icon = '',
}) => {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const monthNames = lang === "nep" ? bsMonthsNep : bsMonthsEng;

  const handlePrevMonth = () => {
    onViewDateChange(addMonths(viewDate, -1));
  };

  const handleNextMonth = () => {
    onViewDateChange(addMonths(viewDate, 1));
  };

  const handleYearSelect = (year: number) => {
    onViewDateChange({ ...viewDate, year });
    setShowYearDropdown(false);
  };

  const handleMonthSelect = (month: number) => {
    onViewDateChange({ ...viewDate, month });
    setShowMonthDropdown(false);
  };

  const yearOptions = Array.from({ length: 130 }, (_, i) => 1970 + i);

  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={handlePrevMonth}
        aria-label="Previous month"
        style={navButtonStyle}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = "#d1d5db")}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        {icon ? icon : <DynamicIcons type={'left'} />}
      </button>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          style={dropdownButtonStyle}
        >
          {monthNames[viewDate.month - 1]}
        </button>

        {showMonthDropdown && (
          <div style={dropdownListStyle}>
            {monthNames.map((month, index) => (
              <div
                key={month}
                onClick={() => handleMonthSelect(index + 1)}
                style={{
                  ...dropdownItemBaseStyle,
                  ...(viewDate.month === index + 1
                    ? dropdownItemSelectedStyle
                    : {}),
                }}
              >
                {month}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setShowYearDropdown(!showYearDropdown)}
          style={dropdownButtonStyle}
        >
          {lang === "nep" ? toNepaliLetters(viewDate.year) : viewDate.year}
        </button>

        {showYearDropdown && (
          <div style={dropdownListStyle}>
            {yearOptions.map((year) => (
              <div
                key={year}
                onClick={() => handleYearSelect(year)}
                style={{
                  ...dropdownItemBaseStyle,
                  ...(viewDate.year === year ? dropdownItemSelectedStyle : {}),
                }}
              >
                {lang === "nep" ? toNepaliLetters(year) : year}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleNextMonth}
        aria-label="Next month"
        style={navButtonStyle}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = "#d1d5db")}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        {icon ? icon : <DynamicIcons type={'right'} />}
      </button>
    </div>
  );
};

export default NavMonth;

// styles
const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 8,
  borderBottom: "1px solid #d1d5db",
};

const buttonBaseStyle: React.CSSProperties = {
  padding: 4,
  borderRadius: 6,
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const navButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  transition: "background-color 0.2s ease",
};

const dropdownButtonStyle: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 6,
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontWeight: 500,
  userSelect: "none",
  position: "relative",
};

const dropdownListStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 1000,
  marginTop: 4,
  minWidth: "max-content",
  maxHeight: 240,
  overflowY: "auto",
  backgroundColor: "white",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
  borderRadius: 6,
  paddingTop: 4,
  paddingBottom: 4,
  fontSize: 14,
};

const dropdownItemBaseStyle: React.CSSProperties = {
  padding: "8px 12px",
  cursor: "pointer",
  userSelect: "none",
};

const dropdownItemSelectedStyle: React.CSSProperties = {
  backgroundColor: "#3b82f6",
  color: "white",
};