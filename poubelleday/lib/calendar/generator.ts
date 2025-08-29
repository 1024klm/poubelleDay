import ical, { ICalCalendar, ICalEvent, ICalAlarmType, ICalEventBusyStatus, ICalEventTransparency } from 'ical-generator';
import { ExtractedEvent, ConversionConfig } from '@/types';
import { parse, format, subHours, setHours, setMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export class ICSGenerator {
  private calendar: ICalCalendar;
  private config: ConversionConfig;

  constructor(config: ConversionConfig) {
    this.config = config;
    this.calendar = ical({
      name: 'PoubelleDay - Calendrier de collecte des déchets',
      description: 'Calendrier automatique des jours de collecte des déchets',
      timezone: config.timezone,
      prodId: {
        company: 'PoubelleDay',
        product: 'Waste Collection Calendar',
        language: 'FR'
      }
    });
  }

  generate(events: ExtractedEvent[]): string {
    for (const event of events) {
      this.addEvent(event);
    }
    
    return this.calendar.toString();
  }

  private addEvent(event: ExtractedEvent) {
    const eventDate = parse(event.date, 'yyyy-MM-dd', new Date());
    const [hours, minutes] = event.time.split(':').map(Number);
    
    // Set the collection time
    let startDate = setHours(eventDate, hours);
    startDate = setMinutes(startDate, minutes);
    
    // Convert to the specified timezone
    const zonedDate = toZonedTime(startDate, this.config.timezone);
    
    const calEvent: ICalEvent = this.calendar.createEvent({
      start: zonedDate,
      end: new Date(zonedDate.getTime() + 30 * 60 * 1000), // 30 minutes duration
      summary: `${event.label}`,
      description: `Collecte ${event.label}.\nSortir les bacs la veille au soir.`,
      categories: [{ name: event.type }],
      busystatus: ICalEventBusyStatus.FREE,
      transparency: ICalEventTransparency.TRANSPARENT
    });

    // Add custom properties for color
    calEvent.x('APPLE-TRAVEL-ADVISORY-BEHAVIOR', 'AUTOMATIC');
    calEvent.x('COLOR', event.color);
    
    // Add reminders based on configuration
    if (this.config.reminders.evening) {
      const [eveningHour, eveningMinute] = this.config.reminders.eveningTime.split(':').map(Number);
      const reminderTime = new Date(zonedDate);
      reminderTime.setDate(reminderTime.getDate() - 1);
      reminderTime.setHours(eveningHour, eveningMinute);
      
      const hoursBeforeEvent = Math.floor(
        (zonedDate.getTime() - reminderTime.getTime()) / (1000 * 60 * 60)
      );
      
      calEvent.createAlarm({
        type: ICalAlarmType.display,
        trigger: -hoursBeforeEvent * 60 * 60, // In seconds
        description: `Sortir les poubelles ${event.label} ce soir`
      });
    }
    
    if (this.config.reminders.morning) {
      const [morningHour, morningMinute] = this.config.reminders.morningTime.split(':').map(Number);
      const morningReminder = new Date(zonedDate);
      morningReminder.setHours(morningHour, morningMinute);
      
      if (morningReminder < zonedDate) {
        const minutesBeforeEvent = Math.floor(
          (zonedDate.getTime() - morningReminder.getTime()) / (1000 * 60)
        );
        
        calEvent.createAlarm({
          type: ICalAlarmType.display,
          trigger: -minutesBeforeEvent * 60, // In seconds
          description: `Collecte ${event.label} dans 1 heure`
        });
      }
    }
    
    // Handle recurrence if specified
    if (event.recurrence) {
      const repeating: any = {
        freq: event.recurrence.frequency
      };
      
      if (event.recurrence.interval) {
        repeating.interval = event.recurrence.interval;
      }
      
      if (event.recurrence.byweekday) {
        repeating.byDay = event.recurrence.byweekday.map(day => {
          const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
          return days[day];
        });
      }
      
      if (event.recurrence.bymonthday) {
        repeating.byMonthDay = event.recurrence.bymonthday;
      }
      
      if (event.recurrence.count) {
        repeating.count = event.recurrence.count;
      }
      
      if (event.recurrence.until) {
        repeating.until = new Date(event.recurrence.until);
      }
      
      calEvent.repeating(repeating);
    }
  }

  getBuffer(): Buffer {
    return Buffer.from(this.calendar.toString(), 'utf-8');
  }
}