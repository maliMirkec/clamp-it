import * as vscode from 'vscode';

export function formatNumber(value: number, decimalPlaces: number): string {
  const factor = Math.pow(10, decimalPlaces);
  const roundedValue = Math.round(value * factor) / factor; // Round to specified decimal places
  return roundedValue.toString(); // Convert back to string
}

// Function to convert px to rem with proper formatting
export function formatRem(px: number, base: number = 16): string {
  const remValue = px / base; // Convert px to rem
  // Use the formatNumber function to handle rounding
  return formatNumber(remValue, 3) + 'rem'; // Format to 3 decimal places
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.clampIt', () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      // Parse the selected text
      const [mobileFontSize, desktopFontSize, customBaseFontSize, customViewportMin, customViewportMax] = selectedText.split(',').map(val => parseFloat(val.trim()));

      // Fetch global settings from the workspace configuration
      const globalMinViewport = vscode.workspace.getConfiguration().get('clampExtension.globalMinViewport', 600);
      const globalMaxViewport = vscode.workspace.getConfiguration().get('clampExtension.globalMaxViewport', 1200);
      const globalBaseFontSize = vscode.workspace.getConfiguration().get('clampExtension.baseFontSize', 16);

      // Check if a custom base font is provided; if not, use the global base font size
      const baseFontSize = customBaseFontSize || globalBaseFontSize;

      // Use custom viewport sizes if provided, otherwise use global settings
      const viewportMin = customViewportMin || globalMinViewport;
      const viewportMax = customViewportMax || globalMaxViewport;

      // Generate the clamp function in rem using the effective base font size
      const clampFunction = generateClampFunction(baseFontSize, mobileFontSize, desktopFontSize, viewportMin, viewportMax);

      // Replace the selected text with the clamp function
      editor.edit(editBuilder => {
        editBuilder.replace(selection, clampFunction);
      });
    }
  });

  context.subscriptions.push(disposable);
}

// Function to generate the clamp() function in rem
export function generateClampFunction(baseFontSize: number, mobileFontSize: number, desktopFontSize: number, viewportMin: number, viewportMax: number): string {
  // Convert all values to rem using the specified base font size
  const baseFontSizeRem = formatRem(baseFontSize, baseFontSize);
  const mobileFontSizeRem = formatRem(mobileFontSize, baseFontSize);
  const desktopFontSizeRem = formatRem(desktopFontSize, baseFontSize);

  // Calculate slope and intersection in rem
  const slope = (desktopFontSize - mobileFontSize) / (viewportMax - viewportMin);
  const yAxisIntersection = -viewportMin * slope + mobileFontSize;
  const vw = slope * 100;

  // Generate clamp string in rem
  return `clamp(${mobileFontSizeRem}, calc(${formatRem(yAxisIntersection, baseFontSize)} + ${formatNumber(vw, 3)}vw), ${desktopFontSizeRem}); /* mobile: ${mobileFontSize}px, desktop: ${desktopFontSize}px */`;
}

export function deactivate() {}
