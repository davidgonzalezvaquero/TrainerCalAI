'use client';

interface CalendarWidgetProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarWidget({ selectedDate, onDateSelect }: CalendarWidgetProps) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const today = new Date();
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset + i);
    return targetDate;
  });

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-3">HISTORIAL - ÚLTIMOS 7 DÍAS</h3>
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
              <div>{days[date.getDay()]}</div>
              <div className="font-bold mt-1">{date.getDate()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}