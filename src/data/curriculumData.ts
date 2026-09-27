import { StudyModule } from '../types';
import { TRACK1_FOUNDATIONS } from './modules/track1_foundations';
import { TRACK2_DATA_STRUCTURES } from './modules/track2_data_structures';
import { TRACK3_CONTROL_FUNCTIONS } from './modules/track3_control_functions';
import { TRACK4_ADVANCED_IO } from './modules/track4_advanced_io';
import { TRACK5_OOP_DATA_WEB } from './modules/track5_oop_data_web';

// Aggregate 30-Day Python Curriculum (Derived from Asabeneh/30-Days-Of-Python)
export const CURRICULUM_MODULES: StudyModule[] = [
  ...TRACK1_FOUNDATIONS,
  ...TRACK2_DATA_STRUCTURES,
  ...TRACK3_CONTROL_FUNCTIONS,
  ...TRACK4_ADVANCED_IO,
  ...TRACK5_OOP_DATA_WEB
];

export interface LearningTrack {
  id: string;
  name: string;
  shortName: string;
  daysRange: string;
  description: string;
  dayCount: number;
}

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'all',
    name: 'Full 30 Days of Python Path',
    shortName: 'All 30 Days',
    daysRange: 'Days 1 – 30',
    description: 'Complete Python mastery journey from zero syntax to Object-Oriented systems, Data Science, and Web APIs.',
    dayCount: 30
  },
  {
    id: 'Python Foundations',
    name: 'Track 1: Python Foundations',
    shortName: '1. Foundations',
    daysRange: 'Days 1 – 5',
    description: 'Syntax, Data Types, Variables, Built-ins, Operators, Strings, and Lists.',
    dayCount: 5
  },
  {
    id: 'Core Data Structures',
    name: 'Track 2: Core Data Structures',
    shortName: '2. Data Structures',
    daysRange: 'Days 6 – 8',
    description: 'Tuples & Immutability, Mathematical Sets, and Dictionaries.',
    dayCount: 3
  },
  {
    id: 'Control Flow & Functions',
    name: 'Track 3: Control Flow & Functions',
    shortName: '3. Control & Functions',
    daysRange: 'Days 9 – 14',
    description: 'Conditionals, While & For Loops, Functions, Modules, Comprehensions, and Decorators.',
    dayCount: 6
  },
  {
    id: 'Python Mastery & I/O',
    name: 'Track 4: Python Mastery & File I/O',
    shortName: '4. Mastery & I/O',
    daysRange: 'Days 15 – 20',
    description: 'Error Types, Datetime, Exception Handling, Regular Expressions, Persistent Files, and PIP.',
    dayCount: 6
  },
  {
    id: 'OOP, Data & Web',
    name: 'Track 5: OOP, Data Science & Web',
    shortName: '5. OOP, Data & Web',
    daysRange: 'Days 21 – 30',
    description: 'Classes & Objects, Web Scraping, Virtual Envs, Statistics, Pandas, Flask, Databases, and APIs.',
    dayCount: 10
  }
];

export const TOTAL_CURRICULUM_DAYS = CURRICULUM_MODULES.length;
