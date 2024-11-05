// Use `Vibrant` in script
// https://jariz.github.io/vibrant.js/

// Load CSV file using PapaParse
// https://www.papaparse.com/

Vibrant.from('https://ids.si.edu/ids/deliveryService?id=NMAAHC-2007_3_411_002.jpg').getPalette(function(err, palette) {
  if (err) {
    console.error('Error fetching palette:', err);
    return;
  }

  for (let swatch in palette) {
    if (palette[swatch]) {
      console.log(swatch, palette[swatch].getHex());
      const hsl = palette[swatch].getHsl();
      console.log(`Hue: ${hsl[0]}, Saturation: ${hsl[1]}`);
      
      const div = document.createElement("div");
      div.className = 'swatch';
      div.style.backgroundColor = palette[swatch].getHex();
      let element = document.getElementById("palette_container");
      element.appendChild(div);
    }
  }

  let totalHue = 0;
  let totalSaturation = 0;
  let swatchCount = 0;

  for (let swatch in palette) {
    if (palette[swatch]) {
      const hsl = palette[swatch].getHsl();
      totalHue += hsl[0];
      totalSaturation += hsl[1];
      swatchCount++;
    }
  }

  if (swatchCount > 0) {
    const averageHue = totalHue / swatchCount;
    const averageSaturation = totalSaturation / swatchCount;

    console.log(`Average Hue: ${averageHue}`);
    console.log(`Average Saturation: ${averageSaturation}`);
  } else {
    console.log('No valid swatches found.');
  }
});