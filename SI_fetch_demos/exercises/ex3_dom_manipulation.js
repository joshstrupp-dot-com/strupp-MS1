/*
  Exercise 3
  DOM manipulation with vanilla JS
*/

// Task
// What does DOM stand for?
// ANSWER: Document Object Model

// Task
// Open the file index.html in your browser. Open the index.html file in VS Code, right-click the tab and select "Open in Browser"
// If you are working locally, navigate to the excercise directory and start a python http server `python3 -m http.server 900`, press Control-c to stop the server 

// Task
// Delete the div with the class rectangle from index.html and refresh the preview.

// Task
// What does the following code do?

const viz = document.body.querySelector(".viz");
const button = document.body.querySelector("#button");
// creates two variable, viz and button, that select from HTML elements with class viz and elements with ID button

console.log(viz, viz.children);

const addChildToViz = (len) => {
  const newChild = document.createElement("div");
  newChild.className = "rectangle";
  newChild.style.height = len * 10 + "px";
  viz.appendChild(newChild);
};
// creates a function that creates a new empty div as "newChild" with class rectangle and random height, then appends it to the viz element


// Task
// Modify index.html to make this event listener work
button.addEventListener("click", addChildToViz);
// adds an event listener to the button element that listens for a click and runs the addChildToViz function

// Task
// Where can you see the results of the console.log below? How is it different from in previous exercises?

function drawIrisData() {
  window
    .fetch("./iris_json.json")
    .then(data => data.json())
    .then(data => {
      data.forEach(e => {
        addChildToViz(e.petallength);
      });
    });
}
// fetches the iris_json.json file, grabs only JSON, then runs addChildToViz function on each element in the JSON file to add a rectangle representing each petal length in the DOM

drawIrisData();

// Task
// Modify the code above to visualize the Iris dataset in the preview of index.html.
// Feel free to add additional CSS properties in index.html, or using JavaScript, as you see fit.
