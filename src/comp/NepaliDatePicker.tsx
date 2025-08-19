import React, { useState, useRef, useEffect } from "react";
import type { DatePickerProps, CustomDate } from "../types/types";
import { getTodayBS, isValidBsDate } from "../utils/convertor";
import { parseDate } from "../utils/inputFormat";
import Calendar from "./NepaliCalendar";
import DateInput from "./DateInput";
import DynamicIcons from "./DynamicIcons";

export const NepaliDatePicker: React.FC<DatePickerProps> = ({
    value,
    className,
    onChange,
    placeholder = "YYYY-MM-DD",
    disabled = false,
    minDate,
    maxDate,
    formatOptions = { format: "YYYY-MM-DD" },
    position = "bottom",
    icon = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState<CustomDate>(value || getTodayBS());
    const [selectedDate, setSelectedDate] = useState<CustomDate | null>(
        value || null
    );
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setSelectedDate(value);
            setViewDate(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDateSelect = (date: CustomDate) => {
        setSelectedDate(date);
        setIsOpen(false);

        if (onChange) {
            onChange(date);
        }
    };

    const handleInputFocus = () => {
        if (!disabled) {
            setIsOpen(true);
        }
    };

    const handleInputChange = (value: string) => {
        const date = parseDate(value, formatOptions.format);

        if (date && isValidBsDate(date)) {
            setSelectedDate(date);
            setViewDate(date);

            if (onChange) {
                onChange(date);
            }
        }
    };

    const calendarPositionStyle: React.CSSProperties =
        position === "top"
            ? {
                width: "100%",
                bottom: "100%",
                marginBottom: 4,
                position: "absolute",
                backgroundColor: "white",
                borderRadius: 8,
                boxShadow:
                    "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
                zIndex: 1000,
            }
            : {
                width: "100%",
                top: "100%",
                marginTop: 4,
                position: "absolute",
                backgroundColor: "white",
                borderRadius: 8,
                boxShadow:
                    "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
                zIndex: 1000,
            };

    const containerStyle: React.CSSProperties = {
        width: "fit-content",
        position: "relative",
        display: "inline-block",
    };
    const inputWrapperStyle: React.CSSProperties = {
        position: "relative",
    };
    const buttonStyle: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        right: 12,
        transform: "translateY(-50%)",
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: disabled ? "#9ca3af" : "#4b5563",
        opacity: disabled ? 0.5 : 1,
    };

    return (
        <div style={{ ...containerStyle, ...className }}>
            <div style={inputWrapperStyle}>
                <DateInput
                    value={selectedDate}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    formatOptions={formatOptions}
                />
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    style={buttonStyle}
                    disabled={disabled}
                    aria-label="Toggle calendar"
                >
                    {icon ? icon : <DynamicIcons type={'calendar'} />}
                </button>
            </div>

            {isOpen && (
                <div style={calendarPositionStyle}>
                    <Calendar
                        selectedDate={selectedDate}
                        viewDate={viewDate}
                        onDateSelect={handleDateSelect}
                        onViewDateChange={setViewDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        lang={formatOptions.lang}
                        className={className}
                    />
                </div>
            )}
        </div>
    );
};

export default NepaliDatePicker;
