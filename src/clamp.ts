export interface ClampSettings {
  viewportMin: number;
  viewportMax: number;
  baseFontSize: number;
  showComments: boolean;
}

export interface ClampInput {
  mobileFontSize: number;
  desktopFontSize: number;
  viewportMin: number;
  viewportMax: number;
  baseFontSize: number;
}

export function formatNumber(value: number, decimalPlaces: number): string {
  const rounded = Number(value.toFixed(decimalPlaces));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

export function formatRem(px: number, base = 16): string {
  return `${formatNumber(px / base, 3)}rem`;
}

export function parseInput(
  text: string,
  defaults: Omit<ClampSettings, 'showComments'>,
): ClampInput | string {
  const parts = text.split(',').map((part) => part.trim());

  if (parts.length > 5) {
    return 'Use at most 5 values: mobileFontSize, desktopFontSize, viewportMin, viewportMax, baseFontSize.';
  }

  const values: Array<number | undefined> = [];
  for (const part of parts) {
    if (part === '') {
      values.push(undefined);
      continue;
    }
    const match = /^(-?(?:\d+(?:\.\d*)?|\.\d+))(?:px)?$/i.exec(part);
    if (!match) {
      return `"${part}" is not a number.`;
    }
    values.push(Number(match[1]));
  }

  const [mobileFontSize, desktopFontSize, viewportMin, viewportMax, baseFontSize] = values;

  if (mobileFontSize === undefined || desktopFontSize === undefined) {
    return 'Select at least two values: mobileFontSize, desktopFontSize.';
  }

  const input: ClampInput = {
    mobileFontSize,
    desktopFontSize,
    viewportMin: viewportMin ?? defaults.viewportMin,
    viewportMax: viewportMax ?? defaults.viewportMax,
    baseFontSize: baseFontSize ?? defaults.baseFontSize,
  };

  if (input.mobileFontSize < 0 || input.desktopFontSize < 0) {
    return 'Font sizes cannot be negative.';
  }
  if (input.viewportMin < 0 || input.viewportMin >= input.viewportMax) {
    return `viewportMin (${input.viewportMin}) must be 0 or more and smaller than viewportMax (${input.viewportMax}).`;
  }
  if (input.baseFontSize <= 0) {
    return 'baseFontSize must be greater than 0.';
  }

  return input;
}

export function generateClampFunction(
  input: ClampInput,
  showComments = false,
): string {
  const { mobileFontSize, desktopFontSize, viewportMin, viewportMax, baseFontSize } = input;
  const minFontSize = Math.min(mobileFontSize, desktopFontSize);
  const maxFontSize = Math.max(mobileFontSize, desktopFontSize);
  const comment = showComments
    ? ` /* min: ${minFontSize}px, max: ${maxFontSize}px */`
    : '';

  if (mobileFontSize === desktopFontSize) {
    return `${formatRem(mobileFontSize, baseFontSize)}${comment}`;
  }

  const slope = (desktopFontSize - mobileFontSize) / (viewportMax - viewportMin);
  const intercept = mobileFontSize - slope * viewportMin;
  const vw = slope * 100;
  const sign = vw < 0 ? '-' : '+';

  const preferred = `calc(${formatRem(intercept, baseFontSize)} ${sign} ${formatNumber(Math.abs(vw), 3)}vw)`;

  return `clamp(${formatRem(minFontSize, baseFontSize)}, ${preferred}, ${formatRem(maxFontSize, baseFontSize)})${comment}`;
}
