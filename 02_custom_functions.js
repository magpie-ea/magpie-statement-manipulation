// Here, you can define all custom functions, you want to use and initialize some variables

/* Variables
 *
 *
 */
const coin = _.sample(["head", "tail"]); // You can determine global (random) parameters here
// Declare your variables here



/* Helper functions
 *
 *
 */


/* For generating random participant IDs */
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// dec2hex :: Integer -> String
const dec2hex = function (dec) {
  return ("0" + dec.toString(16))
    .substr(-2);
};
// generateId :: Integer -> String
const generateID = function (len) {
  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, this.dec2hex)
    .join("");
};
// Declare your helper functions here



/* Hooks
 *
 *
 */

// Error feedback if participants exceeds the time for responding
const time_limit = function (data, next) {
  if (typeof window.timeout === 'undefined') {
    window.timeout = [];
  }
  // Add timeouts to the timeoutarray
  // Reminds the participant to respond after 5 seconds
  window.timeout.push(setTimeout(function () {
    $('#reminder')
      .text('Please answer more quickly!');
  }, 5000));
  next();
};

// compares the chosen answer to the value of `option1`
check_response = function (data, next) {
  $('input[name=answer]')
    .on('change', function (e) {
      if (e.target.value === data.correct) {
        alert('Your answer is correct! Yey!');
      } else {
        alert('Sorry, this answer is incorrect :( The correct answer was ' + data.correct);
      }
      next();
    })
}

// Declare your hooks here


/* Generators for custom view templates, answer container elements and enable response functions
 *
 *
 */

// prerequisits for html table


// build html table dynamically

const formatDebugData = function (flattenedData) {
  var output = "<table id='babe-debug-table'>";

  var t = flattenedData[0];

  output += "<thead><tr>";

  for (var key in t) {
    if (t.hasOwnProperty(key)) {
      output += "<th>" + key + "</th>";
    }
  }

  output += "</tr></thead>";

  output += "<tbody><tr>";

  var entry = "";

  for (var i = 0; i < flattenedData.length; i++) {
    var currentTrial = flattenedData[i];
    for (var k in t) {
      if (currentTrial.hasOwnProperty(k)) {
        entry = String(currentTrial[k]);
        output += "<td>" + entry.replace(/ /g, "&nbsp;") + "</td>";
      }
    }

    output += "</tr>";
  }

  output += "</tbody></table>";

  return output;
};


// create my own table
var table = '';
// set dimensions of table
var rows = 6;
var cols = 4;
var names = ["John", "Lisa", "Amy", "Daniel", "Alex", "Tina"]
var questions = ["Q1", "Q2", "Q3", "Q4"]

var matrix = [];
for (var i = 0; i < cols; i++) {
  matrix[i] = []; // Initialize inner array
}

// alternative idea to safe values of matrix here
// for (var i = 0 ; i < cols; i++) {
//     for (var j = 0; j < rows; j++) {
//         matrix[[i],[j]] = Math.round(Math.random());
//     }
// }



for (var i = -1; i < cols; i++) {
  table += '<th>' + questions[i] + '</th>';
}
for (var r = 0; r < rows; r++) {

  table += '<tr>';
  table += '<th>' + names[r] + '</th>';
  for (var c = 0; c < cols; c++) {
    table += '<td>' + Math.round(Math.random()); + '</td>';

  }
  table += '</tr>';
}
//
// '<style >' +
// th, td {
//   padding: 15 px;
//   font - family: calibri;
// } +
// '</style>'

document.write('<table border=1>' + table + '<table>')
