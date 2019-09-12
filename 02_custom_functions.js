// Here, you can define all custom functions, you want to use and initialize some variables



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

// create html table for trials
// prerequisits
var table = '';
// set dimensions of table
var rows = 6;
var cols = 4;
var names = ["John", "Lisa", "Amy", "Daniel", "Alex", "Tina", "Mia", "Julia", "Tim", "Johann", "Lesly", "Julian", "Chris", "Marie", "Lisanne", "Thomas", "Pablo", "Rebecca", "Theresa", "Susanne", "Jan", "Nico"]
var questions = [" ", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12"]

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

// function which changes 0 and 1 to red crossmark and greenchecker
function getCheck(result) {
  if (result == 0) {
    return "<i style=color:#13AC38>" + "&#10004" + "</i>"
  } else {
    return "<i style=color:#B12810>" + "&#10008" + "</i>"
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
  // }

  result += "</table>";
  return result;
}


// these are final tables
var table1 = makeHTMLTable(matrix1);
//document.write('<table border=1>' + table1 + '<table>');

var table2 = makeHTMLTable(matrix2);
//document.write('<table border=1>' + table2 + '<table>');

var table3 = makeHTMLTable(matrix3);
//document.write('<table border=1>' + table3 + '<table>');

// Here, we will define some generator functions for a multi-dropdown view
// take some info from examples, but change it to my purpose
const multi_button_generator = {
  // A generator for our view template
  stimulus_container_gen: function (config, CT) {
    return `<div class='magpie-view'>
                <h1 class='magpie-view-title'>${config.title}</h1>
                <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
                <p class='magpie-view-question magpie-view-table'>${config.data[CT].table}</p>
                <p class='magpie-view-question magpie-view-question'>${config.data[CT].question}</p>
                <p class='magpie-response-keypress-header' id = 'reminder'></p>
            </div>`;
  },

  answer_container_gen: function (config, CT) {
    return `<div class='magpie-view-answer-container magpie-response-mutli-dropdown'>

    <div class='magpie-view-answer-container'>
                 ${config.data[CT].sentence_chunk_1}
                  <div class= 'response-table' id='r-t-1'>
                      <input type='radio' name='answer1' id='rt1o1' style='display:none' value=${config.data[CT].choice_options_1[0]} />
                      <label for='rt1o1' class='magpie-response-buttons'>${config.data[CT].choice_options_1[0]}</label>
                      <input type='radio' name='answer1' id='rt1o2' style='display:none' value=${config.data[CT].choice_options_1[1]} />
                      <label for='rt1o2' class='magpie-response-buttons'>${config.data[CT].choice_options_1[1]}</label>
                      <input type='radio' name='answer1' id='rt1o3' style='display:none' value=${config.data[CT].choice_options_1[2]} />
                      <label for='rt1o3' class='magpie-response-buttons'>${config.data[CT].choice_options_1[2]}</label>
                      <input type='radio' name='answer1' style='display:none' id='rt1o4' value=${config.data[CT].choice_options_1[3]} />
                      <label for='rt1o4' class='magpie-response-buttons'>${config.data[CT].choice_options_1[3]}</label>
                      <input type='radio' name='answer1' style='display:none' id='rt1o5' value=${config.data[CT].choice_options_1[4]} />
                      <label for='rt1o5' class='magpie-response-buttons'>${config.data[CT].choice_options_1[4]}</label>

                  </div>
                ${config.data[CT].sentence_chunk_2}
                <div class= 'response-table' id= 'r-t-2'>
                <input type='radio' name='answer2' id='rt2o1' style='display:none' value=${config.data[CT].choice_options_2[0]} />
                      <label for='rt2o1' class='magpie-response-buttons'>${config.data[CT].choice_options_2[0]}</label>
                      <input type='radio' name='answer2' id='rt2o2' style='display:none' value=${config.data[CT].choice_options_2[1]} />
                      <label for='rt2o2' class='magpie-response-buttons'>${config.data[CT].choice_options_2[1]}</label>
                      <input type='radio' name='answer2' id='rt2o3' style='display:none' value=${config.data[CT].choice_options_2[2]} />
                      <label for='rt2o3' class='magpie-response-buttons'>${config.data[CT].choice_options_2[2]}</label>
                      <input type='radio' name='answer2' id='rt2o4' style='display:none' value=${config.data[CT].choice_options_2[3]} />
                      <label for='rt2o4' class='magpie-response-buttons'>${config.data[CT].choice_options_2[3]}</label>
                      <input type='radio' name='answer2' id='rt2o5' style='display:none' value=${config.data[CT].choice_options_2[4]} />
                      <label for='rt2o5' class='magpie-response-buttons'>${config.data[CT].choice_options_2[4]}</label>

                </div>
                ${config.data[CT].sentence_chunk_3}
                <div class= 'response-table' id = 'r-t-3'>
                      <input type='radio' name='answer3' id='rt3o1' style='display:none' value=${config.data[CT].choice_options_3[0]} />
                      <label for='rt3o1' class='magpie-response-buttons'>${config.data[CT].choice_options_3[0]}</label>
                      <input type='radio' name='answer3' id='rt3o2' style='display:none' value=${config.data[CT].choice_options_3[1]} />
                      <label for='rt3o2' class='magpie-response-buttons'>${config.data[CT].choice_options_3[1]}</label>
                </div>
                ${config.data[CT].sentence_chunk_4}
                </p>
          </div>
          </div>
                <button id='next' class='magpie-view-button magpie-nodisplay'>Next</button>
          `;
  },

  handle_response_function: function (config, CT, magpie, answer_container_generator, startingTime) {

    let response1;
    let response2;
    let response3;

    $(".magpie-view")
      .append(answer_container_generator(config, CT));

    response1 = $("#r-t-1");
    response2 = $("#r-t-2");
    response3 = $("#r-t-3");

    console.log(response1[0]);

    var response_flags = [0, 0, 0];

    const display_button_checker = function (response_number) {
      response_flags[response_number] = 1;

      if (response_flags.toString() == [1, 1, 1].toString()) {
        $("#next")
          .removeClass("magpie-nodisplay");
      }
    };

    // check all 3 lists
    response1.on("click", function () {
      response_flags[0] = 1;
      display_button_checker(0);
    });
    response2.on("click", function () {
      response_flags[1] = 1;
      display_button_checker(1);
    });
    response3.on("click", function () {
      response_flags[2] = 1;
      display_button_checker(2);
    });

    //activateBtn(response1);
    //  changeColour()

    $("#next")
      .on("click", function () {
        const RT = Date.now() - startingTime; // measure RT before anything else
        let trial_data = {
          trial_name: config.name,
          trial_number: CT + 1,
          response: [$("input[name=answer1]:checked")
            .val(), $("input[name=answer2]:checked")
            .val(), $("input[name=answer3]:checked")
            .val()], //$(response1.on("click"))
          //.val(), //response1.val() + response2.val() + response3.val(), // in other trials: $("input[name=answer]:checked").val(),textInput.val().trim(),
          RT: RT
        };

        trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);
        console.log("do I get till here?");
        magpie.trial_data.push(trial_data);
        magpie.findNextView()
      });
  }
};
