import React, { useState, useEffect } from 'react';

interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

interface BusinessHoursEditorProps {
  value?: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}

const BusinessHoursEditor: React.FC<BusinessHoursEditorProps> = ({ value, onChange }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [hours, setHours] = useState<BusinessHours>(
    value || {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '', close: '', closed: true },
    }
  );

  useEffect(() => {
    if (value) {
      setHours(value);
    }
  }, [value]);

  const updateDay = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    const newHours = {
      ...hours,
      [day]: {
        ...hours[day as keyof BusinessHours],
        [field]: value,
      },
    };
    setHours(newHours);
    onChange(newHours);
  };

  const copyToAll = (day: string) => {
    const sourceSchedule = hours[day as keyof BusinessHours];
    if (!sourceSchedule) return;

    const newHours = { ...hours };
    days.forEach(d => {
      newHours[d as keyof BusinessHours] = { ...sourceSchedule };
    });
    setHours(newHours);
    onChange(newHours);
  };

  const setWeekdayHours = () => {
    const newHours = { ...hours };
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
      newHours[day as keyof BusinessHours] = { open: '09:00', close: '17:00', closed: false };
    });
    setHours(newHours);
    onChange(newHours);
  };

  const setWeekendClosed = () => {
    const newHours = { ...hours };
    ['saturday', 'sunday'].forEach(day => {
      newHours[day as keyof BusinessHours] = { open: '', close: '', closed: true };
    });
    setHours(newHours);
    onChange(newHours);
  };

  const set24Hours = (day: string) => {
    updateDay(day, 'open', '00:00');
    updateDay(day, 'close', '23:59');
    updateDay(day, 'closed', false);
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
        <button
          type="button"
          onClick={setWeekdayHours}
          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Standard Weekdays (9-5)
        </button>
        <button
          type="button"
          onClick={setWeekendClosed}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Close Weekends
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {days.map((day, index) => {
          const schedule = hours[day as keyof BusinessHours];
          const isClosed = schedule?.closed ?? false;

          return (
            <div
              key={day}
              className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{dayLabels[index]}</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToAll(day)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Copy to all
                  </button>
                </div>
              </div>

              {/* Schedule Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Open Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={schedule?.open || ''}
                    onChange={(e) => updateDay(day, 'open', e.target.value)}
                    disabled={isClosed}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                {/* Close Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={schedule?.close || ''}
                    onChange={(e) => updateDay(day, 'close', e.target.value)}
                    disabled={isClosed}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                {/* Status Controls */}
                <div className="flex flex-col justify-end gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isClosed}
                      onChange={(e) => updateDay(day, 'closed', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Closed</span>
                  </label>
                  {!isClosed && (
                    <button
                      type="button"
                      onClick={() => set24Hours(day)}
                      className="text-xs text-blue-600 hover:text-blue-700 text-left"
                    >
                      Set 24 hours
                    </button>
                  )}
                </div>
              </div>

              {/* Display Summary */}
              {!isClosed && schedule?.open && schedule?.close && (
                <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded border border-gray-200">
                  <span className="font-medium">Hours: </span>
                  {schedule.open} - {schedule.close}
                </div>
              )}
              {isClosed && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
                  Closed all day
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <div className="flex gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold mb-1">Tips:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Use "Copy to all" to apply one day's hours to all days</li>
              <li>• Check "Closed" for days when business is not operating</li>
              <li>• Use 24-hour format (e.g., 09:00, 17:00)</li>
              <li>• You can set different hours for weekends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHoursEditor;