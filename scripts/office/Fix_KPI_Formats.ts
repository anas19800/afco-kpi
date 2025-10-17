/**
 * Office Script to normalize number formats for KPI workbook.
 * Applies number format by reading the unit type in column E and clears direct fill colours
 * so that conditional formatting remains visible.
 */
function main(workbook: ExcelScript.Workbook) {
  const sheet = workbook.getActiveWorksheet();
  const usedRange = sheet.getUsedRange();
  if (!usedRange) {
    return;
  }
  const unitColumnIndex = 5; // column E
  const formatMap: Record<string, string> = {
    '%': '0.0%',
    '#': '#,##0.0',
    SAR: '[$-ar-SA]#,##0.00 [$SAR-1025]',
    TEXT: '@'
  };

  const rowCount = usedRange.getRowCount();
  const valueColumnIndexStart = 7; // column G onwards are months

  for (let row = 2; row <= rowCount; row++) {
    const unitCell = sheet.getCell(row - 1, unitColumnIndex - 1);
    const unitType = String(unitCell.getValue() ?? '').trim();
    const format = formatMap[unitType] ?? '#,##0.0';
    const valueRange = sheet.getRangeByIndexes(
      row - 1,
      valueColumnIndexStart - 1,
      1,
      usedRange.getColumnCount() - valueColumnIndexStart + 1
    );
    valueRange.getFormat().getFill().clear();
    valueRange.setNumberFormat(format);
  }
}
