import type { GeneratedLessonPlan } from '@/types/pdf';

export function generateLessonPlanHtml(plan: GeneratedLessonPlan): string {
  const sectionsHtml = plan.sections
    .map(
      (s) => `
    <div class="section">
      <div class="section-header">${s.icon} ${s.title} <span class="time">(${s.timeRange})</span></div>
      <div class="section-body">
        <p>${s.instructions.replace(/\n/g, '<br>')}</p>
        ${s.tip ? `<div class="tip">💡 ${s.tip}</div>` : ''}
      </div>
    </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
  <title>Lesson ${plan.lessonNumber}: ${plan.lessonTitle}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans Devanagari','Noto Sans',sans-serif;font-size:11pt;color:#000;background:#fff;padding:14mm 16mm}
    .doc-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:10px}
    .app-name{font-size:9pt;font-weight:bold;letter-spacing:.5px}
    .date{font-size:9pt;color:#444;white-space:nowrap;padding-left:12px}
    .teacher-info{font-size:10pt;margin-top:3px}
    .lesson-title{font-size:15pt;font-weight:bold;margin-top:4px}
    .lesson-subtitle{font-size:10pt;color:#333}
    .objective{font-size:10pt;margin-top:4px;padding:4px 8px;background:#f5f5f5;border-left:3px solid #000}
    .section{margin-top:8px;page-break-inside:avoid}
    .section-header{font-size:12pt;font-weight:bold;background:#ebebeb;padding:3px 8px;border-left:4px solid #000}
    .time{font-size:9pt;font-weight:normal;color:#555}
    .section-body{padding:5px 8px 3px 8px;font-size:10pt;line-height:1.55;border-left:1px solid #ddd}
    .tip{background:#f9f9f9;border-left:2px solid #888;padding:3px 8px;margin-top:4px;font-size:9.5pt;color:#333}
    .footer{margin-top:12px;border-top:1px solid #ccc;padding-top:5px;font-size:8pt;text-align:center;color:#888}
  </style>
</head>
<body>
  <div class="doc-header">
    <div>
      <div class="app-name">PATHSHALA AI</div>
      <div class="teacher-info">${plan.teacherName}${plan.school ? ` — ${plan.school}` : ''}${plan.corporation ? ` (${plan.corporation})` : ''}</div>
      <div class="lesson-title">Lesson ${plan.lessonNumber}: ${plan.lessonTitle}</div>
      <div class="lesson-subtitle">${plan.lessonTitleMr}</div>
      <div class="objective">📌 Objective: ${plan.objective}</div>
    </div>
    <div class="date">${plan.date}</div>
  </div>
  ${sectionsHtml}
  <div class="footer">Made with Pathshala AI &nbsp;•&nbsp; Lesson ${plan.lessonNumber}: ${plan.lessonTitle}</div>
</body>
</html>`;
}
