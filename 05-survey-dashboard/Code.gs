/**
 * Survey Dashboard Generator 
 *
 * Reads raw survey responses from a Google Sheet, cleans and normalizes them,
 * and builds a management-ready dashboard with KPIs, insights and charts.
 *
 * Expected sheets (names configurable in CONFIG):
 *   01_Raw Data   - exported form responses (input, never modified)
 *   02_Clean Data - generated
 *   03_Dashboard  - generated
 *
 * Entry point: createSurveyReport()
 *
 * Design notes
 *  - Raw data is never modified; Clean and Dashboard sheets are rebuilt on every run.
 *  - Question columns are found by header keywords, with a positional fallback.
 *  - Answers are normalized per question type (single / multi / numeric free text / brand).
 *  - Brand cleanup is table-driven (BRAND_ALIASES). Multi-brand answers are split only
 *    when every word is a known brand; anything else is kept as written, so unrecognized
 *    values stay visible in the output instead of being silently guessed.
 */

// =====================================================
// CONFIG
// =====================================================

const CONFIG = {
  sheets: {
    raw: '01_Raw Data',
    clean: '02_Clean Data',
    dashboard: '03_Dashboard'
  },
  title: 'Product Survey Dashboard',
  subtitle: 'Survey Dashboard for Product Development',
  colors: {
    primary: '#1f4e78',
    secondary: '#5b9bd5',
    sectionBg: '#e8eef5',
    subBg: '#d9e5f0',
    tableHeaderBg: '#f3f6f9',
    white: '#ffffff'
  }
};

/**
 * Survey fields, in output column order (the timestamp is always column 0).
 *
 * key    : internal identifier (also used by normalizeAnswer / detectQuestionFields)
 * header : column header in the clean sheet
 * title  : section title on the dashboard
 * type   : 'single' | 'multi' | 'speaker' | 'freePower'
 * chart  : 'bar' | 'column' | 'pie' (single / multi types only)
 * width  : optional column width in the clean sheet
 */
const FIELDS = [
  { key: 'age',           header: '年齢層',                         title: '年齢層',                         type: 'single',    chart: 'bar' },
  { key: 'job',           header: '職業',                           title: '職業',                           type: 'single',    chart: 'bar' },
  { key: 'room',          header: '主な試聴環境の部屋の広さ',       title: '主な試聴環境の部屋の広さ',       type: 'single',    chart: 'bar',    width: 190 },
  { key: 'listeningTime', header: '週間音楽聴取時間',               title: '週間音楽聴取時間',               type: 'single',    chart: 'bar' },
  { key: 'genre',         header: 'よく聴く音楽ジャンル',           title: 'よく聴く音楽ジャンル',           type: 'multi',     chart: 'bar',    width: 230 },
  { key: 'source',        header: '主に使用する音源・再生機器',     title: '主に使用する音源・再生機器',     type: 'multi',     chart: 'bar',    width: 260 },
  { key: 'speaker',       header: '使用スピーカーのブランド・モデル', title: '使用スピーカーのブランド・モデル', type: 'speaker',                       width: 230 },
  { key: 'terminal',      header: 'よく使用する入出力端子',         title: 'よく使用する入出力端子',         type: 'multi',     chart: 'bar',    width: 360 },
  { key: 'power',         header: '希望する1chあたりの出力',        title: '希望する1chあたりの出力',        type: 'single',    chart: 'column' },
  { key: 'otherPower',    header: 'その他希望出力',                 title: 'その他希望出力',                 type: 'freePower',                     width: 180 },
  { key: 'sound',         header: '音の好み',                       title: '音の好み',                       type: 'single',    chart: 'bar',    width: 270 },
  { key: 'tube',          header: '真空管オーディオへの嗜好',       title: '真空管オーディオへの嗜好',       type: 'single',    chart: 'bar',    width: 270 },
  { key: 'design',        header: '好みのサイズ・デザイン',         title: '好みのサイズ・デザイン',         type: 'single',    chart: 'bar',    width: 300 },
  { key: 'color',         header: '好みの本体カラー',               title: '好みの本体カラー',               type: 'multi',     chart: 'bar' },
  { key: 'vu',            header: 'VUメーター・ディスプレイ',       title: 'VUメーター・ディスプレイ',       type: 'single',    chart: 'pie',    width: 260 },
  { key: 'weight',        header: '希望する筐体重量',               title: '希望する筐体重量',               type: 'single',    chart: 'column', width: 300 },
  { key: 'price',         header: '許容価格帯',                     title: '許容価格帯',                     type: 'single',    chart: 'column' }
];

