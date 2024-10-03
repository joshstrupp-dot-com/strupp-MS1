// Fixed dimensions for the SVG canvas
// const svgWidth = window.innerWidth;
// window.addEventListener("resize", () => {
//   svg.attr("width", window.innerWidth);
// });
const svgWidth = 1136;
const svgHeight = 780;

// Set the background color to #F5F5F5
document.body.style.backgroundColor = "#F5F5F5";

function adjustLayout() {
  // Since we're using fixed dimensions, no adjustments are needed
}

// Create an SVG element and append it to the body
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth) // Set fixed width
  .attr("height", svgHeight); // Set fixed height

// Append a rectangle to the SVG
// Define a diagonal gradient
const gradient = svg
  .append("defs")
  .append("linearGradient")
  .attr("id", "diagonalGradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "100%");

gradient.append("stop").attr("offset", "0%").attr("stop-color", "#FFF1D5");

gradient.append("stop").attr("offset", "100%").attr("stop-color", "#FAE8C3");

// Append a rectangle to the SVG with the gradient fill
svg
  .append("rect")
  .attr("width", svgWidth) // Use fixed width
  .attr("height", svgHeight / 3) // Set height as one-third of svgHeight
  .attr("y", svgHeight - svgHeight / 3) // Position it at the bottom
  .attr("fill", "url(#diagonalGradient)");

// Since we have fixed dimensions, we don't need to adjust layout on resize
// window.addEventListener("resize", adjustLayout);

// Append a text element to the SVG for the title
svg
  .append("text")
  .attr("x", svgWidth / 2) // Center horizontally
  .attr("y", svgHeight / 4.8) // Position from the top
  .attr("text-anchor", "middle") // Center the text
  .attr("font-size", "150px") // Set font size
  .attr("font-family", "Londrina Solid, sans-serif") // Set font family
  .attr("fill", "#333") // Set text color
  .text("SMITHSOOOOONIAN");

// Append a rectangle (invisible) to define the text area for the subtitle
svg
  .append("rect")
  .attr("x", svgWidth * 0.089) // Position at 8.9% of the svg width
  .attr("y", svgHeight * 0.249 - 30) // Position at 24.9% of the svg height minus some padding
  .attr("width", 329) // Set the width of the box
  .attr("height", 251) // Set the height of the box
  .attr("fill", "none"); // No fill color
//   .attr("stroke", "#333"); // Uncomment to add a border
//   .attr("stroke-width", 2); // Set the border width

// Append the subtitle text
svg
  .append("text")
  .attr("x", svgWidth / 17) // Position at approximately 6% of svgWidth
  .attr("y", svgHeight / 3.3) // Position from the top
  .attr("text-anchor", "start") // Align text to the start
  .attr("font-size", "24px") // Set font size
  .attr("font-family", "Londrina Solid, sans-serif") // Set font family
  .attr("font-weight", "100") // Set font weight to thin
  .attr("font-style", "normal") // Set font style to normal
  .attr("fill", "#333") // Set text color
  .text("The Natural History Museum is the world's biggest — and it's even bigger than you think.")
  .call(wrap, 250); // Wrap text within 200 pixels width

// Function to wrap text within a specified width
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", text.attr("x"))
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", text.attr("x"))
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}








// Define a drop shadow filter
const defs = svg.append("defs");

const filter = defs
  .append("filter")
  .attr("id", "drop-shadow")
  .attr("height", "130%");

filter
  .append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", 3) // Adjust the blur radius
  .attr("result", "blur");

  filter
  .append("feComponentTransfer")
  .attr("in", "offsetBlur")
  .attr("result", "reducedOpacity")
  .call(function (feComponentTransfer) {
    feComponentTransfer
      .append("feFuncA")
      .attr("type", "linear")
      .attr("slope", 0.2); // Set opacity to 20%
  });

const feMerge = filter.append("feMerge");

feMerge.append("feMergeNode").attr("in", "offsetBlur");
feMerge.append("feMergeNode").attr("in", "SourceGraphic");








function floatAnimation(selection, state) {
  const translateY = 10; // Amount to move up and down
  const duration = 2000;

  function animateUp() {
    selection
      .transition()
      .duration(duration)
      .ease(d3.easeCubicInOut)
      .tween("float", function () {
        const interpolate = d3.interpolateNumber(0, -translateY);
        return function (t) {
          state.floatOffset = interpolate(t);
          updateTransform(selection, state);
        };
      })
      .on("end", animateDown);
  }

  function animateDown() {
    selection
      .transition()
      .duration(duration)
      .ease(d3.easeCubicInOut)
      .tween("float", function () {
        const interpolate = d3.interpolateNumber(-translateY, 0);
        return function (t) {
          state.floatOffset = interpolate(t);
          updateTransform(selection, state);
        };
      })
      .on("end", animateUp);
  }

  animateUp();
}


// Define initial positions and sizes
const eiffelX = -50;
const eiffelY = 340;
const eiffelWidth = svgWidth * 0.3;
const eiffelHeight = svgWidth * 0.3;

// Initialize the state object for transformations
const eiffelState = {
  x: eiffelX,
  y: eiffelY,
  scale: 1,
  floatOffset: 0,
};

// Create a group for the Eiffel Tower and toothpick
const eiffelGroup = svg
  .append("g")
  .attr("class", "eiffelGroup");

