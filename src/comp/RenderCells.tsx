import React, { FC } from 'react';

type RenderCellsProps = {
  year: number;
  month: number;
  getDays: (year: number, month: number) => number;
  startDay: number;
  totalDays: number;
  selectedDay: number | null;
  isDaySelectable: (day: number) => boolean;
  onDayClick: (day: number) => void;
};

const RenderCells: FC<RenderCellsProps> = ({
  year,
  month,
  getDays,
  startDay,
  totalDays,
  selectedDay,
  isDaySelectable,
  onDayClick,
}) => {
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear -= 1;
  }
  const prevMonthDays = getDays(prevYear, prevMonth);

  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  const cells = [];

  // Previous month filler
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells.push(
      <div key={`prev-${day}`} className="calendar-day-cell disabled other-month">
        <p>{day}</p>
      </div>
    );
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const isSelectable = isDaySelectable(day);
    const weekdayIndex = (startDay + day - 1) % 7;
    const isSaturday = weekdayIndex === 6;

    cells.push(
      <div
        key={`curr-${day}`}
        className={`calendar-day-cell ${selectedDay === day ? 'selected' : ''} ${!isSelectable ? 'disabled' : ''} ${isSaturday ? 'saturday' : ''}`}
        onClick={() => {
          if (isSelectable) onDayClick(day);
        }}
      >
        <p>{day}</p>
      </div>
    );
  }

  // Next month filler
  const totalGrid = 42;
  const remaining = totalGrid - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push(
      <div key={`next-${i}`} className="calendar-day-cell disabled other-month">
        <p>{i}</p>
      </div>
    );
  }

  return <>{cells}</>;
};

export default RenderCells;
