import type { GeneratedWorksheet, WorksheetItem } from '@/types/pdf';

function renderTracingItem(item: WorksheetItem, num: number): string {
  const rows = item.words
    .map(
      (word) => `
      <div class="trace-row">
        <span class="trace-guide">${word}</span>
        <span class="trace-blank">_ _ _ _ _ _ _ _ _</span>
      </div>`
    )
    .join('');
  return `
  <div class="item">
    <div class="item-num">${num}.</div>
    <div class="item-body">
      <div class="item-instruction">${item.instruction}</div>
      <div class="trace-words">${rows}</div>
    </div>
  </div>`;
}

function renderMatchingItem(item: WorksheetItem, num: number): string {
  const half = Math.ceil(item.words.length / 2);
  const leftWords = item.words.slice(0, half);
  const rightWords = [...item.words].reverse().slice(0, half);
  const leftHtml = leftWords.map((w, i) => `<div class="match-box">${i + 1}. ${w}</div>`).join('');
  const rightHtml = rightWords.map((w, i) => `<div class="match-box">${String.fromCharCode(65 + i)}. ${w}</div>`).join('');
  return `
  <div class="item">
    <div class="item-num">${num}.</div>
    <div class="item-body">
      <div class="item-instruction">${item.instruction}</div>
      <div class="matching-grid">
        <div class="match-col">${leftHtml}</div>
        <div class="match-lines"></div>
        <div class="match-col">${rightHtml}</div>
      </div>
    </div>
  </div>`;
}

function renderLabelingItem(item: WorksheetItem, num: number): string {
  const boxesHtml = item.words
    .map(
      (word) => `
      <div class="label-box">
        <div class="label-hint">${word}</div>
        <div class="label-line">___________</div>
      </div>`
    )
    .join('');
  return `
  <div class="item">
    <div class="item-num">${num}.</div>
    <div class="item-body">
      <div class="item-instruction">${item.instruction}</div>
      <div class="label-row">${boxesHtml}</div>
    </div>
  </div>`;
}

function renderDrawingItem(item: WorksheetItem, num: number): string {
  return `
  <div class="item">
    <div class="item-num">${num}.</div>
    <div class="item-body">
      <div class="item-instruction">${item.instruction}</div>
      <div class="draw-area"></div>
      <div class="draw-label">Word: ___________________</div>
    </div>
  </div>`;
}

function renderItem(item: WorksheetItem, index: number): string {
  const num = index + 1;
  switch (item.type) {
    case 'tracing':  return renderTracingItem(item, num);
    case 'matching': return renderMatchingItem(item, num);
    case 'labeling': return renderLabelingItem(item, num);
    case 'drawing':  return renderDrawingItem(item, num);
    default:         return '';
  }
}

export function generateWorksheetHtml(ws: GeneratedWorksheet): string {
  const itemsHtml = ws.items.map((item, i) => renderItem(item, i)).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
  <title>Worksheet: Lesson ${ws.lessonNumber}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans','Noto Sans Devanagari',sans-serif;font-size:13pt;color:#000;background:#fff;padding:12mm 16mm}
    .ws-header{border-bottom:3px solid #000;padding-bottom:8px;margin-bottom:14px}
    .ws-title{font-size:16pt;font-weight:bold}
    .ws-subtitle{font-size:11pt;color:#333;margin-top:2px}
    .ws-fields{display:flex;gap:24px;margin-top:8px;font-size:12pt}
    .ws-field{flex:1}
    .field-underline{border-bottom:2px solid #000;display:inline-block;width:60%;margin-left:4px}
    .teacher-note{font-size:9pt;color:#555;font-style:italic;margin-bottom:14px;padding:3px 6px;border-left:2px solid #ccc}
    .item{display:flex;gap:8px;margin-bottom:18px;page-break-inside:avoid}
    .item-num{font-size:14pt;font-weight:bold;min-width:22px;padding-top:2px}
    .item-body{flex:1}
    .item-instruction{font-size:12pt;font-weight:bold;margin-bottom:8px}
    .trace-words{display:flex;flex-direction:column;gap:10px}
    .trace-row{display:flex;align-items:baseline;gap:16px}
    .trace-guide{font-size:24pt;font-weight:bold;color:#ccc;letter-spacing:2px}
    .trace-blank{font-size:13pt;color:#aaa}
    .matching-grid{display:flex;align-items:flex-start;gap:0}
    .match-col{flex:1;display:flex;flex-direction:column;gap:10px}
    .match-lines{width:60px;min-height:80px}
    .match-box{font-size:14pt;font-weight:bold;padding:4px 8px;border:2px solid #000;border-radius:4px;display:inline-block}
    .label-row{display:flex;gap:20px;flex-wrap:wrap;margin-top:4px}
    .label-box{display:flex;flex-direction:column;align-items:center;gap:4px}
    .label-hint{font-size:20pt;font-weight:bold;color:#ddd}
    .label-line{font-size:13pt;margin-top:4px}
    .draw-area{width:100%;height:110px;border:2px dashed #aaa;border-radius:4px;margin-top:4px}
    .draw-label{font-size:12pt;margin-top:6px}
    .footer{margin-top:14px;border-top:1px solid #ccc;padding-top:5px;font-size:8pt;text-align:center;color:#888}
  </style>
</head>
<body>
  <div class="ws-header">
    <div class="ws-title">Lesson ${ws.lessonNumber}: ${ws.lessonTitle}</div>
    <div class="ws-subtitle">English Worksheet</div>
    <div class="ws-fields">
      <div class="ws-field">नाव / Name:<span class="field-underline"></span></div>
      <div class="ws-field">दिनांक / Date:<span class="field-underline"></span></div>
    </div>
  </div>
  <div class="teacher-note">${ws.teacherInstruction}</div>
  ${itemsHtml}
  <div class="footer">Made with Pathshala AI &nbsp;•&nbsp; Lesson ${ws.lessonNumber}: ${ws.lessonTitle}</div>
</body>
</html>`;
}