// Function to update the group's transform based on the state
function updateTransform(selection, state) {
  selection.attr(
    "transform",
    `translate(${state.x}, ${state.y + state.floatOffset}) ` +
    `translate(${eiffelWidth / 2}, ${eiffelHeight / 2}) ` +
    `scale(${state.scale}) ` +
    `translate(${-eiffelWidth / 2}, ${-eiffelHeight / 2})`
  );
}

// Initialize the group's transform
updateTransform(eiffelGroup, eiffelState);

const toothpickImage = eiffelGroup
  .append("image")
  .attr("xlink:href", "eiffel_flag.svg")
  .attr("width", svgWidth * 0.35) // Adjust size as needed
  .attr("height", svgWidth * 0.35)
  .attr("x", eiffelWidth * .27) // Position relative to the Eiffel Tower
  .attr("y", eiffelHeight * -.4)
  .style("display", "none"); // Initially hide the toothpick image


// Append the Eiffel Tower image
const eiffelImage = eiffelGroup
  .append("image")
  .attr("xlink:href", "eiffel.svg")
  .attr("width", eiffelWidth)
  .attr("height", eiffelHeight)
  .attr("x", 0)
  .attr("y", 0);

// Append the toothpick image, initially hidden


  // Start the floating animation
// floatAnimation(eiffelGroup, eiffelState);


eiffelGroup
  .on("mouseover", function () {
    // Scale up by 5 pixels (adjust the scale factor accordingly)
    eiffelState.scale = (eiffelWidth + 5) / eiffelWidth;
    updateTransform(eiffelGroup, eiffelState)
    // eiffelGroup.raise();

    // Apply drop shadow
    eiffelImage.attr("filter", "url(#drop-shadow)");

    // Show the toothpick image
    toothpickImage.style("display", null);
  })
  .on("mouseout", function () {
    // Reset the scale
    eiffelState.scale = 1;
    updateTransform(eiffelGroup, eiffelState);

    // Remove drop shadow
    eiffelImage.attr("filter", null);

    // Hide the toothpick image
    toothpickImage.style("display", "none");
  });









// Define initial positions and sizes
const rainforestX = 150;
const rainforestY = 330;
const rainforestWidth = 300;
const rainforestHeight = 300;

const rainforestState = {
  x: rainforestX,
  y: rainforestY,
  scale: 1,
  floatOffset: 0,
};

// Create a group for the rainforest image and toothpick
const rainforestGroup = svg.append("g");

function updateTransformRainforest(selection, state) {
  selection.attr(
    "transform",
    `translate(${state.x}, ${state.y + state.floatOffset}) ` +
    `translate(${rainforestWidth / 2}, ${rainforestHeight / 2}) ` +
    `scale(${state.scale}) ` +
    `translate(${-rainforestWidth / 2}, ${-rainforestHeight / 2})`
  );
}

updateTransformRainforest(rainforestGroup, rainforestState);

// Append the rainforest image
const rainforestImage = rainforestGroup
  .append("image")
  .attr("xlink:href", "rainforest.svg")
  .attr("width", rainforestWidth)
  .attr("height", rainforestHeight)
  .attr("x", 0)
  .attr("y", 0);

// Append the toothpick image, initially hidden
const rainforestToothpick = rainforestGroup
  .append("image")
  .attr("xlink:href", "rainforest_flag.svg")
  .attr("width", svgWidth * 0.35) // Adjust size as needed
  .attr("height", svgWidth * 0.35)
  .attr("x", rainforestWidth * 0.27) // Position relative to the rainforest image
  .attr("y", rainforestHeight * -0.3)
  .style("display", "none");

// Start the floating animation
// floatAnimation(rainforestGroup, rainforestState);

// Implement hover effects
rainforestGroup
  .on("mouseover", function () {
    rainforestState.scale = (rainforestWidth + 5) / rainforestWidth;
    updateTransformRainforest(rainforestGroup, rainforestState);
    rainforestGroup.raise();

    // Apply drop shadow
    rainforestImage.attr("filter", "url(#drop-shadow)");

    // Show the toothpick image
    rainforestToothpick.style("display", null);
  })
  .on("mouseout", function () {
    rainforestState.scale = 1;
    updateTransformRainforest(rainforestGroup, rainforestState);

    // Remove drop shadow
    rainforestImage.attr("filter", null);

    // Hide the toothpick image
    rainforestToothpick.style("display", "none");
  });











