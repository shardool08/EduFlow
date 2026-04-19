import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateLessonPlanHtml } from '@/templates/lessonPlanHtml';
import { generateWorksheetHtml } from '@/templates/worksheetHtml';
import type { PdfBundle, PdfUris } from '@/types/pdf';

export async function generatePdfs(bundle: PdfBundle): Promise<PdfUris> {
  const { uri: lessonPlanUri } = await Print.printToFileAsync({
    html: generateLessonPlanHtml(bundle.lessonPlan),
    base64: false,
  });

  let worksheetUri: string | undefined;
  if (bundle.lessonPlan.includeWorksheet) {
    const { uri } = await Print.printToFileAsync({
      html: generateWorksheetHtml(bundle.worksheet),
      base64: false,
    });
    worksheetUri = uri;
  }

  let assessmentUri: string | undefined;
  if (bundle.lessonPlan.includeAssessment && bundle.assessment) {
    const { uri } = await Print.printToFileAsync({
      html: generateWorksheetHtml(bundle.assessment),
      base64: false,
    });
    assessmentUri = uri;
  }

  return { lessonPlanUri, worksheetUri, assessmentUri };
}

export async function shareBundle(uris: PdfUris): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing not available on this device');
  }

  await Sharing.shareAsync(uris.lessonPlanUri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share Lesson Plan',
    UTI: 'com.adobe.pdf',
  });

  if (uris.worksheetUri) {
    await Sharing.shareAsync(uris.worksheetUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Worksheet',
      UTI: 'com.adobe.pdf',
    });
  }
}
