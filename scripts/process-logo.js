const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join('C:', 'Users', 'casa', '.gemini', 'antigravity', 'brain', '55d5460c-de73-4c97-bb78-24ac5fa6b38f', 'media__1773190198084.png');
const outputPath = path.join(__dirname, '..', 'public', 'logo-login.png');

async function processImage() {
    try {
        console.log(`Processing image from ${inputPath}`);
        // Read the image
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // 1. Remove black background (make transparent)
        // We'll create a mask where black pixels become transparent
        // and non-black pixels remain opaque.

        // Convert to Raw buffer to manipulate pixels
        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Iterate through pixels
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If pixel is very close to black, make it transparent
            if (r < 20 && g < 20 && b < 20) {
                data[i + 3] = 0; // Alpha channel = 0 (transparent)
            }
        }

        // Create a new image from the modified buffer
        const isolatedLogo = sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        });

        // 2. Add white stroke/border around the green elements
        // Save the isolated logo temporarily
        const tempBuffer = await isolatedLogo.png().toBuffer();

        // We create an outlined version by composites
        const img = sharp(tempBuffer);

        // Use SVG for the white stroke
        const svgStroke = Buffer.from(`
            <svg width="${info.width}" height="${info.height}">
                <filter id="outline">
                    <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="1.5"></feMorphology>
                    <feFlood flood-color="white" flood-opacity="1" result="WHITE"></feFlood>
                    <feComposite in="WHITE" in2="DILATED" operator="in" result="OUTLINE"></feComposite>
                    <feMerge>
                        <feMergeNode in="OUTLINE" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <image width="100%" height="100%" href="data:image/png;base64,${tempBuffer.toString('base64')}" filter="url(#outline)" />
            </svg>
        `);

        await sharp(svgStroke)
            .png()
            .toFile(outputPath);

        console.log('Image processed successfully to ' + outputPath);

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

processImage();