/////////////////////////////////////////////////////////////////////////////////

  // Define initial positions and sizes
  const astronautX = 10;
  const astronautY = 10;
  const astronautWidth = svgWidth * 0.2;
  const astronautHeight = svgWidth * 0.2;

  const astronautState = {
    x: astronautX,
    y: astronautY,
    scale: 1,
    floatOffset: 0,
  };

  // Create a group for the astronaut image and toothpick
  const astronautGroup = svg.append("g");

  function updateTransformAstronaut(selection, state) {
    selection.attr(
      "transform",
      `translate(${state.x}, ${state.y + state.floatOffset}) ` +
      `translate(${astronautWidth / 2}, ${astronautHeight / 2}) ` +
      `scale(${state.scale}) ` +
      `translate(${-astronautWidth / 2}, ${-astronautHeight / 2})`
    );
  }

  updateTransformAstronaut(astronautGroup, astronautState);

  // Append the astronaut image
  const astronautImage = astronautGroup
    .append("image")
    .attr("xlink:href", "astronaut.svg")
    .attr("width", astronautWidth)
    .attr("height", astronautHeight)
    .attr("x", 0)
    .attr("y", 0);

  // Append the toothpick image, initially hidden
  const astronautToothpick = astronautGroup
    .append("image")
    .attr("xlink:href", "astronaut-flag.svg")
    .attr("width", 300)
    .attr("height", 300)
    .attr("x", 50)
    .attr("y", -20)
    .style("display", "none");

  // Start the floating animation
  floatAnimation(astronautGroup, astronautState);

  // Implement hover effects
  astronautGroup
    .on("mouseover", function () {
      astronautState.scale = (astronautWidth + 5) / astronautWidth;
      updateTransformAstronaut(astronautGroup, astronautState);
      astronautImage.attr("filter", "url(#drop-shadow)");
      astronautToothpick.style("display", null);
    })
    .on("mouseout", function () {
      astronautState.scale = 1;
      updateTransformAstronaut(astronautGroup, astronautState);
      astronautImage.attr("filter", null);
      astronautToothpick.style("display", "none");
    });

  
  

  // Define initial positions and sizes
  const pyramidX = 700;
  const pyramidY = 300;
  const pyramidWidth = svgWidth * 0.3;
  const pyramidHeight = svgWidth * 0.3;

  const pyramidState = {
    x: pyramidX,
    y: pyramidY,
    scale: 1,
    floatOffset: 0,
  };

  // Create a group for the pyramid image and toothpick
  const pyramidGroup = svg.append("g");

  function updateTransformPyramid(selection, state) {
    selection.attr(
      "transform",
      `translate(${state.x}, ${state.y + state.floatOffset}) ` +
      `translate(${pyramidWidth / 2}, ${pyramidHeight / 2}) ` +
      `scale(${state.scale}) ` +
      `translate(${-pyramidWidth / 2}, ${-pyramidHeight / 2})`
    );
  }

  updateTransformPyramid(pyramidGroup, pyramidState);

  // Append the pyramid image
  const pyramidImage = pyramidGroup
    .append("image")
    .attr("xlink:href", "pyramids.svg")
    .attr("width", pyramidWidth)
    .attr("height", pyramidHeight)
    .attr("x", 0)
    .attr("y", 0);

  // Append the toothpick image, initially hidden
  const pyramidToothpick = pyramidGroup
    .append("image")
    .attr("xlink:href", "toothpick.svg")
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", pyramidWidth * 0.6)
    .attr("y", pyramidHeight * 0.5)
    .style("display", "none");

  // Start the floating animation
  // floatAnimation(pyramidGroup, pyramidState);

  // Implement hover effects
  pyramidGroup
    .on("mouseover", function () {
      pyramidState.scale = (pyramidWidth + 5) / pyramidWidth;
      updateTransformPyramid(pyramidGroup, pyramidState);
      pyramidImage.attr("filter", "url(#drop-shadow)");
      pyramidToothpick.style("display", null);
    })
    .on("mouseout", function () {
      pyramidState.scale = 1;
      updateTransformPyramid(pyramidGroup, pyramidState);
      pyramidImage.attr("filter", null);
      pyramidToothpick.style("display", "none");
    });


    // Define initial positions and sizes
    const statueX = 800;
    const statueY = 300;
    const statueWidth = 500;
    const statueHeight = 500;

    const statueState = {
      x: statueX,
      y: statueY,
      scale: 1,
      floatOffset: 0,
    };

    // Create a group for the statue image and toothpick
    const statueGroup = svg.append("g");

    function updateTransformStatue(selection, state) {
      selection.attr(
        "transform",
        `translate(${state.x}, ${state.y + state.floatOffset}) ` +
        `translate(${statueWidth / 2}, ${statueHeight / 2}) ` +
        `scale(${state.scale}) ` +
        `translate(${-statueWidth / 2}, ${-statueHeight / 2})`
      );
    }

    updateTransformStatue(statueGroup, statueState);

    // Append the statue image
    const statueImage = statueGroup
      .append("image")
      .attr("xlink:href", "statue.svg")
      .attr("width", statueWidth)
      .attr("height", statueHeight)
      .attr("x", 0)
      .attr("y", 0);

    // Append the toothpick image, initially hidden
    const statueToothpick = statueGroup
      .append("image")
      .attr("xlink:href", "toothpick.svg")
      .attr("width", 50)
      .attr("height", 50)
      .attr("x", statueWidth * 0.6)
      .attr("y", statueHeight * 0.5)
      .style("display", "none");

    // Start the floating animation
    // floatAnimation(statueGroup, statueState);

    // Implement hover effects
    statueGroup
      .on("mouseover", function () {
        statueState.scale = (statueWidth + 5) / statueWidth;
        updateTransformStatue(statueGroup, statueState);
        statueImage.attr("filter", "url(#drop-shadow)");
        statueToothpick.style("display", null);
      })
      .on("mouseout", function () {
        statueState.scale = 1;
        updateTransformStatue(statueGroup, statueState);
        statueImage.attr("filter", null);
        statueToothpick.style("display", "none");
      });






  svg
  .append("image")
  .attr("xlink:href", "books.svg")
  .attr("id", "bookImage") // Add an ID for easier selection
  .attr("width", svgWidth * 0.5) // Set width to 50% of svgWidth
  .attr("height", svgWidth * 0.5) // Set height proportional to width
  .attr("x", svgWidth / 2 - (svgWidth * 0.5) / 2) // Center horizontally
  .attr("y", svgHeight / 2 - (svgWidth * 0.5) / 2); // Center vertically
