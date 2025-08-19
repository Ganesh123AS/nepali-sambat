export const bsMonthsEng = [
  "Baishakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const bsMonthsNep = [
  "बैशाख",
  "जेष्ठ",
  "आषाढ",
  "श्रावण",
  "भाद्र",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुन",
  "चैत्र",
];

export const bsDaysEng = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const bsDaysNep = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार",
];

export const bsDaysResEnp = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const bsDaysResNep = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
];

export const nepaliLetters = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
export function toNepaliLetters(num: number): string {
  return num
    .toString()
    .split("")
    .map((i) => {
      if (i >= "0" && i <= "9") {
        return nepaliLetters[parseInt(i)];
      }
      return i;
    })
    .join("");
}