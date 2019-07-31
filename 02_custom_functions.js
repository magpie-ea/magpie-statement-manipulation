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

// // info of html table used in debug mode
// // build html table dynamically
// const formatDebugData = function (flattenedData) {
//   var output = "<table id='magpie-debug-table'>";
//
//   var t = flattenedData[0];
//
//   output += "<thead><tr>";
//
//   for (var key in t) {
//     if (t.hasOwnProperty(key)) {
//       output += "<th>" + key + "</th>";
//     }
//   }
//
//   output += "</tr></thead>";
//
//   output += "<tbody><tr>";
//
//   var entry = "";
//
//   for (var i = 0; i < flattenedData.length; i++) {
//     var currentTrial = flattenedData[i];
//     for (var k in t) {
//       if (currentTrial.hasOwnProperty(k)) {
//         entry = String(currentTrial[k]);
//         output += "<td>" + entry.replace(/ /g, "&nbsp;") + "</td>";
//       }
//     }
//
//     output += "</tr>";
//   }
//
//   output += "</tbody></table>";
//
//   return output;
// };


// create my own html table
// prerequisits
var table = '';
// set dimensions of table
var rows = 6;
var cols = 4;
var names = ["John", "Lisa", "Amy", "Daniel", "Alex", "Tina"]
var questions = [" ", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6"]

// function to generate random 1 and 0 values for table and store it
function createMatrix(cols, rows) {
  var matrix = [];
  for (var i = 0; i < cols; i++) {
    matrix[i] = []; // Initialize inner array
    for (var j = 0; j < rows; j++) {
      matrix[i][j] = Math.round(Math.random());
    }
  }
  return matrix;
}

var matrix1 = createMatrix(6, 6);
var matrix2 = createMatrix(6, 6);
var matrix3 = createMatrix(6, 6);

function getCheck(result) {
  if (result == 0) {
    return "&#10004"
  } else {
    return "&#10008"
  }
}

function makeHTMLTable(myArray) {
  var result = "<table border=1>";
  for (var i = 0; i <= myArray.length; i++) {
    result += '<th>' + questions[i] + '</th>';
  }

  for (var j = 0; j < myArray.length; j++) {
    result += '<tr>';
    result += '<th>' + names[j] + '</th>';
    for (var k = 0; k < myArray[j].length; k++) {
      result += "<td>" + this.getCheck(myArray[j][k]) + "</td>";
    }
    result += "</tr>";
  }

  // still keep this info of how I did it initially
  // for (var r = 0; r < myArray[r].length; r++) {
  //   result += '<tr>';
  //   result += '<th>' + names[r] + '</th>';
  //   result += "<td>" + this.getCheck(myArray[0][r]) + "</td>";
  //   result += "<td>" + myArray[1][r] + "</td>";
  //   result += "<td>" + myArray[2][r] + "</td>";
  //   result += "<td>" + myArray[3][r] + "</td>";
  //   result += "<td>" + myArray[4][r] + "</td>";
  //   result += "<td>" + myArray[5][r] + "</td>";
  //   result += "<td>" + "&#10004" + "</td>";
  //   result += "<td>" + "&#10008" + "</td>";
  //
  //
  // }


  result += "</table>";


  return result;
}




var table1 = makeHTMLTable(matrix1);
//document.write('<table border=1>' + table1 + '<table>');

var table2 = makeHTMLTable(matrix2);
//document.write('<table border=1>' + table2 + '<table>');

var table3 = makeHTMLTable(matrix3);
//document.write('<table border=1>' + table3 + '<table>');



// Here, we will define some generator functions for a multi-dropdown view
// take some info from examples, but change it to my purpose
const multi_dropdown_gens = {
  // A generator for our view template
  stimulus_container_gen: function (config, CT) {
    return `<div class='magpie-view'>
                <h1 class='magpie-view-title'>${config.title}</h1>
                <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
                <p class='magpie-response-keypress-header' id = 'reminder'></p>
                </div>`;
  },
  // A generator for the answer container
  // I make a change from magpie-response-dropdown to a new: magpie-response-list
  // <select id='response1' name='answer_1'>
  //     <option disabled selected></option>
  //     <option value=${config.data[CT].choice_options_1[0]}>${config.data[CT].choice_options_1[0]}</option>
  //     <option value=${config.data[CT].choice_options_1[1]}>${config.data[CT].choice_options_1[1]}</option>
  //     <option value=${config.data[CT].choice_options_1[2]}>${config.data[CT].choice_options_1[2]}</option>
  //     <option value=${config.data[CT].choice_options_1[3]}>${config.data[CT].choice_options_1[3]}</option>
  //     <option value=${config.data[CT].choice_options_1[4]}>${config.data[CT].choice_options_1[4]}</option>
  // </select>

  // // button trials
  //   <span class= 'response-button-group'>
  //     <button name="button" value=${config.data[CT].choice_options_1[0]}>${config.data[CT].choice_options_1[0]}</button>
  //     <button name="button" value=${config.data[CT].choice_options_1[1]}>${config.data[CT].choice_options_1[1]}</button>
  //     <button name="button" value=${config.data[CT].choice_options_1[2]} >${config.data[CT].choice_options_1[2]}</button>
  //     <button name="button" value=${config.data[CT].choice_options_1[3]}>${config.data[CT].choice_options_1[3]}</button>
  //     <button name="button" value=${config.data[CT].choice_options_1[4]} >${config.data[CT].choice_options_1[4]}</button>
  //   </span>


  answer_container_gen: function (config, CT) {
    return `<div class='magpie-view-answer-container magpie-response-dropdown'>
    <div class='magpie-view-answer-container'>
                  <p class='magpie-view-question'>${config.data[CT].question}</p>
                 ${config.data[CT].sentence_chunk_1}
                  <span class= 'response-table'>
                      <label for='o1' class='magpie-response-buttons'>${config.data[CT].choice_options_1[0]}</label>
                      <input type='radio' name='answer' id='o1' value=${config.data[CT].choice_options_1[0]} />
                      <label for='o2' class='magpie-response-buttons'>${config.data[CT].choice_options_1[1]}</label>
                      <input type='radio' name='answer' id='o2' value=${config.data[CT].choice_options_1[1]} />
                      <label for='o3' class='magpie-response-buttons'>${config.data[CT].choice_options_1[2]}</label>
                      <input type='radio' name='answer' id='o3' value=${config.data[CT].choice_options_1[2]} />
                      <label for='o4' class='magpie-response-buttons'>${config.data[CT].choice_options_1[3]}</label>
                      <input type='radio' name='answer' id='o4' value=${config.data[CT].choice_options_1[3]} />
                      <label for='o5' class='magpie-response-buttons'>${config.data[CT].choice_options_1[4]}</label>
                      <input type='radio' name='answer' id='o5' value=${config.data[CT].choice_options_1[4]} />
                  </span>
                ${config.data[CT].sentence_chunk_2}
                <select id='response2' name='answer_2'>
                    <option disabled selected></option>
                    <option value=${config.data[CT].choice_options_2[0]}>${config.data[CT].choice_options_2[0]}</option>
                    <option value=${config.data[CT].choice_options_2[1]}>${config.data[CT].choice_options_2[1]}</option>
                    <option value=${config.data[CT].choice_options_2[2]}>${config.data[CT].choice_options_2[2]}</option>
                    <option value=${config.data[CT].choice_options_2[3]}>${config.data[CT].choice_options_2[3]}</option>
                    <option value=${config.data[CT].choice_options_2[4]}>${config.data[CT].choice_options_2[4]}</option>
                </select>
                ${config.data[CT].sentence_chunk_3}
                <select id='response2' name='answer_3'>
                    <option disabled selected></option>
                    <option value=${config.data[CT].choice_options_3[0]}>${config.data[CT].choice_options_3[0]}</option>
                    <option value=${config.data[CT].choice_options_3[1]}>${config.data[CT].choice_options_3[1]}</option>
                </select>
                ${config.data[CT].sentence_chunk_4}
                </p>
                <button id='next' class='magpie-view-button magpie-nodisplay'>Next</button>
            </div>`;
  },


  //A generator for the enable response function
  // button_choice: function (config, CT, magpie, answer_container_generator, startingTime) {
  //   $(".magpie-view")
  //     .append(answer_container_generator(config, CT));
  //
  //   // attaches an event listener to the yes / no radio inputs
  //   // when an input is selected a response property with a value equal
  //   // to the answer is added to the trial object
  //   // as well as a readingTimes property with value
  //   $("input[name=answer]")
  //     .on("change", function () {
  //       const RT = Date.now() - startingTime;
  //       let trial_data = {
  //         trial_name: config.name,
  //         trial_number: CT + 1,
  //         response: $("input[name=answer]:checked")
  //           .val(),
  //         RT: RT
  //       };
  //
  //       trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);
  //
  //       magpie.trial_data.push(trial_data);
  //       magpie.findNextView();
  //     });
  // },


  handle_response_function: function (config, CT, magpie, answer_container_generator, startingTime) {

    let response1;
    let response2;
    let response3;

    $(".magpie-view")
      .append(answer_container_generator(config, CT));

    response1 = $("#response1");
    response2 = $("#response2");
    response3 = $("#response3");

    // flags to check if dropdown menus have been used
    // I think this needs to be [0,0,0]
    let response_flags = [0, 0];

    // I changed the if condition to === 2, next button doesnt show after 2nd press, but also not after 3rd
    const display_button_checker = function (response_number) {
      response_flags[response_number] = 1;
      if (_.min(response_flags) === 1) {
        $("#next")
          .removeClass("magpie-nodisplay");
      }
    };

    response1.on("change", function () {
      response_flags[0] = 1;
      display_button_checker(0);
    });
    response2.on("change", function () {
      response_flags[1] = 1;
      display_button_checker(1);
    });
    response3.on("change", function () {
      response_flags[2] = 1;
      display_button_checker(2);
    });


    $("#next")
      .on("click", function () {
        const RT = Date.now() - startingTime; // measure RT before anything else
        // clear old timeouts and remove them from the timeout array
        clearTimeout(window.timeout[0]);
        window.timeout.shift();
        let trial_data = {
          trial_name: config.name,
          trial_number: CT + 1,
          sentence_frame: config.data[CT].sentence_chunk_1
            .concat("...")
            .concat(config.data[CT].sentence_chunk_2)
            .concat("...")
            .concat(config.data[CT].sentence_chunk_3)
            .concat("...")
            .concat(config.data[CT].sentence_chunk_4),
          response_1: $(response1)
            .val(),
          response_2: $(response2)
            .val(),
          response_3: $(response3)
            .val(),
          RT: RT
        };

        trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

        magpie.trial_data.push(trial_data);
        magpie.findNextView();
      });
  }

};