// Show the modal when the book image is clicked
d3.select("#bookImage").on("click", function () {
  // Reset the modal's position to offscreen at the bottom
  modal
    .attr("transform", `translate(0, ${modalHeight})`)
    .style("display", null) // Make the modal visible
    .transition()
    .duration(500) // Adjust duration as needed
    .attr("transform", "translate(0, 0)"); // Animate modal into view
});

svg
  .append("image")
  .attr("xlink:href", "inactive-books.svg")
  .attr("id", "inactiveBookImage") // Add an ID for easier selection
  .attr("width", svgWidth * 0.435) // Set width to 50% of svgWidth
  .attr("height", svgWidth * 0.427) // Set height proportional to width
  .attr("x", svgWidth / 2 - (svgWidth * 0.36) / 2) // Center horizontally
  .attr("y", svgHeight / 2 - (svgWidth * 0.365) / 2); // Center vertically
  
  // Append the mammal book image to the middle of the screen



    // Define initial positions and sizes
  const planeX = -svgWidth * 0.7; // Start off-screen to the left
  const planeY = 50;
  const planeWidth = svgWidth * .5;
  const planeHeight = svgWidth * .5;

  const planeState = {
    x: planeX,
    y: planeY,
    scale: 1,
    floatOffset: 0,
  };

  // Create a group for the plane image and toothpick
  const planeGroup = svg.append("g");

  function updateTransformPlane(selection, state) {
    selection.attr(
      "transform",
      `translate(${state.x}, ${state.y + state.floatOffset}) ` +
      `translate(${planeWidth / 2}, ${planeHeight / 2}) ` +
      `scale(${state.scale}) ` +
      `translate(${-planeWidth / 2}, ${-planeHeight / 2})`
    );
  }

  updateTransformPlane(planeGroup, planeState);

  


// // Append the toothpick image
// const toothpickImage = svg
//   .append("image")
//   .attr("xlink:href", "toothpick.svg") // Path to the image file
//   .attr("width", svgWidth * 0.1) // Set the width to 10% of svgWidth
//   .attr("height", svgWidth * 0.1) // Set the height to maintain aspect ratio
//   .attr("x", 30) // Position slightly to the right of the Eiffel Tower
//   .attr("y", svgHeight - svgWidth * 0.35) // Align vertically with the Eiffel Tower image
//   .attr(
//     "transform",
//     `rotate(30, ${30 + (svgWidth * 0.1) / 2}, ${
//       svgHeight - (svgWidth * 0.35) + (svgWidth * 0.1) / 2
//     })`
//   ) // Rotate 30 degrees around the center of the image
//   .style("display", "none"); // Initially hide the toothpick image

// // Show the toothpick image when hovering over the Eiffel Tower image
// eiffelImage.on("mouseover", function () {
//   toothpickImage.style("display", null);
// });

// // Hide the toothpick image when not hovering over the Eiffel Tower image
// eiffelImage.on("mouseout", function () {
//   toothpickImage.style("display", "none");
// });

// Fixed modal dimensions
const modalWidth = window.innerWidth;
window.addEventListener("resize", () => {
  svg.attr("width", window.innerWidth);
});
const modalHeight = 743;

// Create a modal group, initially hidden and positioned offscreen at the bottom
const modal = svg
  .append("g")
  .attr("class", "modal")
  .style("display", "none")
  .attr("transform", `translate(0, ${modalHeight})`); // Position offscreen at bottom


// Append the modal background rectangle
modal
  .append("rect")
  .attr("x", 20)
  .attr("y", 20)
  .attr("width", modalWidth - 40) // Adjusted width
  .attr("height", modalHeight - 40) // Adjusted height
  .attr("fill", "#F5F5F5")
  .attr("opacity", 0.995)
  .attr("stroke", "#000")
  .attr("stroke-width", 1)
  .attr("rx", 30)
  .attr("ry", 30);

// Append a close button to the modal
modal
  .append("text")
  .attr("x", modalWidth - 60) // Adjusted position
  .attr("y", 50)
  .attr("font-size", "24px")
  .attr("font-family", "sans-serif")
  .attr("fill", "#333")
  .attr("cursor", "pointer")
  .text("X")
  .on("click", function () {
    // Animate the modal sliding down and hide it after the animation
    modal
      .transition()
      .duration(500)
      .attr("transform", `translate(0, ${modalHeight})`)
      .on("end", function () {
        modal.style("display", "none");
      });
  });

