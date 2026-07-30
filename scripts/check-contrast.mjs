const pairs = [
  ["Primary button", "#FFFFFF", "#1B4EF5", 4.5],
  ["Body text", "#101828", "#FFFFFF", 4.5],
  ["Secondary text", "#475467", "#FFFFFF", 4.5],
  ["Error text", "#B42318", "#FFFFFF", 4.5],
  ["Success text", "#067647", "#FFFFFF", 4.5],
  ["Warning text", "#B54708", "#FFFFFF", 4.5],
];

function luminance(hex) {
  const matches = hex.slice(1).match(/.{2}/g);
  if (!matches) throw new Error(`Invalid hex color: ${hex}`);
  const channels = matches.map((value) => Number.parseInt(value, 16) / 255);
  const converted = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * converted[0] + 0.7152 * converted[1] + 0.0722 * converted[2];
}

function ratio(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const failures = [];
for (const [name, foreground, background, minimum] of pairs) {
  const value = ratio(foreground, background);
  console.log(`${name}: ${value.toFixed(2)}:1`);
  if (value < minimum) failures.push(`${name} is below ${minimum}:1`);
}

if (failures.length) {
  console.error("\nContrast check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Contrast check passed.");