/** Column index of each field in the clean data (timestamp = 0). */
const COL = { timestamp: 0 };
FIELDS.forEach((f, i) => { COL[f.key] = i + 1; });

/**
 * Header-detection rules for the raw sheet, evaluated in order.
 * Each raw column is assigned to the FIRST rule it matches, so the order matters
 * (e.g. the "other power" rule must come before the generic "power" rule).
 * `text` is the header lower-cased with whitespace removed.
 */
const HEADER_RULES = [
  { key: 'age',           test: t => t.includes('年齢') },
  { key: 'job',           test: t => t.includes('職業') },
  { key: 'room',          test: t => t.includes('部屋') || t.includes('広さ') },
  { key: 'listeningTime', test: t => t.includes('週間') && t.includes('音楽') && t.includes('時間') },
  { key: 'genre',         test: t => t.includes('音楽') && t.includes('ジャンル') },
  { key: 'source',        test: t => t.includes('音源') || t.includes('ハードウェア') || t.includes('再生機器') },
  { key: 'speaker',       test: t => t.includes('スピーカー') && (t.includes('ブランド') || t.includes('モデル')) },
  { key: 'terminal',      test: t => t.includes('入出力') || t.includes('端子') },
  { key: 'otherPower',    test: t => t.includes('その他') && (t.includes('何w') || t.includes('何ｗ') || t.includes('希望')) },
  { key: 'power',         test: t => t.includes('出力範囲') || (t.includes('1チャンネル') && t.includes('出力')) || (t.includes('1ch') && t.includes('出力')) },
  { key: 'sound',         test: t => t.includes('音の好み') },
  { key: 'tube',          test: t => t.includes('真空管') || t.includes('チューブ') },
  { key: 'design',        test: t => t.includes('サイズ') || t.includes('デザイン') },
  { key: 'color',         test: t => t.includes('カラー') || t.includes('色') },
  { key: 'vu',            test: t => t.includes('vu') || t.includes('メーター') || t.includes('ディスプレイ') },
  { key: 'weight',        test: t => t.includes('重量') || t.includes('筐体の重さ') },
  { key: 'price',         test: t => t.includes('価格帯') || (t.includes('許容') && t.includes('価格')) }
];

/**
 * Canonical brand name -> accepted spellings (lower case).
 * Add new brands / spellings here; no other code needs to change.
 */
const BRAND_ALIASES = {
  'ALTEC':            ['altec', 'アルテック', 'アルテツク'],
  'JBL':              ['jbl'],
  'FOSTEX':           ['fostex', 'フォステクス', 'フォスティクス'],
  'TANNOY':           ['tannoy', 'タンノイ'],
  'DALI':             ['dali', 'ダリ'],
  'B&W':              ['b&w', 'b & w', 'bowers & wilkins', 'bowers and wilkins', 'b_and_w'],
  'MARKAUDIO':        ['markaudio'],
  'SICA':             ['sica'],
  'CORAL':            ['coral', 'コーラル'],
  'KEF':              ['kef'],
  'SONY':             ['sony'],
  'YAMAHA':           ['yamaha', 'ヤマハ'],
  'DIATONE':          ['diatone'],
  'DENON':            ['denon'],
  'ELAC':             ['elac'],
  'PMC':              ['pmc'],
  'PARC AUDIO':       ['parc audio', 'parcaudio', 'park audio', 'parkaudio'],
  'TRIODE':           ['トライオード', 'triode'],
  'ELEKIT':           ['elekit', 'エレキット'],
  'SPENDOR':          ['spendor', 'スペンドール'],
  'FOCAL':            ['focal'],
  'MAGICO':           ['magico'],
  'ONKEN':            ['onken'],
  'LOWTHER':          ['lowther'],
  'JENSEN':           ['jensen'],
  'PANASONIC':        ['panasonic', 'パナソニック'],
  'CAMBRIDGE AUDIO':  ['cambridge audio', 'cambridgeaudio'],
  'WHARFEDALE':       ['wharfedale', 'ワーフデール'],
  'SANSUI':           ['sansui', 'サンスイ'],
  'PASS':             ['pass', 'pass labs'],
  'ZU AUDIO':         ['zu audio', 'zuaudio'],
  'YG ACOUSTICS':     ['yg acoustics', 'ygacoustics'],
  'REVIVAL AUDIO':    ['revival audio', 'revivalaudio']
};

