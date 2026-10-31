// Figma Plugin Backend Sandbox: Clinical & Scientific Medical Infographics
// 100% Modern Evidence-Based Clinical Medicine (Clinical Pathology, Cardiology, Hematology)

figma.showUI(__html__, { width: 380, height: 600, themeColors: true });

interface LabRangeData {
  testName: string;
  patientValue: number;
  minNormal: number;
  maxNormal: number;
  unit: string;
  criticalLow?: number;
  criticalHigh?: number;
}

interface EcgWaveData {
  rhythm: string;
  heartRate: number;
  amplitudeMv: number;
  sampleCount: number;
}

interface PaletteColor {
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  role: string;
}

figma.ui.onmessage = async (msg: { type: string; payload: any }) => {
  if (msg.type === "insert-lab-range") {
    await insertLabRange(msg.payload as LabRangeData);
  } else if (msg.type === "insert-ecg-wave") {
    await insertEcgWave(msg.payload as EcgWaveData);
  } else if (msg.type === "insert-palette") {
    await insertPalette(msg.payload as PaletteColor[]);
  } else if (msg.type === "close") {
    figma.closePlugin();
  }
};

async function insertLabRange(data: LabRangeData) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  const isLow = data.patientValue < data.minNormal;
  const isHigh = data.patientValue > data.maxNormal;
  const isNormal = !isLow && !isHigh;

  // Status color: Green for Normal, Red for High/Critical, Blue for Low
  let statusColor = { r: 0.13, g: 0.77, b: 0.36 }; // Green
  let statusText = "NORMAL";
  if (isHigh) {
    statusColor = { r: 0.94, g: 0.27, b: 0.24 }; // Red
    statusText = "ELEVATED / HIGH";
  } else if (isLow) {
    statusColor = { r: 0.23, g: 0.51, b: 0.96 }; // Blue
    statusText = "BELOW NORMAL";
  }

  // Create parent frame with auto-layout
  const card = figma.createFrame();
  card.name = `Lab Result - ${data.testName}`;
  card.layoutMode = "VERTICAL";
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(340, 160);
  card.itemSpacing = 12;
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.paddingTop = 16;
  card.paddingBottom = 16;
  card.cornerRadius = 12;
  card.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 1.0 } }];
  card.strokes = [{ type: "SOLID", color: { r: 0.88, g: 0.91, b: 0.94 } }];
  card.strokeWeight = 1;

  // Header row (Test Name & Status Badge)
  const header = figma.createFrame();
  header.name = "Header Row";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "AUTO";
  header.resize(308, 28);
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.fills = [];

  const title = figma.createText();
  title.characters = data.testName;
  title.fontName = { family: "Inter", style: "Bold" };
  title.fontSize = 14;
  title.fills = [{ type: "SOLID", color: { r: 0.08, g: 0.11, b: 0.15 } }];
  header.appendChild(title);

  const badge = figma.createFrame();
  badge.name = "Status Badge";
  badge.layoutMode = "HORIZONTAL";
  badge.paddingLeft = 8;
  badge.paddingRight = 8;
  badge.paddingTop = 4;
  badge.paddingBottom = 4;
  badge.cornerRadius = 6;
  badge.fills = [{ type: "SOLID", color: statusColor }];

  const badgeText = figma.createText();
  badgeText.characters = statusText;
  badgeText.fontName = { family: "Inter", style: "Bold" };
  badgeText.fontSize = 10;
  badgeText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  badge.appendChild(badgeText);
  header.appendChild(badge);

  card.appendChild(header);

  // Value Display
  const valueText = figma.createText();
  valueText.characters = `${data.patientValue} ${data.unit}`;
  valueText.fontName = { family: "Inter", style: "Bold" };
  valueText.fontSize = 22;
  valueText.fills = [{ type: "SOLID", color: statusColor }];
  card.appendChild(valueText);

  // Reference bar container
  const barContainer = figma.createFrame();
  barContainer.name = "Reference Track";
  barContainer.resize(308, 12);
  barContainer.cornerRadius = 6;
  barContainer.fills = [{ type: "SOLID", color: { r: 0.90, g: 0.92, b: 0.95 } }];

  // Normal zone marker
  const normalMarker = figma.createRectangle();
  normalMarker.name = "Normal Range Zone";
  normalMarker.resize(180, 12);
  normalMarker.x = 64;
  normalMarker.y = 0;
  normalMarker.cornerRadius = 6;
  normalMarker.fills = [{ type: "SOLID", color: { r: 0.75, g: 0.94, b: 0.82 } }];
  barContainer.appendChild(normalMarker);

  // Needle indicator
  const needle = figma.createRectangle();
  needle.name = "Patient Indicator Needle";
  needle.resize(4, 18);
  needle.y = -3;
  // Position needle proportional to value
  let pct = (data.patientValue - (data.minNormal * 0.6)) / ((data.maxNormal * 1.4) - (data.minNormal * 0.6));
  pct = Math.max(0.05, Math.min(0.95, pct));
  needle.x = pct * 308;
  needle.fills = [{ type: "SOLID", color: { r: 0.08, g: 0.11, b: 0.15 } }];
  barContainer.appendChild(needle);

  card.appendChild(barContainer);

  // Footer notes: Reference Range details
  const footerText = figma.createText();
  footerText.characters = `Standard Reference Range: ${data.minNormal} - ${data.maxNormal} ${data.unit} (Evidence-Based Clinical Pathology)`;
  footerText.fontName = { family: "Inter", style: "Regular" };
  footerText.fontSize = 10;
  footerText.fills = [{ type: "SOLID", color: { r: 0.45, g: 0.50, b: 0.58 } }];
  card.appendChild(footerText);

  // Place on canvas
  figma.currentPage.appendChild(card);
  figma.currentPage.selection = [card];
  figma.viewport.scrollAndZoomIntoView([card]);
  figma.notify(`Inserted ${data.testName} Lab Range graphic!`);
}

