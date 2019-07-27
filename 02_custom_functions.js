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

// function to generate random 1 and 0 values for table
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

var matrix1 = createMatrix(4, 6);
var matrix2 = createMatrix(4, 6);
var matrix3 = createMatrix(4, 6);

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
  // if I enter the mat.round .... here, I can create random tables, but it is not safed in matrix then...
  table += '<td>' + matrix1[2][2] + '</th>';

  //for (var c = 0; c < 4; c++) {
}

// table += '<td>' + matrix1[0][0] + '</td>';
// table += '<td>' + matrix1[0][1] + '</td>';
// table += '<td>' + matrix1[0][2] + '</td>';
// table += '<td>' + matrix1[0][3] + '</td>';
//
//}
table += '</tr>';


//
// '<style >' +
// th, td {
//   padding: 15 px;
//   font - family: calibri;
// } +
// '</style>'

document.write('<table border=1>' + table + '<table>')


// Here, we will define some generator functions for a multi-dropdown view
const multi_dropdown_gens = {
  // A generator for our view template
  stimulus_container_gen: function (config, CT) {
    return `<div class='babe-view'>
                <h1 class='babe-view-title'>${config.title}</h1>
                <p class='babe-view-question babe-view-qud'>${config.data[CT].QUD}</p>
                <p class='babe-response-keypress-header' id = 'reminder'></p>
                </div>`;
  },
  // A generator for the answer container
  answer_container_gen: function (config, CT) {
    return `<div class='babe-view-answer-container babe-response-dropdown'>
                ${config.data[CT].sentence_chunk_1}
                <select id='response1' name='answer_1'>
                    <option disabled selected></option>
                    <option value=${config.data[CT].choice_options_1[0]}>${config.data[CT].choice_options_1[0]}</option>
                    <option value=${config.data[CT].choice_options_1[1]}>${config.data[CT].choice_options_1[1]}</option>
                    <option value=${config.data[CT].choice_options_1[2]}>${config.data[CT].choice_options_1[2]}</option>
                    <option value=${config.data[CT].choice_options_1[3]}>${config.data[CT].choice_options_1[3]}</option>
                    <option value=${config.data[CT].choice_options_1[4]}>${config.data[CT].choice_options_1[4]}</option>
                </select>
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
                <button id='next' class='babe-view-button babe-nodisplay'>Next</button>
            </div>`;
  },
  // A generator for the enable response function
  handle_response_function: function (config, CT, babe, answer_container_generator, startingTime) {
    let response1;
    let response2;
    let response3;

    $(".babe-view")
      .append(answer_container_generator(config, CT));

    response1 = $("#response1");
    response2 = $("#response2");
    response3 = $("#response3");

    // flags to check if dropdown menus have been used
    let response_flags = [0, 0];

    const display_button_checker = function (response_number) {
      response_flags[response_number] = 1;
      if (_.min(response_flags) === 1) {
        $("#next")
          .removeClass("babe-nodisplay");
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

        trial_data = babeUtils.view.save_config_trial_data(config.data[CT], trial_data);

        babe.trial_data.push(trial_data);
        babe.findNextView();
      });
  }

};
