import React, { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CompactCalendar = ({ events = [], onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-[10px] font-bold text-center text-zinc-400 uppercase py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const hasEvent = events.some(event => isSameDay(parseISO(event.date), cloneDay));
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-10 w-full flex items-center justify-center text-xs font-medium cursor-pointer transition-all rounded-lg m-0.5",
              !isCurrentMonth ? "text-zinc-300 pointer-events-none" : "text-zinc-600 hover:bg-zinc-50",
              isSelected ? "bg-zinc-900 text-white hover:bg-zinc-900 shadow-lg shadow-zinc-200" : "",
              hasEvent && !isSelected ? "after:content-[''] after:absolute after:bottom-1.5 after:w-1 after:h-1 after:bg-primary after:rounded-full" : ""
            )}
            onClick={() => isCurrentMonth && onDateSelect(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="px-2 pb-4">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden select-none">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CompactCalendar;