async function insertEcgWave(data: EcgWaveData) {
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const container = figma.createFrame();
  container.name = `ECG Strip - ${data.rhythm} (${data.heartRate} BPM)`;
  container.resize(480, 180);
  container.cornerRadius = 8;
  container.fills = [{ type: "SOLID", color: { r: 0.04, g: 0.06, b: 0.09 } }]; // ECG Dark monitor background
  container.strokes = [{ type: "SOLID", color: { r: 0.18, g: 0.22, b: 0.28 } }];

  // Title
  const label = figma.createText();
  label.x = 16;
  label.y = 12;
  label.characters = `LEAD II | ${data.rhythm.toUpperCase()} | HR: ${data.heartRate} BPM | 25mm/s 10mm/mV`;
  label.fontName = { family: "Inter", style: "Bold" };
  label.fontSize = 11;
  label.fills = [{ type: "SOLID", color: { r: 0.0, g: 0.90, b: 0.46 } }]; // Medical Phosphor Green
  container.appendChild(label);

  // Build SVG path string for realistic P-QRS-T complex repeated over 480px width
  let pathD = "M 0 100 ";
  const cycleWidth = 480 / 4; // 4 cardiac cycles
  for (let i = 0; i < 4; i++) {
    const x0 = i * cycleWidth;
    // Isoelectric segment
    pathD += `L ${x0 + 10} 100 `;
    // P wave (atrial depolarization)
    pathD += `Q ${x0 + 20} 85, ${x0 + 30} 100 `;
    // PR segment
    pathD += `L ${x0 + 40} 100 `;
    // Q wave (septal depolarization)
    pathD += `L ${x0 + 45} 110 `;
    // R wave (ventricular depolarization peak)
    pathD += `L ${x0 + 52} ${40 - (data.amplitudeMv * 5)} `;
    // S wave
    pathD += `L ${x0 + 58} 125 `;
    // ST segment
    pathD += `L ${x0 + 70} 100 `;
    // T wave (ventricular repolarization)
    pathD += `Q ${x0 + 85} 75, ${x0 + 100} 100 `;
    // Isoelectric rest
    pathD += `L ${x0 + cycleWidth} 100 `;
  }

  const wave = figma.createVector();
  wave.name = "P-QRS-T Waveform Vector";
  wave.vectorPaths = [{ windingRule: "NONZERO", data: pathD }];
  wave.strokes = [{ type: "SOLID", color: { r: 0.0, g: 1.0, b: 0.5 } }];
  wave.strokeWeight = 2;
  wave.strokeCap = "ROUND";
  wave.strokeJoin = "ROUND";
  container.appendChild(wave);

  figma.currentPage.appendChild(container);
  figma.currentPage.selection = [container];
  figma.viewport.scrollAndZoomIntoView([container]);
  figma.notify(`Generated ECG ${data.rhythm} Rhythm Strip!`);
}

async function insertPalette(colors: PaletteColor[]) {
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const container = figma.createFrame();
  container.name = "WCAG AAA Clinical Triage Color Palette";
  container.layoutMode = "HORIZONTAL";
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";
  container.itemSpacing = 12;
  container.paddingLeft = 16;
  container.paddingRight = 16;
  container.paddingTop = 16;
  container.paddingBottom = 16;
  container.cornerRadius = 12;
  container.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  container.strokes = [{ type: "SOLID", color: { r: 0.88, g: 0.91, b: 0.94 } }];

  for (const c of colors) {
    const swatch = figma.createFrame();
    swatch.name = c.name;
    swatch.layoutMode = "VERTICAL";
    swatch.primaryAxisSizingMode = "AUTO";
    swatch.counterAxisSizingMode = "FIXED";
    swatch.resize(100, 130);
    swatch.itemSpacing = 6;
    swatch.fills = [];

    const box = figma.createRectangle();
    box.resize(100, 64);
    box.cornerRadius = 8;
    box.fills = [{ type: "SOLID", color: { r: c.r, g: c.g, b: c.b } }];
    swatch.appendChild(box);

    const label = figma.createText();
    label.characters = c.name;
    label.fontName = { family: "Inter", style: "Bold" };
    label.fontSize = 11;
    label.fills = [{ type: "SOLID", color: { r: 0.08, g: 0.11, b: 0.15 } }];
    swatch.appendChild(label);

    const hex = figma.createText();
    hex.characters = c.hex;
    hex.fontName = { family: "Inter", style: "Regular" };
    hex.fontSize = 10;
    hex.fills = [{ type: "SOLID", color: { r: 0.45, g: 0.50, b: 0.58 } }];
    swatch.appendChild(hex);

    const role = figma.createText();
    role.characters = c.role;
    role.fontName = { family: "Inter", style: "Regular" };
    role.fontSize = 9;
    role.fills = [{ type: "SOLID", color: { r: 0.55, g: 0.60, b: 0.68 } }];
    swatch.appendChild(role);

    container.appendChild(swatch);
  }

  figma.currentPage.appendChild(container);
  figma.currentPage.selection = [container];
  figma.viewport.scrollAndZoomIntoView([container]);
  figma.notify("Inserted WCAG AAA Clinical Color Palette Swatches!");
}