svg
  .append("image")
  .attr("xlink:href", "mammal_book.svg")
  .attr("id", "mammalBookImageHome") // Add an ID for easier selection
  .attr("width", svgWidth * 0.5) // Set width to 50% of svgWidth
  .attr("height", svgWidth * 0.5) // Set height proportional to width
  .attr("x", svgWidth / 2 - (svgWidth * 0.74) / 2) // Center horizontally
  .attr("y", svgHeight / 2 - (svgWidth * 0.45) / 2) // Center vertically
  // .raise()
  // Show the modal when the book image is clicked
  .on("click", function () {
    // Reset the modal's position to offscreen at the bottom
    modal
      .attr("transform", `translate(0, ${modalHeight})`)
      .style("display", null) // Make the modal visible
      .transition()
      .duration(500) // Adjust duration as needed
      .attr("transform", "translate(0, 0)"); // Animate modal into view
  })
  // Add hover effects for drop shadow
  .on("mouseover", function () {
    d3.select(this).attr("filter", "url(#drop-shadow)")
    d3.select(this).style("cursor", "pointer");
  })
  .on("mouseout", function () {
    d3.select(this).attr("filter", null);
  });




  // Define the animation function for the mammal book image
  function animateMammalBook() {
    d3.select("#mammalBookImageHome")
      .transition()
      .duration(1000) // Animation duration in milliseconds
      .attr("x", -255) // Final position 10 pixels from the left
      .attr("y", 40); // Position 40 pixels from the top
  }

  // Show the modal and animate the mammal book image when mammalBookImageHome is clicked
  d3.select("#mammalBookImageHome").on("click", function () {
    // Reset the modal's position to offscreen at the bottom
    modal
      .attr("transform", `translate(0, ${modalHeight})`)
      .style("display", null) // Make the modal visible
      .transition()
      .duration(500) // Adjust duration as needed
      .attr("transform", "translate(0, 0)"); // Animate modal into view

    // Animate the mammal book image
    animateMammalBook();
  });

    // Append the plane image
    const planeImage = planeGroup
      .append("image")
      .attr("xlink:href", "plane.svg")
      .attr("width", planeWidth)
      .attr("height", planeHeight)
      .attr("x", -10)
      .attr("y", -10);

    // Function to animate the plane with a more dynamic flight path
    function animatePlane() {
      planeGroup
      .transition()
      .duration(15000) // Duration for the plane to move across the screen
      .ease(d3.easeLinear)
      .attrTween("transform", function () {
        return function (t) {
        const x = d3.interpolate(planeX, svgWidth)(t);
        const y = d3.easeQuadInOut(t) * -200 + planeY; // Adjust the height as needed
        const angle = Math.atan2(-200, svgWidth) * (180 / Math.PI); // Calculate the angle for a smooth arc
        return `translate(${x}, ${y}) rotate(${angle}, ${planeWidth / 2}, ${planeHeight / 2})`;
        };
      })
      .on("end", function () {
        // Reset position and wait for 3 seconds before repeating
        d3.timeout(function () {
        planeGroup.attr("transform", `translate(${planeX}, ${planeY})`);
        animatePlane();
        }, 3000);
      });
    }

    // Start the plane animation
    animatePlane();

  
// Ensure the modal is displayed
modal.style("display", null);


// Create the background rectangle for the text content
const textContainer = modal
  .append("rect")
  .attr("x", 100)
  .attr("y", 65)
  .attr("width", 367)
  .attr("height", 390)
  .attr("fill", "#FFF1D5")
  .attr("rx", 30)
  .attr("ry", 30);


// Append "COLLECTION SIZE" body text
modal
  .append("text")
  .attr("x", 140) // Moved 40px to the right
  .attr("y", 550)
  .attr("font-size", "25px")
  .attr("font-family", "Caveat, sans-serif")
  .attr("fill", "#333")
  .text(
    "If you laid every item in the collection down, it would stretch from New York to Philadelphia, or the entire length of the English Channel."
  )
  .call(wrap, 265);



// Append the mole image next to the "COLLECTION SIZE" text
modal
  .append("image")
  .attr("xlink:href", "mole.svg")
  .attr("width", 300)
  .attr("height", 300)
  .attr("x", 350)
  .attr("y", 510);

