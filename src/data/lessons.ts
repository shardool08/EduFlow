export interface Lesson {
  id: string;
  number: number;
  en: string;
  mr: string;
}

export const LESSONS: Lesson[] = [
  { id: 'bb-g1-en-01', number: 1, en: 'Greetings', mr: 'अभिवादन' },
  { id: 'bb-g1-en-06', number: 6, en: 'My Family', mr: 'माझे कुटुंब' },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