/** Reverse index: alias -> canonical brand (built once). */
const ALIAS_MAP = (function () {
  const map = {};
  Object.keys(BRAND_ALIASES).forEach(canonical => {
    BRAND_ALIASES[canonical].forEach(alias => { map[alias] = canonical; });
  });
  return map;
})();


// =====================================================
// MAIN ENTRY POINT
// =====================================================

function createSurveyReport() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName(CONFIG.sheets.raw);

  if (!source) {
    throw new Error('Sheet "' + CONFIG.sheets.raw + '" was not found.');
  }

  const raw = source.getDataRange().getValues();

  if (raw.length < 2) {
    throw new Error('Sheet "' + CONFIG.sheets.raw + '" contains no responses.');
  }

  const fieldMap = detectQuestionFields(raw[0]);
  const output = buildCleanData(raw, fieldMap);

  writeCleanSheet(ss, output);
  writeDashboard(ss, output);

  SpreadsheetApp.flush();
}


// =====================================================
// CLEAN DATA
// =====================================================

function buildCleanData(raw, fieldMap) {

  const output = [['回答日時'].concat(FIELDS.map(f => f.header))];

  for (let r = 1; r < raw.length; r++) {

    const row = raw[r];

    // Skip rows without a timestamp (blank / partial rows)
    if (!row[0]) {
      continue;
    }

    const cleanRow = [row[0]].concat(
      FIELDS.map(f =>
        normalizeAnswer(f.key, getRawAnswer(row, fieldMap[f.key]))
      )
    );

    output.push(cleanRow);
  }

  return output;
}

function writeCleanSheet(ss, output) {

  const clean = resetSheet(ss, CONFIG.sheets.clean);
  const numRows = output.length;
  const numCols = output[0].length;

  const range = clean.getRange(1, 1, numRows, numCols);

  range
    .setValues(output)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  clean.getRange(1, 1, 1, numCols)
    .setFontWeight('bold')
    .setBackground(CONFIG.colors.primary)
    .setFontColor(CONFIG.colors.white);

  clean.setFrozenRows(1);

  for (let c = 1; c <= numCols; c++) {
    clean.setColumnWidth(c, 150);
  }

  FIELDS.forEach(f => {
    if (f.width) {
      clean.setColumnWidth(COL[f.key] + 1, f.width);
    }
  });
}

/** Gets or creates a sheet and wipes its content, formats, merges and charts. */
function resetSheet(ss, name) {

  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  sheet.setFrozenRows(0);

  if (sheet.getMaxRows() > 0 && sheet.getMaxColumns() > 0) {
    sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();
  }

  sheet.getCharts().forEach(chart => sheet.removeChart(chart));

  sheet.clear();
  sheet.clearFormats();

  return sheet;
}


// =====================================================
// RAW FIELD DETECTION
// =====================================================

/**
 * Maps each survey field to a column index in the raw sheet by matching header text.
 * If a field cannot be matched, falls back to the positional layout
 * (question / answer column pairs starting at column index 2).
 */
