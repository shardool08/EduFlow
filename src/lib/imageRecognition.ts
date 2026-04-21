import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';
import { getLessonById } from '@/data/lessons';
import type { BalbharatiLesson } from '@/types';

export interface RecognitionResult {
  lessonId: string | null;
  lesson: BalbharatiLesson | null;
  lessonTitle: string | null;
  confidence: number;
}

export async function recognizePage(imageUri: string): Promise<RecognitionResult> {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const { data, error } = await supabase.functions.invoke('recognize-page', {
    body: { imageBase64: base64, mimeType: 'image/jpeg' },
  });

  if (error || !data?.lessonId) {
    return { lessonId: null, lesson: null, lessonTitle: null, confidence: 0 };
  }

  const lesson = getLessonById(data.lessonId) ?? null;
  return {
    lessonId: data.lessonId as string,
    lesson,
    lessonTitle: data.lessonTitle as string ?? lesson?.title.en ?? null,
    confidence: (data.confidence as number) ?? 0,
  };
}
