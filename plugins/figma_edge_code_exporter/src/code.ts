// Figma Plugin Backend Sandbox: Edge UI Tokens & Code Exporter

figma.showUI(__html__, { width: 420, height: 620, themeColors: true });

figma.on("selectionchange", () => {
  sendSelectionData();
});

function sendSelectionData() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: "no-selection" });
    return;
  }

  const node = selection[0];
  const tailwindClasses: string[] = [];
  const cssVars: Record<string, string> = {};

  // Width & Height
  tailwindClasses.push(`w-[${Math.round(node.width)}px]`);
  tailwindClasses.push(`h-[${Math.round(node.height)}px]`);

  // Fills / Background
  if ("fills" in node && Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === "SOLID") {
      const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
      tailwindClasses.push(`bg-[${hex}]`);
      cssVars["--bg-color"] = hex;
    }
  }

  // Corner Radius
  if ("cornerRadius" in node && typeof node.cornerRadius === "number" && node.cornerRadius > 0) {
    tailwindClasses.push(`rounded-[${node.cornerRadius}px]`);
    cssVars["--border-radius"] = `${node.cornerRadius}px`;
  }

  // Auto Layout
  if ("layoutMode" in node) {
    if (node.layoutMode === "HORIZONTAL") {
      tailwindClasses.push("flex flex-row");
    } else if (node.layoutMode === "VERTICAL") {
      tailwindClasses.push("flex flex-col");
    }
    if (node.itemSpacing > 0) {
      tailwindClasses.push(`gap-[${node.itemSpacing}px]`);
    }
    if (node.paddingLeft > 0) {
      tailwindClasses.push(`px-[${node.paddingLeft}px]`);
    }
    if (node.paddingTop > 0) {
      tailwindClasses.push(`py-[${node.paddingTop}px]`);
    }
  }

  // React JSX representation
  const jsxName = sanitizeTagName(node.name);
  const jsx = `<div className="${tailwindClasses.join(" ")}" data-figma-id="${node.id}">\n  {/* ${node.name} */}\n</div>`;

  figma.ui.postMessage({
    type: "selection-data",
    payload: {
      name: node.name,
      tailwind: tailwindClasses.join(" "),
      cssVars,
      jsx
    }
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  const to255 = (c: number) => Math.round(c * 255).toString(16).padStart(2, "0");
  return `#${to255(r)}${to255(g)}${to255(b)}`.toUpperCase();
}

function sanitizeTagName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}

figma.ui.onmessage = async (msg: { type: string; payload: any }) => {
  if (msg.type === "create-responsive-artboards") {
    createResponsiveArtboards();
  }
};

function createResponsiveArtboards() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Select a frame to create responsive artboards!");
    return;
  }

  const base = selection[0];
  const breakpoints = [
    { name: "Mobile", width: 375 },
    { name: "Tablet", width: 768 },
    { name: "Desktop", width: 1440 }
  ];

  let currentX = base.x + base.width + 100;
  const created: FrameNode[] = [];

  for (const bp of breakpoints) {
    const clone = base.clone() as FrameNode;
    clone.name = `${base.name} - ${bp.name} (${bp.width}px)`;
    clone.resize(bp.width, clone.height);
    clone.x = currentX;
    clone.y = base.y;
    currentX += bp.width + 80;
    figma.currentPage.appendChild(clone);
    created.push(clone);
  }

  figma.currentPage.selection = created;
  figma.viewport.scrollAndZoomIntoView(created);
  figma.notify("Generated Mobile, Tablet & Desktop responsive artboards!");
}