function detectQuestionFields(headers) {

  const fields = {};
  FIELDS.forEach(f => { fields[f.key] = null; });

  for (let c = 0; c < headers.length; c++) {

    const text = normalizeText(headers[c]);

    if (!text) {
      continue;
    }

    const rule = HEADER_RULES.find(r => r.test(text));

    if (rule) {
      fields[rule.key] = c;
    }
  }

  // Positional fallback
  FIELDS.forEach((f, i) => {
    if (fields[f.key] === null) {
      const answerColumn = 2 + i * 2 + 1;
      if (answerColumn < headers.length) {
        fields[f.key] = answerColumn;
      }
    }
  });

  return fields;
}

function getRawAnswer(row, column) {

  if (column === null || column === undefined) {
    return '';
  }

  if (column < 0 || column >= row.length) {
    return '';
  }

  return row[column] || '';
}

function normalizeText(value) {

  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/（/g, '(')
    .replace(/）/g, ')');
}


// =====================================================
// ANSWER NORMALIZATION
// =====================================================

const AGE_RULES = [
  { label: '20〜29歳', test: a => a.includes('20') && a.includes('29') },
  { label: '30〜39歳', test: a => a.includes('30') && a.includes('39') },
  { label: '40〜49歳', test: a => a.includes('40') && a.includes('49') },
  { label: '50〜59歳', test: a => a.includes('50') && a.includes('59') },
  { label: '60〜69歳', test: a => a.includes('60') && a.includes('69') },
  { label: '70歳以上', test: a => a.includes('70') }
];

const ROOM_RULES = [
  { label: '6〜8畳',   test: a => a.includes('6') && a.includes('8') && a.includes('畳') },
  { label: '8〜12畳',  test: a => a.includes('8') && a.includes('12') && a.includes('畳') },
  { label: '12〜20畳', test: a => a.includes('12') && a.includes('20') && a.includes('畳') },
  { label: '20畳以上', test: a => a.includes('20畳以上') },
  { label: '6畳未満',  test: a => a.includes('6畳未満') }
];

function normalizeAnswer(type, answer) {

  if (answer === null || answer === undefined) {
    return '';
  }

  answer = String(answer).trim();

  if (!answer) {
    return '';
  }

  switch (type) {

    case 'age': {
      const hit = AGE_RULES.find(rule => rule.test(answer));
      return hit ? hit.label : answer;
    }

    case 'room': {
      const hit = ROOM_RULES.find(rule => rule.test(answer));
      return hit ? hit.label : answer;
    }

    case 'speaker':
      return normalizeSpeakerAnswer(answer);

    case 'otherPower':
      return normalizePowerAnswer(answer);

    default:
      return answer;
  }
}

/**
 * Unifies free-text power answers:
 *   "100W", "100Ｗ", "１００Ｗ", "100 W", "１００ Ｗ", "100"  ->  "100W"
 * Non-numeric answers are returned unchanged.
 */
function normalizePowerAnswer(answer) {

  let value = toHalfWidthPower(answer);

  if (!value) {
    return '';
  }

  const match = value.match(/^(\d+(?:\.\d+)?)\s*[Ww]?$/);

  if (match) {
    return Number(match[1]) + 'W';
  }

  return value;
}

/** Full-width digits -> half-width, full-width W/w -> W, collapse whitespace. */
function toHalfWidthPower(text) {

  return String(text)
    .trim()
    .replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/[Ｗｗ]/g, 'W')
    .replace(/　/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}


// =====================================================
// SPEAKER BRAND NORMALIZATION
// =====================================================

/** Lower-cases, unifies full-width ampersand and collapses whitespace for alias lookup. */
function aliasKey(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/＆/g, '&')
    .replace(/[\s　]+/g, ' ');
}

/** Maps one brand string to its canonical name; unknown values are returned trimmed. */
function normalizeBrand(text) {

  const trimmed = String(text).trim();

  if (!trimmed) {
    return '';
  }

  return ALIAS_MAP[aliasKey(trimmed)] || trimmed;
}