// Define a linear gradient for the modal background
const modalGradient = svg
  .append("defs")
  .append("linearGradient")
  .attr("id", "modalGradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "100%");

modalGradient
  .append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#FFF1D5");
modalGradient
  .append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#FFFFFF");

// Append a rectangle with gradient background for the violin plot
modal
  .append("rect")
  .attr("x", 590) // Adjusted position
  .attr("y", 20)
  .attr("width", modalWidth - 610) // Adjusted width to fit within modal
  .attr("height", modalHeight - 40)
  .attr("fill", "url(#modalGradient)")
  .attr("stroke", "#333")
  .attr("stroke-width", 2)
  .attr("rx", 30)
  .attr("ry", 30)
  .attr(
    "clip-path",
    "polygon(0 0, 100% 0, 100% 30px, 100% calc(100% - 30px), 100% 100%, 0 100%)"
  );

  // Append the stage image within the gradient rectangle
  modal
    .append("image")
    .attr("xlink:href", "stage.svg")
    .attr("width", modalWidth - 600) // Adjust width to fit within the gradient rectangle
    .attr("height", modalHeight - 90) // Adjust height to fit within the gradient rectangle
    .attr("x", 589) // Adjust position to align with the gradient rectangle
    .attr("y", 302) // Adjust position to align with the gradient rectangle
    .attr("preserveAspectRatio", "xMidYMid meet") // Preserve aspect ratio
    .attr("clip-path", "url(#clipRect)"); // Use the gradient rectangle as a clipping mask

// Define the clipping path using the gradient rectangle
svg
  .append("defs")
  .append("clipPath")
  .attr("id", "clipRect")
  .append("rect")
  .attr("x", 591) // Same position as the gradient rectangle
  .attr("y", 19)
  .attr("width", modalWidth - 612) // Same width as the gradient rectangle
  .attr("height", modalHeight - 40) // Same height as the gradient rectangle
  .attr("rx", 30)
  .attr("ry", 30);
    

// Append a container for the violin plot inside the modal
modal
  .append("foreignObject")
  .attr("x", 590) // Adjusted position to align with background rectangle
  .attr("y", 70) // Adjusted position
  .attr("width", modalWidth - 610) // Adjusted width to match background rectangle
  .attr("height", modalHeight - 90) // Adjusted height
  .append("xhtml:div") // Append HTML div within foreignObject
  .attr("id", "violinPlot") // Set an ID to target the div
  .style("width", "100%")
  .style("height", "100%"); // Ensure div fills the foreignObject

// Define variables to hold the indices of the highlighted traces
var shrewHighlightedTraceIndex;
var batHighlightedTraceIndex;
var whaleHighlightedTraceIndex;

// Load the data and create the plot
d3.json("mammals_rand_2_norm.json")
  .then(function (data) {
    // Extract the "length_mm" column and titles from the JSON data
    var length_mm = data.map(function (d) {
      return d.length_mm;
    });
    var titles = data.map(function (d) {
      return d.title;
    });

    // Create an array of x-values corresponding to the violin plot category
    var x_values = data.map(function () {
      return "Violin";
    });

    // Define the data for the violin plot
    var plotData = [
      {
        type: "violin",
        x: x_values,
        y: length_mm,
        points: "none", // Keep points hidden
        box: {
          visible: true,
        },
        boxpoints: false,
        line: {
          color: "F0C46B",
        },
        fillcolor: "#F5D293",
        opacity: 1,
        meanline: {
          visible: false,
        },
        name: "Violin",
        showlegend: false,
        text: titles, // Include titles for hover info
        hovertemplate:
          "<b>%{text}</b><br><br>" +
          "Length: %{y} mm<br>" +
          "<extra></extra>",
      },
    ];

    // **First Highlighted Trace: "Blarina brevicauda talpoides" (Shrew)**
    var shrewDataPoint = data.find(function (d) {
      return d.title === "Blarina brevicauda talpoides";
    });

    if (shrewDataPoint) {
      var shrewLength = shrewDataPoint.length_mm;

      var shrewHighlightedTrace = {
        type: "scatter",
        x: ["Violin"],
        y: [shrewLength],
        mode: "markers+text",
        marker: {
          color: "black",
          size: 12,
        },
        text: ["Blarina brevicauda talpoides"],
        textposition: "top center",
        showlegend: false,
        hoverinfo: "none",
        visible: false, // Initially not visible
      };

      // Store the index of the shrew highlighted trace
      shrewHighlightedTraceIndex = plotData.length; // Should be 1
      plotData.push(shrewHighlightedTrace);
    }

    // **Second Highlighted Trace: "Tonatia saurophila" (Bat)**
    var batDataPoint = data.find(function (d) {
      return d.title === "Tonatia saurophila";
    });

    if (batDataPoint) {
      var batLength = batDataPoint.length_mm;

      var batHighlightedTrace = {
        type: "scatter",
        x: ["Violin"],
        y: [batLength],
        mode: "markers+text",
        marker: {
          color: "black",
          size: 12,
        },
        text: ["Tonatia saurophila"],
        textposition: "top center",
        showlegend: false,
        hoverinfo: "none",
        visible: false, // Initially not visible
      };

      // Store the index of the bat highlighted trace
      batHighlightedTraceIndex = plotData.length; // Should be 2
      plotData.push(batHighlightedTrace);
    }

    // **third Highlighted Trace: "Balaenoptera musculus (Linnaeus, 1758)" (Whale)**
    var whaleDataPoint = data.find(function (d) {
      return d.title === "Balaenoptera musculus (Linnaeus, 1758)";
    });

    if (whaleDataPoint) {
      var whaleLength = whaleDataPoint.length_mm;

      var whaleHighlightedTrace = {
        type: "scatter",
        x: ["Violin"],
        y: [whaleLength],
        mode: "markers+text",
        marker: {
          color: "black",
          size: 12,
        },
        text: ["Balaenoptera musculus (Linnaeus, 1758)"],
        textposition: "top center",
        showlegend: false,
        hoverinfo: "none",
        visible: false, // Initially not visible
      };

      // Store the index of the bat highlighted trace
      whaleHighlightedTraceIndex = plotData.length; // Should be 2
      plotData.push(whaleHighlightedTrace);
    }

    // Define the layout for the plot (unchanged from your code)
    var layout = {
      paper_bgcolor: "rgba(0,0,0,0)", // Transparent background
      plot_bgcolor: "rgba(0,0,0,0)", // Transparent plot area
      xaxis: {
        zeroline: false,
        showline: false,
        showticklabels: false,
        showgrid: false,
        type: "category",
        categoryorder: "array",
        categoryarray: ["Violin"], // Define the category order
      },
      yaxis: {
        title: " ",
        type: "linear",
        zeroline: false,
        showgrid: true,
        showline: false,
        showticklabels: true,
        tickfont: {
          family: "Caveat, sans-serif",
          size: 16,
          color: "#333",
        },
        gridcolor: "rgba(0, 0, 0, 0.1)", // Black with 10% transparency
      },
      title: "Collection Length Distribution",
      font: {
        family: "Londrina Sketch, sans-serif",
        size: 25,
        color: "#000",
      },
      annotations: [
        {
          xref: "paper",
          yref: "paper",
          x: 0.5,
          xanchor: "center",
          y: -0.08,
          yanchor: "bottom",
          text: "Est. Total Collection Length: 0km", // Start from 0km
          font: {
            family: "Londrina Solid, sans-serif",
            size: 18,
            color: "#333",
          },
          showarrow: false,
        },
        {
          xref: "paper",
          yref: "paper",
          x: 0.5,
          xanchor: "center",
          y: 1.02,
          yanchor: "bottom",
          text: "Randomized Sample — in Millimeters",
          font: {
            family: "Londrina Solid, sans-serif",
            size: 18,
            color: "#333",
          },
          showarrow: false,
        },
        // {
        //   xref: "paper",
        //   yref: "paper",
        //   x: 0.5,
        //   xanchor: "center",
        //   y: -0.08,
        //   yanchor: "bottom",
        //   // text: "Est. Total Collection Length: 287km",
        //   font: {
        //     family: "Londrina Solid, sans-serif",
        //     size: 18,
        //     color: "#333",
        //   },
        //   showarrow: false,
        // },
      ],
      hovermode: "closest",
      hoverlabel: {
        bgcolor: "#FFF1D5",
        font: {
          family: "Caveat, sans-serif",
          size: 16,
          color: "#333",
        },
      },
    };

    // Render the plot inside the created div
    Plotly.newPlot("violinPlot", plotData, layout, { displayModeBar: false }).then(function () {
      // Start the animation after the plot is rendered
      // animateAnnotationAccelerated(1, 287, 2000); // Animate from 1 to 287 over 2 seconds
    });
  })
  .catch(function (error) {
    console.log("Error loading JSON data: ", error);
  });
  function animateAnnotationAccelerated(start, end, duration) {
    var current = start;
    var startTime = null;
    var annotationIndex = 0; // Index of your annotation in the layout.annotations array

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1); // Progress from 0 to 1

      // Apply an easing function for acceleration (quadratic easing)
      var easedProgress = progress * progress;

      // Calculate the current value based on eased progress
      current = Math.floor(start + easedProgress * (end - start));

      // Update the annotation text
      var newText = "Est. Total Collection Length: " + current + "km";
      Plotly.relayout("violinPlot", "annotations[" + annotationIndex + "].text", newText);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Adjust the click event to start the animation after the mammal book image moves
  d3.select("#mammalBookImageHome").on("click", function () {
    // Reset the modal's position to offscreen at the bottom
    modal
      .attr("transform", `translate(0, ${modalHeight})`)
      .style("display", null) // Make the modal visible
      .transition()
      .duration(500) // Adjust duration as needed
      .attr("transform", "translate(0, 0)"); // Animate modal into view

    // Animate the mammal book image
    animateMammalBook();

    // Start the annotation animation after the mammal book image moves
    setTimeout(function () {
      animateAnnotationAccelerated(1, 287, 2000); // Animate from 1 to 287 over 2 seconds
    }, 1000); // Adjust the delay to match the mammal book image animation duration
  });




  // Append "ABOUT" heading
modal
.append("text")
.attr("x", 140) // Moved 40px to the right
.attr("y", 115)
.attr("font-size", "18px")
.attr("font-family", "Londrina Solid, sans-serif")
.attr("fill", "#333")
.text("ABOUT");

// Append "ABOUT" body text
modal
.append("text")
.attr("x", 140) // Moved 40px to the right
.attr("y", 145)
.attr("font-size", "20px")
.attr("font-family", "Caveat, sans-serif")
.attr("fill", "#333")
.text(
  "The world’s largest collection of mammals, the Mammals Division of the National Museum of Natural History includes more than 500,000 objects."
)
.call(wrap, 283);

// Append "HIGHLIGHTS" heading
modal
.append("text")
.attr("x", 140) // Moved 40px to the right
.attr("y", 275)
.attr("font-size", "18px")
.attr("font-family", "Londrina Solid, sans-serif")
.attr("fill", "#333")
.text("HIGHLIGHTS");


// Create a group for the bat text
const whaleGroup = modal.append("g").attr("class", "whale");

whaleGroup
.append("text")
.attr("x", 140)
.attr("y", 305)
.attr("font-size", "20px")
.attr("font-family", "Caveat, sans-serif")
.attr("fill", "#333")
.text("The blue whale is the size of 13 limos.")
.attr("text-decoration", "underline")
.call(wrap, 283)
.on("mouseover", function () {
  d3.select(this).attr("fill", "rgba(0, 0, 0, 0.3)");
  d3.select("#hoverWhaleImage").style("display", null);

  // Show the whale highlighted point on the violin plot
  if (typeof whaleHighlightedTraceIndex !== "undefined") {
    Plotly.restyle(
      "violinPlot",
      { visible: true },
      [whaleHighlightedTraceIndex]
    );
  }
})
.on("mouseout", function () {
  d3.select(this).attr("fill", "#333");
  d3.select("#hoverWhaleImage").style("display", "none");

  // Hide the whale highlighted point on the violin plot
  if (typeof whaleHighlightedTraceIndex !== "undefined") {
    Plotly.restyle(
      "violinPlot",
      { visible: false },
      [whaleHighlightedTraceIndex]
    );
  }
})

.on("mousemove", function (event) {
  // Update the position of the hoverBatImage
  var [mouseX, mouseY] = d3.pointer(event);
  d3.select("#hoverWhaleImage")
    .attr("x", mouseX + 5)
    .attr("y", mouseY + 5);
});

// Append the whale image for hover effect
modal
.append("image")
.attr("xlink:href", "whale_img.png")
.attr("id", "hoverWhaleImage")
.attr("width", 300)
.attr("height", 300)
.attr("x", 500)
.attr("y", 300)
.style("filter", "grayscale(100%)")
.style("display", "none");


// Create a group for the bat text
const batGroup = modal.append("g").attr("class", "bat");

batGroup
.append("text")
.attr("x", 140) // Moved 40px to the right
.attr("y", 335)
.attr("font-size", "20px")
.attr("font-family", "Caveat, sans-serif")
.attr("fill", "#333")
.text(
  "Your watch face is like a king bed to the Stripe-Headed Round-Eared Bat."
)
.attr("text-decoration", "underline")
.call(wrap, 283)
.on("mouseover", function () {
  d3.select(this).attr("fill", "rgba(0, 0, 0, 0.3)");
  d3.select("#hoverBatImage").style("display", null);

  // Show the bat highlighted point on the violin plot
  if (typeof batHighlightedTraceIndex !== "undefined") {
    Plotly.restyle(
      "violinPlot",
      { visible: true },
      [batHighlightedTraceIndex]
    );
  }
})
.on("mouseout", function () {
  d3.select(this).attr("fill", "#333");
  d3.select("#hoverBatImage").style("display", "none");

  // Hide the bat highlighted point on the violin plot
  if (typeof batHighlightedTraceIndex !== "undefined") {
    Plotly.restyle(
      "violinPlot",
      { visible: false },
      [batHighlightedTraceIndex]
    );
  }
})
.on("mousemove", function (event) {
  // Update the position of the hoverBatImage
  var [mouseX, mouseY] = d3.pointer(event);
  d3.select("#hoverBatImage")
    .attr("x", mouseX + 5)
    .attr("y", mouseY + 5);
});

// Append the bat image for hover effect
modal
.append("image")
.attr("xlink:href", "bat_img.png")
.attr("id", "hoverBatImage")
.attr("width", 300) // Adjust size as needed
.attr("height", 300) // Adjust size as needed
.attr("x", 0)
.attr("y", 0)
.style("display", "none")
.style("filter", "grayscale(100%)");


// Create a group for the shrew text
const shrewGroup = modal.append("g").attr("class", "shrew");

shrewGroup
.append("text")
.attr("x", 140) // Moved 40px to the right
.attr("y", 390)
.attr("font-size", "20px")
.attr("font-family", "Caveat, sans-serif")
.attr("fill", "#333")
.text(
  "This recently discovered Shrew is one of only a few venomous mammals."
)
.attr("text-decoration", "underline")
.call(wrap, 283)
.on("mouseover", function () {
  d3.select(this).attr("fill", "rgba(0, 0, 0, 0.3)");
  d3.select("#hoverShrewImage").style("display", null);

  // Show the highlighted point on the violin plot
  if (typeof shrewHighlightedTraceIndex !== "undefined") {
    Plotly.restyle(
      "violinPlot",
      { visible: true },
      [shrewHighlightedTraceIndex]
    );
  }
})
.on("mouseout", function () {
  d3.select(this).attr("fill", "#333");
  d3.select("#hoverShrewImage").style("display", "none");

  // Hide the highlighted point on the violin plot
  if (typeof shrewHighlightedTraceIndex !== "undefined") {
    Plotly.restyle(
      "violinPlot",
      { visible: false },
      [shrewHighlightedTraceIndex]
    );
  }
})
  .on("mousemove", function (event) {
    // Update the position of the hoverBatImage
    var [mouseX, mouseY] = d3.pointer(event);
    d3.select("#hoverShrewImage")
      .attr("x", mouseX + 5)
      .attr("y", mouseY + 5);
  });
  
// Append the mole image for hover effect
  modal
  .append("image")
  .attr("xlink:href", "shrew_img.png")
  .attr("id", "hoverShrewImage")
  .attr("width", 300)
  .attr("height", 300)
  .attr("x", 500)
  .attr("y", 300)
  .style("filter", "grayscale(100%)")
  .style("display", "none");

// Append "COLLECTION SIZE" heading
modal
.append("text")
.attr("x", 140) // Moved 40px to the right
.attr("y", 510)
.attr("font-size", "14px")
.attr("font-family", "Londrina Solid, sans-serif")
.attr("fill", "#333")
.text("COLLECTION SIZE");


// Append the close button image to the modal
modal
  .append("image")
  .attr("xlink:href", "x.svg")
  .attr("width", 40)
  .attr("height", 40)
  .attr("x", modalWidth - 45) // Adjusted position
  .attr("y", 20)
  .attr("cursor", "pointer")
  .on("click", function () {
    // Animate the modal sliding down and hide it after the animation
    modal
      .transition()
      .duration(500)
      .attr("transform", `translate(0, ${modalHeight})`)
      .on("end", function () {
        modal.style("display", "none");
      });

    // Animate the mammal book image back to its original position
    d3.select("#mammalBookImageHome")
      .transition()
      .duration(500)
      .attr("x", svgWidth / 2 - (svgWidth * 0.74) / 2) // Center horizontally
      .attr("y", svgHeight / 2 - (svgWidth * 0.45) / 2); // Center vertically
  });
