export interface LessonPlanSection {
  icon: string;
  title: string;
  timeRange: string;
  instructions: string;
  tip?: string;
}

export interface GeneratedLessonPlan {
  teacherName: string;
  school: string;
  corporation: string;
  date: string;
  lessonNumber: number;
  lessonTitle: string;
  lessonTitleMr: string;
  objective: string;
  sections: LessonPlanSection[];
  includeWorksheet: boolean;
  includeAssessment: boolean;
}

export interface WorksheetItem {
  type: 'tracing' | 'matching' | 'labeling' | 'drawing';
  instruction: string;
  words: string[];
}

export interface GeneratedWorksheet {
  lessonNumber: number;
  lessonTitle: string;
  teacherInstruction: string;
  items: WorksheetItem[];
}

export interface PdfBundle {
  lessonPlan: GeneratedLessonPlan;
  worksheet: GeneratedWorksheet;
  assessment?: GeneratedWorksheet;
}

export interface PdfUris {
  lessonPlanUri: string;
  worksheetUri?: string;
  assessmentUri?: string;
}