/**
 * Splits a free-text speaker answer into individual brands.
 *
 *  1. If the whole answer is a known brand/alias, return it as one brand.
 *  2. Split on common separators ( , 、 ， ／ / ; ； ・ & "and" ).
 *  3. If only one chunk remains, try splitting on spaces — accepted ONLY when
 *     every word belongs to a known brand (so "Cambridge Audio" stays intact
 *     and unknown multi-word model names are never torn apart).
 */
function splitBrands(value) {

  const text = String(value || '').trim();

  if (!text) {
    return [];
  }

  if (ALIAS_MAP[aliasKey(text)]) {
    return [ALIAS_MAP[aliasKey(text)]];
  }

  // Protect "B&W" so the ampersand separator does not break it
  const protectedText = text
    .replace(/＆/g, '&')
    .replace(/\bb\s*&\s*w\b/gi, 'B_AND_W');

  const parts = protectedText
    .replace(/[，、／\/;；・&]/g, ',')
    .replace(/\s+and\s+/gi, ',')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    const spaced = splitKnownSpaceSeparated(parts[0]);
    if (spaced) {
      return spaced;
    }
  }

  return parts.map(normalizeBrand).filter(Boolean);
}

/**
 * Greedy longest-match (up to 3 words) over space-separated text.
 * Returns an array of canonical brands only if ALL words were consumed
 * and at least two brands were found; otherwise null.
 */
function splitKnownSpaceSeparated(text) {

  const words = text.split(/\s+/);

  if (words.length < 2) {
    return null;
  }

  const result = [];
  let i = 0;

  while (i < words.length) {

    let matched = false;

    for (let n = Math.min(3, words.length - i); n >= 1; n--) {

      const phrase = words.slice(i, i + n).join(' ').toLowerCase();

      if (ALIAS_MAP[phrase]) {
        result.push(ALIAS_MAP[phrase]);
        i += n;
        matched = true;
        break;
      }
    }

    if (!matched) {
      return null;
    }
  }

  return result.length > 1 ? result : null;
}

function normalizeSpeakerAnswer(answer) {

  const brands = splitBrands(answer);

  return brands
    .filter((b, i) => brands.indexOf(b) === i)
    .join(', ');
}


// =====================================================
// DASHBOARD
// =====================================================

