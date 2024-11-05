// analyzeColors.js

const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const Vibrant = require('node-vibrant');
const { createObjectCsvWriter } = require('csv-writer');

// Path to your CSV file
const csvFilePath = 'df_wMus_clean_3.csv';

// Define the headers for the output CSV
const csvWriter = createObjectCsvWriter({
    path: 'color_analysis_results.csv',
    header: [
        // Existing columns from the input CSV
        { id: 'imageUrl', title: 'imageUrl' },
        { id: 'hue', title: 'hue' },
        { id: 'saturation', title: 'saturation' },
        // New columns to be added
        { id: 'lightness', title: 'lightness' },
        { id: 'vibrant', title: 'vibrant' },
        { id: 'muted', title: 'muted' },
        { id: 'darkVibrant', title: 'darkVibrant' },
        { id: 'darkMuted', title: 'darkMuted' },
        { id: 'lightVibrant', title: 'lightVibrant' },
    ],
    append: false, // Overwrite the file if it exists
});

// Function to process a single image URL and extract required color data
async function processImage(url) {
    try {
        // Fetch image as buffer
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Use Vibrant to get the palette
        const palette = await Vibrant.from(buffer).getPalette();

        // Initialize an object to hold hex values of swatches
        const swatchHex = {
            vibrant: 'N/A',
            muted: 'N/A',
            darkVibrant: 'N/A',
            darkMuted: 'N/A',
            lightVibrant: 'N/A',
        };

        // Extract hex values for all swatches
        for (const swatchName in swatchHex) {
            if (palette[swatchName.charAt(0).toUpperCase() + swatchName.slice(1)]) {
                swatchHex[swatchName] = palette[swatchName.charAt(0).toUpperCase() + swatchName.slice(1)].getHex();
            }
        }

        // Access the Vibrant swatch for lightness
        const vibrantSwatch = palette.Vibrant;

        let lightness = 'N/A';
        if (vibrantSwatch) {
            const hsl = vibrantSwatch.getHsl(); // [hue, saturation, lightness]
            lightness = (hsl[2] * 100).toFixed(2); // Convert to percentage (0-100)
        } else {
            console.warn(`No Vibrant swatch found for image: ${url}`);
        }

        return { ...swatchHex, lightness };
    } catch (error) {
        console.error(`Error processing image ${url}:`, error.message);
        return {
            lightness: 'N/A',
            vibrant: 'N/A',
            muted: 'N/A',
            darkVibrant: 'N/A',
            darkMuted: 'N/A',
            lightVibrant: 'N/A',
        };
    }
}

// Array to hold all processed rows
const colorAnalysisResults = [];

// Read and parse the CSV file
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        // Ensure the 'media1' column exists and is not empty
        if (row.media1 && typeof row.media1 === 'string') {
            // Append '.jpg' if not already present
            const imageUrl = row.media1.endsWith('.jpg') ? row.media1 : `${row.media1}.jpg`;

            // Push the row along with the image URL to the results array
            colorAnalysisResults.push({
                imageUrl,
                hue: row.hue || 'N/A', // Retain existing hue
                saturation: row.saturation || 'N/A', // Retain existing saturation
            });
        }
    })
    .on('end', async () => {
        console.log(`CSV file successfully processed. Total images found: ${colorAnalysisResults.length}\n`);
        console.log(`Analyzing all ${colorAnalysisResults.length} images...\n`);

        // Iterate over each image and extract color data
        for (let i = 0; i < colorAnalysisResults.length; i++) {
            const row = colorAnalysisResults[i];
            const url = row.imageUrl;
            console.log(`Processing image ${i + 1}/${colorAnalysisResults.length}: ${url}`);

            const { hue, saturation, ...additionalData } = row; // Existing hue and saturation

            // Process image to get additional color data
            const colorData = await processImage(url);

            // Merge existing data with new data
            colorAnalysisResults[i] = {
                ...row, // imageUrl, hue, saturation
                ...colorData, // lightness and swatch hex values
            };

            console.log(`Lightness: ${colorData.lightness}%`);
            console.log(`Vibrant: ${colorData.vibrant}`);
            console.log(`Muted: ${colorData.muted}`);
            console.log(`DarkVibrant: ${colorData.darkVibrant}`);
            console.log(`DarkMuted: ${colorData.darkMuted}`);
            console.log(`LightVibrant: ${colorData.lightVibrant}\n`);

            // Optional: Wait for 1 second before processing the next image to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Write the results to the new CSV file
        try {
            await csvWriter.writeRecords(colorAnalysisResults);
            console.log(`Color analysis completed. Results saved to color_analysis_results.csv`);
        } catch (err) {
            console.error('Error writing results to CSV:', err.message);
        }

        console.log('Color analysis for all images completed.');
    });



// // analyzeColors.js

// const fs = require('fs');
// const csv = require('csv-parser');
// const axios = require('axios');
// const Vibrant = require('node-vibrant');

// // Path to your CSV file
// const csvFilePath = 'df_wMus_clean_3.csv';

// // Function to process a single image URL and extract Vibrant hue and saturation
// async function processImage(url) {
//     try {
//         // Fetch image as buffer
//         const response = await axios.get(url, { responseType: 'arraybuffer' });
//         const buffer = Buffer.from(response.data, 'binary');

//         // Use Vibrant to get the palette
//         const palette = await Vibrant.from(buffer).getPalette();

//         // Access the Vibrant swatch
//         const vibrantSwatch = palette.Vibrant;

//         if (vibrantSwatch) {
//             const hsl = vibrantSwatch.getHsl(); // [hue, saturation, lightness]
//             const hueDegrees = hsl[0] * 360; // Convert to degrees (0-360)
//             const saturationPercent = hsl[1] * 100; // Convert to percentage (0-100)

//             return { hue: hueDegrees.toFixed(2), saturation: saturationPercent.toFixed(2) };
//         } else {
//             console.warn(`No Vibrant swatch found for image: ${url}`);
//             return { hue: 'N/A', saturation: 'N/A' };
//         }
//     } catch (error) {
//         console.error(`Error processing image ${url}:`, error.message);
//         return { hue: 'N/A', saturation: 'N/A' };
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
//         console.log(`CSV file successfully processed. Total images found: ${imageUrls.length}\n`);

       
//         console.log(`Analyzing all ${imageUrls.length} images...\n`);

//         // Array to hold the results
//         const colorAnalysisResults = [];

//         // Process each image and log the Vibrant hue and saturation
//         for (let i = 0; i < imageUrls.length; i++) {
//             const url = imageUrls[i];
//             console.log(`Processing image ${i + 1}/${imageUrls.length}: ${url}`);

//             const { hue, saturation } = await processImage(url);

//             console.log(`Hue: ${hue} degrees`);
//             console.log(`Saturation: ${saturation}%\n`);

//             colorAnalysisResults.push({
//             imageUrl: url,
//             hue,
//             saturation,
//             });

//             // Wait for 1 second before processing the next image
//             await new Promise(resolve => setTimeout(resolve, 1000));
//         }

//         // Write the results to a new CSV file
//         const outputCsv = 'color_analysis_results.csv';
//         const header = 'imageUrl,hue,saturation\n';
//         const rows = colorAnalysisResults.map(result => `${result.imageUrl},${result.hue},${result.saturation}`).join('\n');

//         fs.writeFile(outputCsv, header + rows, (err) => {
//             if (err) {
//                 console.error('Error writing results to CSV:', err.message);
//             } else {
//                 console.log(`Color analysis completed. Results saved to ${outputCsv}`);
//             }
//         });

//         console.log('Color analysis for the first 5 images completed.');
//     });



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