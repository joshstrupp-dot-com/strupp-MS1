// analyzeColors.js

const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const Vibrant = require('node-vibrant');

// Path to your CSV file
const csvFilePath = 'df_wMus_clean_2.csv';

// Function to process a single image URL and extract Vibrant hue and saturation
async function processImage(url) {
    try {
        // Fetch image as buffer
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Use Vibrant to get the palette
        const palette = await Vibrant.from(buffer).getPalette();

        // Access the Vibrant swatch
        const vibrantSwatch = palette.Vibrant;

        if (vibrantSwatch) {
            const hsl = vibrantSwatch.getHsl(); // [hue, saturation, lightness]
            const hueDegrees = hsl[0] * 360; // Convert to degrees (0-360)
            const saturationPercent = hsl[1] * 100; // Convert to percentage (0-100)

            return { hue: hueDegrees.toFixed(2), saturation: saturationPercent.toFixed(2) };
        } else {
            console.warn(`No Vibrant swatch found for image: ${url}`);
            return { hue: 'N/A', saturation: 'N/A' };
        }
    } catch (error) {
        console.error(`Error processing image ${url}:`, error.message);
        return { hue: 'N/A', saturation: 'N/A' };
    }
}

// Array to hold image URLs
const imageUrls = [];

// Read and parse the CSV file
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        // Ensure the 'media1' column exists and is not empty
        if (row.media1 && typeof row.media1 === 'string') {
            // Append '.jpg' if not already present
            const imageUrl = row.media1.endsWith('.jpg') ? row.media1 : `${row.media1}.jpg`;
            imageUrls.push(imageUrl);
        }
    })
    .on('end', async () => {
        console.log(`CSV file successfully processed. Total images found: ${imageUrls.length}\n`);

       
        console.log(`Analyzing all ${imageUrls.length} images...\n`);

        // Array to hold the results
        const colorAnalysisResults = [];

        // Process each image and log the Vibrant hue and saturation
        for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];
            console.log(`Processing image ${i + 1}/${imageUrls.length}: ${url}`);

            const { hue, saturation } = await processImage(url);

            console.log(`Hue: ${hue} degrees`);
            console.log(`Saturation: ${saturation}%\n`);

            colorAnalysisResults.push({
            imageUrl: url,
            hue,
            saturation,
            });

            // Wait for 1 second before processing the next image
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Write the results to a new CSV file
        const outputCsv = 'color_analysis_results.csv';
        const header = 'imageUrl,hue,saturation\n';
        const rows = colorAnalysisResults.map(result => `${result.imageUrl},${result.hue},${result.saturation}`).join('\n');

        fs.writeFile(outputCsv, header + rows, (err) => {
            if (err) {
                console.error('Error writing results to CSV:', err.message);
            } else {
                console.log(`Color analysis completed. Results saved to ${outputCsv}`);
            }
        });

        console.log('Color analysis for the first 5 images completed.');
    });



// // analyzeColors.js

// const fs = require('fs');
// const csv = require('csv-parser');
// const axios = require('axios');
// const Vibrant = require('node-vibrant');

// // Path to your CSV file
// const csvFilePath = 'df_wMus_clean_2.csv';

// // Function to process a single image URL
// async function processImage(url) {
//     try {
//         // Fetch image as buffer
//         const response = await axios.get(url, { responseType: 'arraybuffer' });
//         const buffer = Buffer.from(response.data, 'binary');

//         // Use Vibrant to get the palette
//         const palette = await Vibrant.from(buffer).getPalette();

//         // Collect hue and saturation from all swatches
//         let hues = [];
//         let saturations = [];

//         for (let swatch in palette) {
//             if (palette[swatch]) {
//                 const hsl = palette[swatch].getHsl(); // [hue, saturation, lightness]
//                 hues.push(hsl[0] * 360); // Convert to degrees (0-360)
//                 saturations.push(hsl[1] * 100); // Convert to percentage (0-100)
//             }
//         }

//         // Calculate average hue and saturation
//         let averageHue = null;
//         let averageSaturation = null;

//         if (hues.length > 0) {
//             averageHue = hues.reduce((a, b) => a + b, 0) / hues.length;
//         }

//         if (saturations.length > 0) {
//             averageSaturation = saturations.reduce((a, b) => a + b, 0) / saturations.length;
//         }

//         return { averageHue, averageSaturation };
//     } catch (error) {
//         console.error(`Error processing image ${url}:`, error.message);
//         return { averageHue: null, averageSaturation: null };
//     }
// }

// // Array to hold image URLs
// const imageUrls = [];

// // Read and parse the CSV file
// fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on('data', (row) => {
//         // Ensure the 'media1' column exists and is not empty
//         if (row.media1 && typeof row.media1 === 'string') {
//             // Append '.jpg' if not already present
//             const imageUrl = row.media1.endsWith('.jpg') ? row.media1 : `${row.media1}.jpg`;
//             imageUrls.push(imageUrl);
//         }
//     })
//     .on('end', async () => {
//         console.log(`CSV file successfully processed. Total images to analyze: ${imageUrls.length}\n`);

//         // Array to hold the results
//         const colorAnalysisResults = [];

//         // Process images sequentially or in parallel (here, sequentially for simplicity)
//         for (let i = 0; i < imageUrls.length; i++) {
//             const url = imageUrls[i];
//             console.log(`Processing image ${i + 1}/${imageUrls.length}: ${url}`);

//             const { averageHue, averageSaturation } = await processImage(url);

//             if (averageHue !== null && averageSaturation !== null) {
//                 console.log(`Average Hue: ${averageHue.toFixed(2)} degrees`);
//                 console.log(`Average Saturation: ${averageSaturation.toFixed(2)}%\n`);
//                 colorAnalysisResults.push({
//                     imageUrl: url,
//                     averageHue: averageHue.toFixed(2),
//                     averageSaturation: averageSaturation.toFixed(2),
//                 });
//             } else {
//                 console.log(`Failed to analyze colors for image: ${url}\n`);
//                 colorAnalysisResults.push({
//                     imageUrl: url,
//                     averageHue: 'N/A',
//                     averageSaturation: 'N/A',
//                 });
//             }
//         }

//         // Optionally, write the results to a new CSV file
//         const outputCsv = 'color_analysis_results.csv';
//         const header = 'imageUrl,averageHue,averageSaturation\n';
//         const rows = colorAnalysisResults.map(result => `${result.imageUrl},${result.averageHue},${result.averageSaturation}`).join('\n');

//         fs.writeFile(outputCsv, header + rows, (err) => {
//             if (err) {
//                 console.error('Error writing results to CSV:', err.message);
//             } else {
//                 console.log(`Color analysis completed. Results saved to ${outputCsv}`);
//             }
//         });
//     });