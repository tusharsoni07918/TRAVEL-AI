import { Itinerary } from '../types/itinerary';

/**
 * Generates an iCalendar (.ics) string and triggers a browser download.
 * Compatible with Google Calendar, Apple Calendar, Outlook, and mobile calendar apps.
 */
export function exportItineraryToIcs(itinerary: Itinerary, startDateStr: string): void {
  const sanitize = (text: string) => {
    return text.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
  };

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Base start date
  const baseDate = new Date(startDateStr || Date.now());
  if (isNaN(baseDate.getTime())) {
    baseDate.setTime(Date.now() + 86400000);
  }

  const formatIcsDate = (date: Date, hours: number, minutes: number = 0) => {
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const hh = pad(hours);
    const mm = pad(minutes);
    return `${y}${m}${d}T${hh}${mm}00`;
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TripGenie AI//Travel Planner Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${sanitize(`TripGenie: ${itinerary.destination} Trip`)}`,
    'X-WR-TIMEZONE:UTC',
  ];

  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  (itinerary.days || []).forEach((dayPlan, dayIdx) => {
    const dayDate = new Date(baseDate);
    dayDate.setDate(baseDate.getDate() + dayIdx);

    const slots = [
      { key: 'morning', label: 'Morning', startH: 9, endH: 12, data: dayPlan.morning },
      { key: 'afternoon', label: 'Afternoon', startH: 13, endH: 17, data: dayPlan.afternoon },
      { key: 'evening', label: 'Evening', startH: 18, endH: 21, data: dayPlan.evening },
    ];

    slots.forEach(slot => {
      if (!slot.data || !slot.data.activity) return;

      const uid = `tripgenie-${Date.now()}-${dayPlan.day}-${slot.key}@tripgenie.ai`;
      const startIso = formatIcsDate(dayDate, slot.startH, 0);
      const endIso = formatIcsDate(dayDate, slot.endH, 0);

      const title = `[Day ${dayPlan.day}] ${slot.data.activity}`;
      const description = `${slot.data.description || ''}\\n\\nDuration: ${slot.data.duration || '2 hours'}\\nEstimated Cost: ${itinerary.currency} ${slot.data.estimatedCost || 0}\\nPlanned by TripGenie AI (Gemma 4 31B)`;
      const location = `${slot.data.activity}, ${itinerary.destination}`;

      lines.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART:${startIso}`,
        `DTEND:${endIso}`,
        `SUMMARY:${sanitize(title)}`,
        `DESCRIPTION:${sanitize(description)}`,
        `LOCATION:${sanitize(location)}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT30M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${sanitize(title)} starts in 30 minutes`,
        'END:VALARM',
        'END:VEVENT'
      );
    });
  });

  lines.push('END:VCALENDAR');

  const icsContent = lines.join('\r\n');
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${itinerary.destination.toLowerCase().replace(/\s+/g, '_')}_tripgenie_itinerary.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
