# Installation Guide — Figma & Canva Commercial Plugins

## 1. Running the Figma Plugins
1. Open the Figma Desktop App.
2. Navigate to **Plugins** > **Development** > **Import plugin from manifest...**.
3. Select either:
   - `plugins/figma_clinical_infographics/manifest.json` OR
   - `plugins/figma_edge_code_exporter/manifest.json`.
4. The plugin will immediately appear in your plugins menu and can be run with `Cmd + /` (macOS) or `Ctrl + /` (Windows).

## 2. Building from Source
```bash
cd plugins/figma_clinical_infographics
npm install
npm run build
```

## 3. Canva Apps SDK Setup
```bash
cd monetization_canva_sdk_kit/apps/canva_clinical_visualizer
npm install
npm run build
```
