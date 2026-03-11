// ══════════════════════════════════════════════════════
//  SBS 아카데미 게임학원 · 문의 접수 → Google Sheets
//  Code.gs
//
//  스프레드시트 1행 구조 (직접 만들어두신 것 기준):
//  A=이름 / B=연락처 / C=나이 / D=수강목적 / E=문의과목
//
//  ※ 문의과목이 복수 선택된 경우 한 셀에 콤마로 구분해 저장됩니다.
//    예) "게임프로그래밍, AI드로잉, 웹툰/만화/PD"
// ══════════════════════════════════════════════════════

const SHEET_NAME = "문의접수";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // 시트가 없으면 자동 생성 + 1행 헤더 세팅
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["이름", "연락처", "나이", "수강목적", "문의과목"]);
      sheet.getRange(1, 1, 1, 5)
        .setFontWeight("bold")
        .setBackground("#1a2a3a")
        .setFontColor("#38bdf8");
      sheet.setFrozenRows(1);
    }

    // 2행부터 아래로 계속 쌓임 (appendRow = 항상 마지막 행 다음에 추가)
    sheet.appendRow([
      data.name    || "",
      data.phone   || "",
      data.age     || "",
      data.purpose || "",
      data.courses || "",  // 예: "게임프로그래밍, AI드로잉"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}