function writeDashboard(ss, output) {

  const dashboard = resetSheet(ss, CONFIG.sheets.dashboard);
  const color = CONFIG.colors;

  dashboard.setHiddenGridlines(true);

  for (let c = 1; c <= 8; c++) {
    dashboard.setColumnWidth(c, 125);
  }

  // ---------- Title ----------

  mergeWrite(dashboard, 1, 1, 1, 8, CONFIG.title, {
    size: 20, bold: true, bg: color.primary, color: color.white
  });
  dashboard.setRowHeight(1, 42);

  mergeWrite(dashboard, 2, 1, 1, 8, CONFIG.subtitle, {
    size: 10, bg: color.subBg
  });

  // ---------- KPI ----------

  const kpis = [
    { col: 1, label: '回答者数',         value: output.length - 1 },
    { col: 3, label: '最多年齢層',       value: getTopAnswer(output, COL.age) },
    { col: 5, label: '最多の希望出力',   value: getTopAnswer(output, COL.power) },
    { col: 7, label: '最多の許容価格帯', value: getTopAnswer(output, COL.price) }
  ];

  kpis.forEach(kpi => {
    mergeWrite(dashboard, 4, kpi.col, 1, 2, kpi.label, {
      bold: true, bg: color.secondary, color: color.white
    });
    mergeWrite(dashboard, 5, kpi.col, 2, 2, kpi.value, {
      size: 16, bold: true, wrap: true
    });
  });

  // ---------- Product development insights ----------

  mergeWrite(dashboard, 8, 1, 1, 8, '製品開発への示唆', {
    size: 16, bold: true, bg: color.sectionBg
  });

  const headerStyle = { bold: true, bg: color.primary, color: color.white };
  mergeWrite(dashboard, 9, 1, 1, 2, '分析項目', headerStyle);
  mergeWrite(dashboard, 9, 3, 1, 2, '調査結果', headerStyle);
  mergeWrite(dashboard, 9, 5, 1, 4, '製品開発への示唆', headerStyle);

  generateInsights(output).forEach((item, index) => {
    const row = 10 + index;
    mergeWrite(dashboard, row, 1, 1, 2, item.category, { wrap: true });
    mergeWrite(dashboard, row, 3, 1, 2, item.trend, { wrap: true });
    mergeWrite(dashboard, row, 5, 1, 4, item.suggestion, { wrap: true });
    dashboard.setRowHeight(row, 42);
  });

  // ---------- Management summary ----------

  const summaryStart = 19;

  mergeWrite(dashboard, summaryStart, 1, 1, 8, '経営判断上の主要ポイント', {
    size: 15, bold: true, bg: color.sectionBg
  });

  const summaryRows = [
    ['ターゲットユーザー', getTopAnswer(output, COL.age)],
    ['主な試聴環境',       getTopAnswer(output, COL.room)],
    ['希望出力',           getTopAnswer(output, COL.power)],
    ['音の方向性',         getTopAnswer(output, COL.sound)],
    ['デザイン',           getTopAnswer(output, COL.design)],
    ['重量',               getTopAnswer(output, COL.weight)],
    ['価格',               getTopAnswer(output, COL.price)]
  ];

  summaryRows.forEach((item, i) => {
    const row = summaryStart + 1 + i;
    mergeWrite(dashboard, row, 1, 1, 2, item[0], { bold: true, bg: color.tableHeaderBg });
    mergeWrite(dashboard, row, 3, 1, 6, item[1], { wrap: true });
  });

  // ---------- Detailed analysis ----------

  const detailStart = 28;

  mergeWrite(dashboard, detailStart, 1, 1, 8, '詳細分析｜' + FIELDS.length + '問', {
    size: 16, bold: true, bg: color.sectionBg
  });

  let currentRow = detailStart + 2;

  FIELDS.forEach((field, index) => {

    const question = {
      title: 'Q' + (index + 1) + '｜' + field.title,
      column: COL[field.key],
      type: field.type,
      chart: field.chart
    };

    currentRow = createQuestionAnalysis(dashboard, output, question, currentRow).nextRow;
  });

  // ---------- Global formatting ----------

  dashboard
    .getRange(1, 1, Math.max(dashboard.getLastRow(), currentRow), 8)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  dashboard.activate();
}

/**
 * Merges a block of cells, writes a value and applies a style.
 * style: { size, bold, bg, color, wrap }
 */
function mergeWrite(sheet, row, col, numRows, numCols, value, style) {

  style = style || {};

  const range = sheet
    .getRange(row, col, numRows, numCols)
    .merge()
    .setValue(value)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  if (style.size)  { range.setFontSize(style.size); }
  if (style.bold)  { range.setFontWeight('bold'); }
  if (style.bg)    { range.setBackground(style.bg); }
  if (style.color) { range.setFontColor(style.color); }
  if (style.wrap)  { range.setWrap(true); }

  return range;
}


// =====================================================
// QUESTION SECTIONS + CHARTS
// =====================================================

