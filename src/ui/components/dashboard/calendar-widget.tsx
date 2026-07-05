'use client';

import { useState, useMemo } from 'react';

interface CalendarWidgetProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarWidget({ selectedDate, onDateSelect }: CalendarWidgetProps) {
  const today = new Date();
  
  const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(today));

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return date;
    });
  }, [currentWeekStart]);

  const goToPrevWeek = () => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentWeekStart(getMonday(today));
  };

  const dayLabels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400">SEMANA</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevWeek}
            className="text-slate-400 hover:text-white p-1"
          >
            &lt;
          </button>
          <button
            onClick={goToToday}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded"
          >
            Hoy
          </button>
          <button
            onClick={goToNextWeek}
            className="text-slate-400 hover:text-white p-1"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <button
              key={i}
              onClick={() => onDateSelect(date)}
              className={`p-2 rounded text-center text-xs ${
                isSelected 
                  ? 'bg-blue-600 text-white' 
                  : isToday 
                    ? 'bg-slate-700 text-slate-200' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <div>{dayLabels[i]}</div>
              <div className="font-bold mt-1">{date.getDate()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}