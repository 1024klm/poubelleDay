import { ExtractedEvent, WasteType } from '@/types';
import { PDF_PARSING_KEYWORDS, WASTE_TYPES } from '@/lib/constants';
import { format, isValid, addMonths, setDay } from 'date-fns';
import { parsePDF } from './pdf-parse-wrapper';

export class PDFParser {
  private currentYear: number;
  private text: string = '';
  private events: ExtractedEvent[] = [];

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  async parse(buffer: Buffer): Promise<ExtractedEvent[]> {
    try {
      const data = await parsePDF(buffer);
      this.text = data.text;
      
      // Extract events using multiple strategies
      this.extractByDatePatterns();
      this.extractByTableStructure();
      this.extractByRecurringPatterns();
      
      // Remove duplicates and sort by date
      this.events = this.removeDuplicates(this.events);
      this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return this.events;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Impossible de lire le fichier PDF');
    }
  }

  private extractByDatePatterns() {
    const lines = this.text.split('\n');
    
    for (const line of lines) {
      // Pattern: DD/MM/YYYY or DD-MM-YYYY
      const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g;
      let match: RegExpExecArray | null;
      
      while ((match = dateRegex.exec(line)) !== null) {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = match[3].length === 2 ? 2000 + parseInt(match[3]) : parseInt(match[3]);
        
        if (this.isValidDate(day, month, year)) {
          const date = format(new Date(year, month - 1, day), 'yyyy-MM-dd');
          const wasteType = this.detectWasteType(line);
          
          if (wasteType) {
            this.addEvent(date, wasteType);
          }
        }
      }
      
      // Pattern: French date format (1er janvier, 15 mars, etc.)
      const frenchMonths = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ];
      
      const frenchDateRegex = new RegExp(
        `(\\d{1,2}(?:er)?)\\s+(${frenchMonths.join('|')})(?:\\s+(\\d{4}))?`,
        'gi'
      );
      
      while ((match = frenchDateRegex.exec(line)) !== null && match !== null) {
        const day = parseInt(match[1].replace('er', ''));
        const monthIndex = frenchMonths.findIndex(m => 
          m.toLowerCase() === match[2].toLowerCase()
        );
        const year = match[3] ? parseInt(match[3]) : this.currentYear;
        
        if (this.isValidDate(day, monthIndex + 1, year)) {
          const date = format(new Date(year, monthIndex, day), 'yyyy-MM-dd');
          const wasteType = this.detectWasteType(line);
          
          if (wasteType) {
            this.addEvent(date, wasteType);
          }
        }
      }
    }
  }

  private extractByTableStructure() {
    // Look for table-like structures with months as headers
    const monthHeaders = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
      'jan', 'fév', 'mar', 'avr', 'mai', 'juin',
      'juil', 'août', 'sep', 'oct', 'nov', 'déc'
    ];
    
    const lines = this.text.split('\n');
    let currentMonth = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Check if line contains month header
      for (let j = 0; j < monthHeaders.length; j++) {
        if (line.includes(monthHeaders[j])) {
          currentMonth = j % 12;
          break;
        }
      }
      
      // If we have a current month, look for day numbers in following lines
      if (currentMonth !== -1 && i < lines.length - 1) {
        const nextLines = lines.slice(i + 1, Math.min(i + 10, lines.length));
        
        for (const nextLine of nextLines) {
          const dayNumbers = nextLine.match(/\b([1-9]|[12][0-9]|3[01])\b/g);
          
          if (dayNumbers) {
            for (const dayStr of dayNumbers) {
              const day = parseInt(dayStr);
              const wasteType = this.detectWasteType(nextLine);
              
              if (wasteType && this.isValidDate(day, currentMonth + 1, this.currentYear)) {
                const date = format(
                  new Date(this.currentYear, currentMonth, day),
                  'yyyy-MM-dd'
                );
                this.addEvent(date, wasteType);
              }
            }
          }
        }
      }
    }
  }

  private extractByRecurringPatterns() {
    const recurringPatterns = [
      {
        regex: /tous les (lundis?|mardis?|mercredis?|jeudis?|vendredis?|samedis?|dimanches?)/gi,
        handler: (match: RegExpMatchArray) => {
          const dayName = match[1].toLowerCase();
          const dayIndex = this.getDayIndex(dayName);
          const wasteType = this.detectWasteType(match.input || '');
          
          if (dayIndex !== -1 && wasteType) {
            this.generateWeeklyEvents(dayIndex, wasteType);
          }
        }
      },
      {
        regex: /chaque (premier|deuxième|troisième|dernier) (lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche) du mois/gi,
        handler: (match: RegExpMatchArray) => {
          const position = match[1].toLowerCase();
          const dayName = match[2].toLowerCase();
          const dayIndex = this.getDayIndex(dayName);
          const wasteType = this.detectWasteType(match.input || '');
          
          if (dayIndex !== -1 && wasteType) {
            this.generateMonthlyEvents(position, dayIndex, wasteType);
          }
        }
      }
    ];
    
    for (const pattern of recurringPatterns) {
      let match;
      while ((match = pattern.regex.exec(this.text)) !== null) {
        pattern.handler(match);
      }
    }
  }

  private detectWasteType(text: string): WasteType | null {
    const lowerText = text.toLowerCase();
    
    for (const [type, keywords] of Object.entries(PDF_PARSING_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return type as WasteType;
        }
      }
    }
    
    // Look for color indicators
    const colorIndicators: Record<string, WasteType> = {
      'jaune': 'recyclage',
      'vert': 'verre',
      'gris': 'ordures_menageres',
      'noir': 'ordures_menageres',
      'marron': 'dechets_verts',
      'bleu': 'cartons'
    };
    
    for (const [color, type] of Object.entries(colorIndicators)) {
      if (lowerText.includes(color)) {
        return type;
      }
    }
    
    return null;
  }

  private addEvent(date: string, type: WasteType) {
    const wasteInfo = WASTE_TYPES[type];
    
    this.events.push({
      date,
      type,
      label: wasteInfo.label,
      color: wasteInfo.color,
      time: '06:00'
    });
  }

  private generateWeeklyEvents(dayIndex: number, wasteType: WasteType) {
    const startDate = new Date();
    const endDate = addMonths(startDate, 12);
    
    let currentDate = new Date(startDate);
    currentDate = setDay(currentDate, dayIndex, { weekStartsOn: 1 });
    
    if (currentDate < startDate) {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    while (currentDate <= endDate) {
      const date = format(currentDate, 'yyyy-MM-dd');
      this.addEvent(date, wasteType);
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  private generateMonthlyEvents(position: string, dayIndex: number, wasteType: WasteType) {
    const startDate = new Date();
    const endDate = addMonths(startDate, 12);
    
    for (let month = startDate.getMonth(); month <= endDate.getMonth() + 12; month++) {
      const year = startDate.getFullYear() + Math.floor(month / 12);
      const monthIndex = month % 12;
      const firstDay = new Date(year, monthIndex, 1);
      const lastDay = new Date(year, monthIndex + 1, 0);
      
      let targetDate: Date | null = null;
      
      switch (position) {
        case 'premier':
          targetDate = this.getFirstOccurrenceOfDay(firstDay, dayIndex);
          break;
        case 'deuxième':
          targetDate = this.getNthOccurrenceOfDay(firstDay, dayIndex, 2);
          break;
        case 'troisième':
          targetDate = this.getNthOccurrenceOfDay(firstDay, dayIndex, 3);
          break;
        case 'dernier':
          targetDate = this.getLastOccurrenceOfDay(lastDay, dayIndex);
          break;
      }
      
      if (targetDate && targetDate >= startDate && targetDate <= endDate) {
        const date = format(targetDate, 'yyyy-MM-dd');
        this.addEvent(date, wasteType);
      }
    }
  }

  private getFirstOccurrenceOfDay(startDate: Date, dayIndex: number): Date {
    const date = new Date(startDate);
    date.setDate(1);
    
    while (date.getDay() !== dayIndex) {
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  }

  private getNthOccurrenceOfDay(startDate: Date, dayIndex: number, n: number): Date | null {
    let date = this.getFirstOccurrenceOfDay(startDate, dayIndex);
    
    for (let i = 1; i < n; i++) {
      date.setDate(date.getDate() + 7);
      
      if (date.getMonth() !== startDate.getMonth()) {
        return null;
      }
    }
    
    return date;
  }

  private getLastOccurrenceOfDay(endDate: Date, dayIndex: number): Date {
    const date = new Date(endDate);
    
    while (date.getDay() !== dayIndex) {
      date.setDate(date.getDate() - 1);
    }
    
    return date;
  }

  private getDayIndex(dayName: string): number {
    const days: Record<string, number> = {
      'dimanche': 0, 'lundi': 1, 'mardi': 2, 'mercredi': 3,
      'jeudi': 4, 'vendredi': 5, 'samedi': 6,
      'dimanches': 0, 'lundis': 1, 'mardis': 2, 'mercredis': 3,
      'jeudis': 4, 'vendredis': 5, 'samedis': 6
    };
    
    return days[dayName.toLowerCase()] ?? -1;
  }

  private isValidDate(day: number, month: number, year: number): boolean {
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return false;
    }
    
    const date = new Date(year, month - 1, day);
    return isValid(date) && 
           date.getDate() === day && 
           date.getMonth() === month - 1 &&
           date.getFullYear() === year;
  }

  private removeDuplicates(events: ExtractedEvent[]): ExtractedEvent[] {
    const uniqueEvents = new Map<string, ExtractedEvent>();
    
    for (const event of events) {
      const key = `${event.date}-${event.type}`;
      if (!uniqueEvents.has(key)) {
        uniqueEvents.set(key, event);
      }
    }
    
    return Array.from(uniqueEvents.values());
  }
}