function createQuestionAnalysis(sheet, data, question, startRow) {

  const stats = getQuestionStats(data, question.column, question.type);

  mergeWrite(sheet, startRow, 1, 1, 8, question.title, {
    size: 13, bold: true, bg: CONFIG.colors.subBg
  });

  const tableStart = startRow + 1;

  if (question.type === 'speaker' || question.type === 'freePower') {
    return createFreeAnswerSection(sheet, stats, question, tableStart);
  }

  sheet.getRange(tableStart, 1, 1, 3)
    .setValues([['回答', '人数', '割合']])
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setBackground(CONFIG.colors.tableHeaderBg);

  const total = data.length - 1;

  const values = stats.map(item => [
    item.label,
    item.count,
    total > 0 ? item.count / total : 0
  ]);

  if (values.length > 0) {

    sheet.getRange(tableStart + 1, 1, values.length, 3)
      .setValues(values)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle')
      .setWrap(true);

    sheet.getRange(tableStart + 1, 3, values.length, 1)
      .setNumberFormat('0.0%');
  }

  const chartHeight = Math.max(220, Math.min(400, 120 + values.length * 28));
  const dataRange = sheet.getRange(tableStart, 1, values.length + 1, 2);

  let builder = sheet.newChart();

  if (question.chart === 'pie') {

    builder = builder
      .asPieChart()
      .addRange(dataRange)
      .setOption('pieHole', 0.35);

  } else if (question.chart === 'column') {

    builder = builder
      .asColumnChart()
      .addRange(dataRange)
      .setOption('legend', { position: 'none' })
      .setOption('vAxis', { minValue: 0 });

  } else {

    builder = builder
      .asBarChart()
      .addRange(dataRange)
      .setOption('legend', { position: 'none' })
      .setOption('hAxis', { minValue: 0 });
  }

  sheet.insertChart(
    builder
      .setPosition(tableStart, 5, 0, 0)
      .setOption('title', question.title)
      .setOption('width', 500)
      .setOption('height', chartHeight)
      .build()
  );

  const tableHeight = Math.max(5, values.length + 2);
  const chartRows = Math.ceil(chartHeight / 21);

  return {
    nextRow: startRow + Math.max(tableHeight + 2, chartRows + 2)
  };
}

function createFreeAnswerSection(sheet, stats, question, startRow) {

  sheet.getRange(startRow, 1, 1, 3)
    .setValues([['回答', '件数', '備考']])
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setBackground(CONFIG.colors.tableHeaderBg);

  const values = stats.map(item => [item.label, item.count, '自由記入']);

  if (values.length > 0) {
    sheet.getRange(startRow + 1, 1, values.length, 3)
      .setValues(values)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle')
      .setWrap(true);
  }

  // Speaker: top 10 brands as a bar chart
  if (question.type === 'speaker') {
    insertSideChart(
      sheet, startRow, stats.slice(0, 10),
      ['ブランド・モデル', '件数'],
      '回答されたスピーカー TOP10',
      'bar'
    );
  }

  // Other power: numeric answers aggregated and sorted ascending
  if (question.type === 'freePower') {
    insertSideChart(
      sheet, startRow, extractNumericPower(stats),
      ['希望出力', '件数'],
      'その他希望出力',
      'column'
    );
  }

  return {
    nextRow: startRow + Math.max(stats.length + 4, 18)
  };
}

/** Writes a small label/count table in columns E:F and draws a chart next to it. */
function insertSideChart(sheet, startRow, items, headerRow, title, kind) {

  if (items.length === 0) {
    return;
  }

  sheet.getRange(startRow, 5, items.length + 1, 2)
    .setValues([headerRow].concat(items.map(item => [item.label, item.count])))
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  const range = sheet.getRange(startRow, 5, items.length + 1, 2);

  const builder = kind === 'column'
    ? sheet.newChart().asColumnChart()
    : sheet.newChart().asBarChart();

  sheet.insertChart(
    builder
      .addRange(range)
      .setPosition(startRow, 7, 0, 0)
      .setOption('title', title)
      .setOption('legend', { position: 'none' })
      .setOption('width', 500)
      .setOption('height', 300)
      .build()
  );
}


// =====================================================
// STATISTICS
// =====================================================

function getQuestionStats(data, columnIndex, type) {

  if (type === 'multi') {
    return countMultiChoice(data, columnIndex);
  }

  if (type === 'speaker') {
    return countSpeakers(data, columnIndex);
  }

  if (type === 'freePower') {
    return countFreeText(data, columnIndex);
  }

  return countSingleChoice(data, columnIndex);
}

/** Turns a { label: count } object into an array sorted by count (descending). */
function toSortedStats(counts) {

  return Object.keys(counts)
    .map(key => ({ label: key, count: counts[key] }))
    .sort((a, b) => b.count - a.count);
}

