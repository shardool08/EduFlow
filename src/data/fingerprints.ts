// Maps every page of the Balbharati Grade 1 English textbook to a lesson ID.
// Pages 1–96, four pages per lesson (matches pageNumbers arrays in lessons.ts).
// Used by the camera recognition fallback when Claude Vision is unavailable.
export const PAGE_TO_LESSON: Record<number, string> = {
  // Lesson 1 – Greetings
  1: 'bb-g1-en-01', 2: 'bb-g1-en-01', 3: 'bb-g1-en-01', 4: 'bb-g1-en-01',
  // Lesson 2 – My School
  5: 'bb-g1-en-02', 6: 'bb-g1-en-02', 7: 'bb-g1-en-02', 8: 'bb-g1-en-02',
  // Lesson 3 – Numbers 1–5
  9: 'bb-g1-en-03', 10: 'bb-g1-en-03', 11: 'bb-g1-en-03', 12: 'bb-g1-en-03',
  // Lesson 4 – My Classroom
  13: 'bb-g1-en-04', 14: 'bb-g1-en-04', 15: 'bb-g1-en-04', 16: 'bb-g1-en-04',
  // Lesson 5 – My Body
  17: 'bb-g1-en-05', 18: 'bb-g1-en-05', 19: 'bb-g1-en-05', 20: 'bb-g1-en-05',
  // Lesson 6 – My Family
  21: 'bb-g1-en-06', 22: 'bb-g1-en-06', 23: 'bb-g1-en-06', 24: 'bb-g1-en-06',
  // Lesson 7 – Colors
  25: 'bb-g1-en-07', 26: 'bb-g1-en-07', 27: 'bb-g1-en-07', 28: 'bb-g1-en-07',
  // Lesson 8 – Animals
  29: 'bb-g1-en-08', 30: 'bb-g1-en-08', 31: 'bb-g1-en-08', 32: 'bb-g1-en-08',
  // Lesson 9 – Fruits
  33: 'bb-g1-en-09', 34: 'bb-g1-en-09', 35: 'bb-g1-en-09', 36: 'bb-g1-en-09',
  // Lesson 10 – Vegetables
  37: 'bb-g1-en-10', 38: 'bb-g1-en-10', 39: 'bb-g1-en-10', 40: 'bb-g1-en-10',
  // Lesson 11 – Numbers 6–10
  41: 'bb-g1-en-11', 42: 'bb-g1-en-11', 43: 'bb-g1-en-11', 44: 'bb-g1-en-11',
  // Lesson 12 – My House
  45: 'bb-g1-en-12', 46: 'bb-g1-en-12', 47: 'bb-g1-en-12', 48: 'bb-g1-en-12',
  // Lesson 13 – Clothing
  49: 'bb-g1-en-13', 50: 'bb-g1-en-13', 51: 'bb-g1-en-13', 52: 'bb-g1-en-13',
  // Lesson 14 – Weather
  53: 'bb-g1-en-14', 54: 'bb-g1-en-14', 55: 'bb-g1-en-14', 56: 'bb-g1-en-14',
  // Lesson 15 – Days of the Week
  57: 'bb-g1-en-15', 58: 'bb-g1-en-15', 59: 'bb-g1-en-15', 60: 'bb-g1-en-15',
  // Lesson 16 – Action Words
  61: 'bb-g1-en-16', 62: 'bb-g1-en-16', 63: 'bb-g1-en-16', 64: 'bb-g1-en-16',
  // Lesson 17 – Birds
  65: 'bb-g1-en-17', 66: 'bb-g1-en-17', 67: 'bb-g1-en-17', 68: 'bb-g1-en-17',
  // Lesson 18 – Shapes
  69: 'bb-g1-en-18', 70: 'bb-g1-en-18', 71: 'bb-g1-en-18', 72: 'bb-g1-en-18',
  // Lesson 19 – Transport
  73: 'bb-g1-en-19', 74: 'bb-g1-en-19', 75: 'bb-g1-en-19', 76: 'bb-g1-en-19',
  // Lesson 20 – Community Helpers
  77: 'bb-g1-en-20', 78: 'bb-g1-en-20', 79: 'bb-g1-en-20', 80: 'bb-g1-en-20',
  // Lesson 21 – Food I Like
  81: 'bb-g1-en-21', 82: 'bb-g1-en-21', 83: 'bb-g1-en-21', 84: 'bb-g1-en-21',
  // Lesson 22 – My Neighbourhood
  85: 'bb-g1-en-22', 86: 'bb-g1-en-22', 87: 'bb-g1-en-22', 88: 'bb-g1-en-22',
  // Lesson 23 – Festivals
  89: 'bb-g1-en-23', 90: 'bb-g1-en-23', 91: 'bb-g1-en-23', 92: 'bb-g1-en-23',
  // Lesson 24 – Good Habits
  93: 'bb-g1-en-24', 94: 'bb-g1-en-24', 95: 'bb-g1-en-24', 96: 'bb-g1-en-24',
};

// Resolve a page number to a lesson ID (null if page not in textbook range).
export function lessonIdForPage(page: number): string | null {
  return PAGE_TO_LESSON[page] ?? null;
}
