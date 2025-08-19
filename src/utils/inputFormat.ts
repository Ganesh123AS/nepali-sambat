import type { CustomDate, CustomDateFormatOptions } from "../types/types";
import { nepaliLetters } from "../constants/daysMonths";
import { bsMonthsEng, bsMonthsNep } from "../constants/daysMonths";

export function formatDate(
  date: CustomDate,
  options: CustomDateFormatOptions = {},
): string {
  const { format = "YYYY-MM-DD", lang = "nep", separator = "-" } = options;

  if (!date) return "";

  const { year, month, day } = date;

  const yearStr = year.toString();
  const monthStr = month < 10 ? `0${month}` : month.toString();
  const dayStr = day < 10 ? `0${day}` : day.toString();

  let formatted = format
    .replace("YYYY", yearStr)
    .replace("MM", monthStr)
    .replace("DD", dayStr)
    .replace("M", month.toString())
    .replace("D", day.toString());
  if (format.includes("MMMM")) {
    const monthNames = lang === "nep" ? bsMonthsNep : bsMonthsEng;
    formatted = formatted.replace("MMMM", monthNames[month - 1]);
  }
  if (lang === "nep") {
    formatted = formatted
      .split("")
      .map((char) => {
        if (char >= "0" && char <= "9") {
          return nepaliLetters[parseInt(char)];
        }
        return char;
      })
      .join("");
  }
  if (
    separator !== "-" &&
    (format === "YYYY-MM-DD" || format === "DD-MM-YYYY")
  ) {
    formatted = formatted.replace(/-/g, separator);
  }
  return formatted;
}
export function parseDate(
  dateStr: string,
  format = "YYYY-MM-DD",
): CustomDate | null {
  try {
    if (format === "YYYY-MM-DD") {
      const [yearStr, monthStr, dayStr] = dateStr.split("-");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10),
      };
    }

    if (format === "DD-MM-YYYY") {
      const [dayStr, monthStr, yearStr] = dateStr.split("-");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10),
      };
    }

    if (format === "MM/DD/YYYY") {
      const [monthStr, dayStr, yearStr] = dateStr.split("/");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10),
      };
    }

    if (format === "YYYY/MM/DD") {
      const [yearStr, monthStr, dayStr] = dateStr.split("/");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}
