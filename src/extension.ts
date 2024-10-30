import * as vscode from "vscode";

export function formatNumber(value: number, decimalPlaces: number): string {
  const factor = Math.pow(10, decimalPlaces);
  const roundedValue = Math.round(value * factor) / factor; // Round to specified decimal places
  return roundedValue.toString(); // Convert back to string
}

// Function to convert px to rem with proper formatting
export function formatRem(px: number, base: number = 16): string {
  const remValue = px / base; // Convert px to rem
  // Use the formatNumber function to handle rounding
  return formatNumber(remValue, 3) + "rem"; // Format to 3 decimal places
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.clampIt", () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      // Parse the selected text
      const [
        mobileFontSize,
        desktopFontSize,
        customBaseFontSize,
        customViewportMin,
        customViewportMax,
      ] = selectedText.split(",").map((val) => parseFloat(val.trim()));

      // Fetch global settings from the workspace configuration
      const globalMinViewport = vscode.workspace
        .getConfiguration()
        .get("clampExtension.globalMinViewport", 600);
      const globalMaxViewport = vscode.workspace
        .getConfiguration()
        .get("clampExtension.globalMaxViewport", 1200);
      const globalBaseFontSize = vscode.workspace
        .getConfiguration()
        .get("clampExtension.baseFontSize", 16);

      // Check if a custom base font is provided; if not, use the global base font size
      const baseFontSize = customBaseFontSize || globalBaseFontSize;

      // Use custom viewport sizes if provided, otherwise use global settings
      const viewportMin = customViewportMin || globalMinViewport;
      const viewportMax = customViewportMax || globalMaxViewport;

      // Generate the clamp function in rem using the effective base font size
      const clampFunction = generateClampFunction(
        baseFontSize,
        mobileFontSize,
        desktopFontSize,
        viewportMin,
        viewportMax
      );


      // Check if NaN is part of the computed string
      if(clampFunction.includes('NaN')) {
        // Show error message
        vscode.window.showErrorMessage('Please select valid font sizes and/or viewport values (comma-separated).')
      } else {
        // Replace the selected text with the clamp function
        editor.edit(editBuilder => {
          editBuilder.replace(selection, clampFunction);
        });
      }

    }
  });

  context.subscriptions.push(disposable);
}

// Function to generate the clamp() function in rem
export function generateClampFunction(
  baseFontSize: number,
  mobileFontSize: number,
  desktopFontSize: number,
  viewportMin: number,
  viewportMax: number
): string {
  // set Min font size and Max font size for clamp function
  const minFontSize = Math.min(mobileFontSize, desktopFontSize);
  const maxFontSize = Math.max(mobileFontSize, desktopFontSize);

  // Convert all values to rem using the specified base font size
  const minFontSizeRem = formatRem(minFontSize, baseFontSize);
  const maxFontSizeRem = formatRem(maxFontSize, baseFontSize);

  // Calculate slope and intersection in rem
  const slope =
    (desktopFontSize - mobileFontSize) / (viewportMax - viewportMin);
  const yAxisIntersection = -viewportMin * slope + mobileFontSize;
  const vw = slope * 100;

  // Generate clamp string in rem
  return `clamp(${minFontSizeRem}, calc(${formatRem(
    yAxisIntersection,
    baseFontSize
  )} + ${formatNumber(vw, 3)}vw), ${maxFontSizeRem})`;
}

export function deactivate() {}
