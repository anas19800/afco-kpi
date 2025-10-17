/**
 * Apply conditional formatting for four-band KPI thresholds.
 * Looks for thresholds in columns G:J and applies HIGH/LOW logic across the month ranges.
 */
function main(workbook: ExcelScript.Workbook) {
  const sheet = workbook.getActiveWorksheet();
  const usedRange = sheet.getUsedRange();
  if (!usedRange) {
    return;
  }
  const directionColumn = 6; // column F
  const thresholdStart = 6; // columns G to J hold L4..L1
  const monthStartColumn = 10; // column J onwards for month values
  const rows = usedRange.getRowCount();
  const columns = usedRange.getColumnCount();

  for (let row = 2; row <= rows; row++) {
    const direction = String(sheet.getCell(row - 1, directionColumn - 1).getValue() ?? '').trim().toUpperCase();
    if (!direction) {
      continue;
    }
    const level4 = Number(sheet.getCell(row - 1, thresholdStart).getValue());
    const level3 = Number(sheet.getCell(row - 1, thresholdStart + 1).getValue());
    const level2 = Number(sheet.getCell(row - 1, thresholdStart + 2).getValue());
    const level1 = Number(sheet.getCell(row - 1, thresholdStart + 3).getValue());

    const range = sheet.getRangeByIndexes(row - 1, monthStartColumn - 1, 1, columns - monthStartColumn + 1);
    range.clear(ExcelScript.ClearApplyTo.formats);

    const ignoresZero = true;

    if (direction === 'HIGH') {
      applyRule(range, `=IF(OR(ISBLANK({0}),{0}=0),FALSE,{0}>=${level4})`, '#15803d');
      applyRule(range, `=AND({0}<${level4},{0}>=${level3})`, '#4ade80');
      applyRule(range, `=AND({0}<${level3},{0}>=${level2})`, '#f97316');
      applyRule(range, `=AND({0}<${level2},{0}<>"",${ignoresZero ? `{0}<>0` : 'TRUE'})`, '#dc2626');
    } else {
      applyRule(range, `=IF(OR(ISBLANK({0}),{0}=0),FALSE,{0}<=${level4})`, '#15803d');
      applyRule(range, `=AND({0}>${level4},{0}<=${level3})`, '#4ade80');
      applyRule(range, `=AND({0}>${level3},{0}<=${level2})`, '#f97316');
      applyRule(range, `=AND({0}>${level2},{0}<>"",${ignoresZero ? `{0}<>0` : 'TRUE'})`, '#dc2626');
    }
  }
}

function applyRule(range: ExcelScript.Range, formulaTemplate: string, color: string) {
  const address = range.getCell(0, 0).getAddress(true, false);
  const formula = formulaTemplate.replace(/{0}/g, address);
  const rule = range.addConditionalFormat(ExcelScript.ConditionalFormatType.custom);
  rule.getCustom().setRule({ formula: formula, stopIfTrue: false });
  rule.getFormat().getFill().setColor(color);
}
