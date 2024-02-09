// favicon.ts
export function createFavicon() {
        // Create a canvas element
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = 64; // Set the size of the favicon
        canvas.height = 64;
    
        // Get the 2D context
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    
        if (ctx) {
            // Calculate the radius of the outer and inner circles
            const outerRadius: number = 32;
            const innerRadius: number = 1;
    
            // Calculate the center coordinates of the canvas
            const centerX: number = canvas.width / 2;
            const centerY: number = canvas.height / 2;
    
            // Create a radial gradient
            const gradient: CanvasGradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
            gradient.addColorStop(0, '#DC0999');
            gradient.addColorStop(1, '#05ACFF');
    
            // Draw the outer circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
            ctx.fillStyle = gradient;
            ctx.fill();
    
            // Draw the inner circle to create the doughnut shape
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff'; // Set the inner circle color to white
            ctx.fill();
    
            // Convert the canvas to a data URL
            const faviconURL: string = canvas.toDataURL('image/png');
    
            // Set the href attribute of the favicon link element to the data URL
            const linkElement: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
            if (linkElement) {
                linkElement.href = faviconURL;
            }
        }
}
