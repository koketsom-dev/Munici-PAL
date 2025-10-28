import { useState } from "react";
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isSameDay } from "date-fns";

export default function Calendar({ onRangeSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const nextMonth = () => setCurrentMonth(addDays(monthEnd, 1));
  const prevMonth = () => setCurrentMonth(addDays(monthStart, -1));

  const onDateClick = (day) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: day, end: null });
    } else if (selectedRange.start && !selectedRange.end) {
      const newRange =
        day > selectedRange.start
          ? { start: selectedRange.start, end: day }
          : { start: day, end: selectedRange.start };
      setSelectedRange(newRange);
      onRangeSelect(newRange);
    }
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected =
          selectedRange.start && selectedRange.end
            ? day >= selectedRange.start && day <= selectedRange.end
            : isSameDay(day, selectedRange.start);

        days.push(
          <div
            key={day}
            className={`p-2 text-center rounded cursor-pointer border ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400 bg-gray-50"
                : isSelected
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
            }`}
            onClick={() => onDateClick(cloneDay)}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex justify-between mb-2">
        <button onClick={prevMonth} className="text-blue-600 font-bold">←</button>
        <h2 className="font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth} className="text-blue-600 font-bold">→</button>
      </div>
      <div className="grid grid-cols-7 text-xs font-semibold text-gray-600 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      {renderCells()}
    </div>
  );
}
