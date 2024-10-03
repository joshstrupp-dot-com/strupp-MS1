// load the data for 2018
d3.text("data/sotu-2018.txt").then((data) => {
  text = data;
  // split the text into lines
  lines = text.split("\n");
  // remove empty lines
  lines = lines.filter((i) => i.length > 0);
  let frequency = analyzeData(lines);
  displayData(
    frequency,
    "Word Frequency in the State of the Union Address 2018"
  );
});

// load the data for 2022
d3.text("data/sotu-2022.txt").then((data) => {
  text = data;
  // split the text into lines
  lines = text.split("\n");
  // remove empty lines
  lines = lines.filter((i) => i.length > 0);
  let frequency = analyzeData(lines);
  displayData(
    frequency,
    "Word Frequency in the State of the Union Address 2022"
  );
});

const stopwords = [
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
];

function analyzeData(lines) {
  let phrase;
  let frequency = [];
  // loop over the array
  lines.forEach((line) => {
    // split the line into words
    let words = line.split(" ");
    // loop over the words
    words.forEach((word) => {
      // remove empty words
      if (word.length == 0) return;
      // remove special characters
      phrase = word.replace(/[^a-zA-Z ]/g, "");
      // check if the word is in the array
      let match = false;
      frequency.forEach((i) => {
        if (
          i.word.toLowerCase() == phrase.toLowerCase() &&
          !stopwords.includes(phrase.toLowerCase())
        ) {
          i.count++;
          match = true;
        }
      });
      // if not, add it to the array
      if (!match) {
        frequency.push({
          word: phrase,
          count: 1,
        });
      }
    });
  });

  // show the frequency map
  console.log(frequency);
  // sort the frequency map
  frequency.sort((a, b) => (a.count < b.count ? 1 : -1));
  return frequency;
}

// display the data
function displayData(frequency, title) {
  // define dimensions and margins for the graphic
  const margin = { top: 100, right: 50, bottom: 100, left: 80 };
  const width = 1920 * 15;
  const height = 1080 - margin.top;

  // let's define our scales.
  // yScale corresponds with amount of textiles per country
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(frequency, (d) => d.count) + 1])
    .range([height - margin.bottom, margin.top]);

  // xScale corresponds with country names
  const xScale = d3
    .scaleBand()
    .domain(frequency.map((d) => d.word))
    .range([margin.left, width - margin.right]);

  // create the svg element
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "background-color:#C8E6F4");

  // attach a graphic element, and append rectangles to it
  svg
    .append("g")
    .selectAll("rect")
    .data(frequency)
    .join("rect")
    .attr("x", (d) => xScale(d.word))
    .attr("y", (d) => yScale(d.count))
    .attr("height", (d) => yScale(0) - yScale(d.count))
    .attr("width", (d) => xScale.bandwidth() - 2)
    .style("fill", "steelblue");

  // add the x axis
  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.6em")
    .attr("dy", "-0.1em")
    .attr("transform", (d) => {
      return "rotate(-45)";
    });

  // add the y axis
  const yAxis = d3.axisLeft(yScale).ticks(5);

  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

  // add the title
  svg
    .append("text")
    .attr("x", margin.left)
    .attr("y", 50)
    .style("font-size", "24px")
    .style("font-family", "sans-serif")
    .style("font-weight", "bold")
    .text(title);
}