function countSingleChoice(data, columnIndex) {

  const counts = {};

  for (let i = 1; i < data.length; i++) {

    const value = String(data[i][columnIndex] || '').trim();

    if (!value) {
      continue;
    }

    counts[value] = (counts[value] || 0) + 1;
  }

  return toSortedStats(counts);
}

function countMultiChoice(data, columnIndex) {

  const counts = {};

  for (let i = 1; i < data.length; i++) {

    const value = String(data[i][columnIndex] || '').trim();

    if (!value) {
      continue;
    }

    value.split(/[\/／,，、;；]+/).forEach(option => {

      option = option.trim();

      if (!option) {
        return;
      }

      counts[option] = (counts[option] || 0) + 1;
    });
  }

  return toSortedStats(counts);
}

function countSpeakers(data, columnIndex) {

  const counts = {};

  for (let i = 1; i < data.length; i++) {

    const value = String(data[i][columnIndex] || '').trim();

    if (!value) {
      continue;
    }

    splitBrands(value).forEach(brand => {
      counts[brand] = (counts[brand] || 0) + 1;
    });
  }

  return toSortedStats(counts);
}

function countFreeText(data, columnIndex) {

  const counts = {};

  for (let i = 1; i < data.length; i++) {

    const value = String(data[i][columnIndex] || '').trim();

    if (!value) {
      continue;
    }

    counts[value] = (counts[value] || 0) + 1;
  }

  return toSortedStats(counts);
}

/** Keeps only numeric power answers ("100W"), merges duplicates, sorts ascending. */
function extractNumericPower(stats) {

  const aggregated = {};

  stats.forEach(item => {

    const text = toHalfWidthPower(item.label).replace(/,/g, '');
    const match = text.match(/^(\d+(?:\.\d+)?)\s*[Ww]?$/);

    if (!match) {
      return;
    }

    const value = Number(match[1]);
    const label = value + 'W';

    if (!aggregated[label]) {
      aggregated[label] = { label: label, count: 0, value: value };
    }

    aggregated[label].count += item.count;
  });

  return Object.keys(aggregated)
    .map(key => aggregated[key])
    .sort((a, b) => a.value - b.value);
}

function getTopAnswer(data, columnIndex) {

  const stats = countSingleChoice(data, columnIndex);

  return stats.length === 0 ? '—' : stats[0].label;
}


// =====================================================
// RULE-BASED INSIGHTS
// =====================================================

/**
 * Generates a short insight per theme from the most frequent answer.
 * The suggestions are rule-based templates and can be extended or replaced.
 */
function generateInsights(data) {

  const topPower = getTopAnswer(data, COL.power);

  return [
    {
      category: 'ターゲットユーザー',
      trend: getTopAnswer(data, COL.age),
      suggestion: '主要ユーザー層を基準に、視認性・操作性・長時間使用時の快適性を重視する。'
    },
    {
      category: '試聴環境',
      trend: getTopAnswer(data, COL.room),
      suggestion: '一般住宅やデスクトップ環境への設置性を考慮し、コンパクト性と放熱性を両立する。'
    },
    {
      category: '出力',
      trend: topPower,
      suggestion: '主要ニーズとして' + topPower + 'クラスを基準に、スピーカーとの組み合わせを想定した出力設計を行う。'
    },
    {
      category: '音質',
      trend: getTopAnswer(data, COL.sound),
      suggestion: 'ユーザーが求める音の方向性を明確化し、測定性能と実際の聴感の両立を重視する。'
    },
    {
      category: 'デザイン',
      trend: getTopAnswer(data, COL.design),
      suggestion: '設置性を確保しながら、オーディオ製品としての質感・所有感を両立する。'
    },
    {
      category: '筐体',
      trend: getTopAnswer(data, COL.weight),
      suggestion: '筐体剛性・電源部・振動対策など、重量を音質・信頼性・製品価値につなげる設計を検討する。'
    },
    {
      category: '価格',
      trend: getTopAnswer(data, COL.price),
      suggestion: '主要価格帯を基準に、音質・電源・筐体・機能のコスト配分を最適化する。'
    }
  ];
}
