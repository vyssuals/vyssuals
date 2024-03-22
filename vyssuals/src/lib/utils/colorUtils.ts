// function for creating an array of colors. inputs: number of colors, start color, end color.
export function createColorArray(numColors: number, startColor: string, endColor: string): string[] {
    if (numColors < 2) {
        return [startColor];
    }
    const start = hexToRgb(startColor);
    const end = hexToRgb(endColor);
    const steps: number = numColors - 1;
    const colors: string[] = [];
    for (let i = 0; i < numColors; i++) {
        const rgb = {
            r: Math.round(start.r + (end.r - start.r) * (i / steps)),
            g: Math.round(start.g + (end.g - start.g) * (i / steps)),
            b: Math.round(start.b + (end.b - start.b) * (i / steps))
        };
        colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
    return colors;
}

// function for converting hex color to rgb
function hexToRgb(hex: string): { r: number, g: number, b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

// function for converting rgb color to hex
function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function darkenHexColor(color: string, amount: number): string {
    // Convert the hex color to RGB
    let { r, g, b } = hexToRgb(color);

    // Subtract the amount from each color component
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    // Convert the color components back to a hex color
    return rgbToHex(r, g, b);
}

export function lightenHexColor(color: string, amount: number): string {
    // Convert the hex color to RGB
    let { r, g, b } = hexToRgb(color);

    // Add the amount to each color component
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);

    // Convert the color components back to a hex color
    return rgbToHex(r, g, b);
}