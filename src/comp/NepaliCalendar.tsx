import React, { useState } from "react";
import type { CustomDate, CalendarProps } from "../types/types";
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    isDateInRange,
    compareDates,
    getTodayBS,
} from "../utils/convertor";
import {
    bsDaysResEnp,
    bsDaysResNep,
} from "../constants/daysMonths";
import MonthNavigation from "./NavMonth";
import { toNepaliLetters } from "../constants/daysMonths";

export const NepaliCalendar: React.FC<CalendarProps> = ({
    lang = "nep",
    selectedDate,
    viewDate,
    onDateSelect,
    onViewDateChange,
    minDate,
    maxDate,
}) => {
    const firstDayOfMonth = getFirstDayOfMonth(viewDate.year, viewDate.month);
    const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const generateCalendarDays = () => {
        const days = [];
        const dayNames = lang === "nep" ? bsDaysResNep : bsDaysResEnp;
        days.push(
            <div key="day-names" style={dayNamesContainerStyle}>
                {dayNames.map((day, index) => (
                    <div key={`day-name-${index}`} style={{ ...dayNameStyle, color: index === dayNames.length - 1 ? "darkred" : "#000", }}>
                        {day}
                    </div>
                ))}
            </div>
        );

        const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

        const cells = [];
        for (let i = 0; i < totalCells; i++) {
            const dayOfMonth = i - firstDayOfMonth + 1;
            const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= daysInMonth;

            if (isCurrentMonth) {
                const date: CustomDate = {
                    year: viewDate.year,
                    month: viewDate.month,
                    day: dayOfMonth,
                };

                const isSelected = selectedDate && compareDates(selectedDate, date) === 0;
                const isToday = compareDates(date, getTodayBS()) === 0;
                const isInRange = isDateInRange(date, minDate, maxDate);
                let buttonStyle: React.CSSProperties = normalDayStyle;
                if (!isInRange) {
                    buttonStyle = disabledDayStyle;
                } else if (isSelected) {
                    buttonStyle = selectedDayStyle;
                } else if (isToday) {
                    buttonStyle = todayStyle;
                }
                if (
                    isInRange &&
                    !isSelected &&
                    hoveredIndex === i
                ) {
                    buttonStyle = { ...buttonStyle, ...hoverStyle };
                }
                const dayOfWeek = i % 7;
                if (dayOfWeek === 6) {
                    buttonStyle = {
                        ...buttonStyle,
                        color: "darkred",
                    }
                }
                cells.push(
                    <button
                        key={`day-${i}`}
                        type="button"
                        disabled={!isInRange}
                        onClick={() => isInRange && onDateSelect(date)}
                        aria-selected={isSelected ? "true" : "false"}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}

                    >
                        {lang === "nep" ? toNepaliLetters(dayOfMonth) : dayOfMonth}
                    </button>
                );
            } else {
                cells.push(<div key={`empty-${i}`} style={emptyCellStyle} />);
            }
        }

        const weeks = [];
        for (let i = 0; i < cells.length; i += 7) {
            weeks.push(
                <div key={`week-${i}`} style={weekRowStyle}>
                    {cells.slice(i, i + 7)}
                </div>
            );
        }
        days.push(
            <div key="calendar-grid" style={calendarGridStyle}>
                {weeks}
            </div>
        );
        return days;
    };

    return (
        <div style={calendarContainerStyle}>
            <MonthNavigation
                viewDate={viewDate}
                onViewDateChange={onViewDateChange}
                lang={lang}
            />
            <div style={calendarPaddingStyle}>{generateCalendarDays()}</div>
        </div>
    );
};

export default NepaliCalendar;


// styles
const calendarContainerStyle: React.CSSProperties = {
    display: "block",
};

const dayNamesContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginBottom: 4,
};

const dayNameStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "14px",
    userSelect: "none",
};

const emptyCellStyle: React.CSSProperties = {
    height: 32,
    width: 32,
};

const weekRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 4,
};

const calendarGridStyle: React.CSSProperties = {
    marginTop: 8,
    rowGap: 4,
};

const calendarPaddingStyle: React.CSSProperties = {
    padding: 12,
};

const baseDayButtonStyle: React.CSSProperties = {
    height: 32,
    width: 32,
    border: "none",
    backgroundColor: "transparent",
    fontSize: 14,
    textAlign: "center",
    lineHeight: "32px",
    borderRadius: 6,
    userSelect: "none",
    outline: "none",
    padding: 0,
    margin: 0,
};

const selectedDayStyle: React.CSSProperties = {
    ...baseDayButtonStyle,
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
};

const todayStyle: React.CSSProperties = {
    ...baseDayButtonStyle,
    border: "2px solid #2563eb",
    fontWeight: "bold",
    cursor: "pointer",
};

const normalDayStyle: React.CSSProperties = {
    ...baseDayButtonStyle,
    color: "#000",
    cursor: "default",
};

const disabledDayStyle: React.CSSProperties = {
    ...baseDayButtonStyle,
    color: "#9ca3af",
    cursor: "not-allowed",
};

const hoverStyle: React.CSSProperties = {
    backgroundColor: "#d1d5db",
    cursor: "pointer",
};