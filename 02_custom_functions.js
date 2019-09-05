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

// Declare your hooks here

// create html table for trials
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

// function which changes 0 and 1 to crossmark and checker
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
                <p class='magpie-response-keypress-header' id = 'reminder'></p>
                </div>`;
  },

  answer_container_gen: function (config, CT) {
    return `<div class='magpie-view-answer-container magpie-response-dropdown'>
    <div class='magpie-view-answer-container'>
                  <p class='magpie-view-question'>${config.data[CT].question}</p>
                 ${config.data[CT].sentence_chunk_1}
                  <div class= 'response-table'>
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
                  </div>
                ${config.data[CT].sentence_chunk_2}
                <div class= 'response-table'>
                      <label for='o1' class='magpie-response-buttons'>${config.data[CT].choice_options_2[0]}</label>
                      <input type='radio' name='answer' id='o1' value=${config.data[CT].choice_options_2[0]} />
                      <label for='o2' class='magpie-response-buttons'>${config.data[CT].choice_options_2[1]}</label>
                      <input type='radio' name='answer' id='o2' value=${config.data[CT].choice_options_2[1]} />
                      <label for='o3' class='magpie-response-buttons'>${config.data[CT].choice_options_2[2]}</label>
                      <input type='radio' name='answer' id='o3' value=${config.data[CT].choice_options_2[2]} />
                      <label for='o4' class='magpie-response-buttons'>${config.data[CT].choice_options_2[3]}</label>
                      <input type='radio' name='answer' id='o4' value=${config.data[CT].choice_options_2[3]} />
                      <label for='o5' class='magpie-response-buttons'>${config.data[CT].choice_options_2[4]}</label>
                      <input type='radio' name='answer' id='o5' value=${config.data[CT].choice_options_2[4]} />
                </div>
                ${config.data[CT].sentence_chunk_3}
                <div class= 'response-table'>
                      <label for='o1' class='magpie-response-buttons'>${config.data[CT].choice_options_3[0]}</label>
                      <input type='radio' name='answer' id='o1' value=${config.data[CT].choice_options_3[0]} />
                      <label for='o2' class='magpie-response-buttons'>${config.data[CT].choice_options_3[1]}</label>
                      <input type='radio' name='answer' id='o2' value=${config.data[CT].choice_options_3[1]} />
                </div>
                ${config.data[CT].sentence_chunk_4}
                </p>
                <button id='next' class='magpie-view-button magpie-nodisplay'>Next</button>
            </div>`;
  },



  // old handle response function with dropdown approach
  // handle_response_function: function (config, CT, magpie, answer_container_generator, startingTime) {
  //
  //   let response1;
  //   let response2;
  //   let response3;
  //
  //   $(".magpie-view")
  //     .append(answer_container_generator(config, CT));
  //
  //   response1 = $("#response1");
  //   response2 = $("#response2");
  //   response3 = $("#response3");
  //
  //   // flags to check if dropdown menus have been used
  //   // I think this needs to be [0,0,0]
  //   let response_flags = [0, 0];
  //
  //   // I changed the if condition to === 2, next button doesnt show after 2nd press, but also not after 3rd
  //   const display_button_checker = function (response_number) {
  //     response_flags[response_number] = 1;
  //     if (_.min(response_flags) === 1) {
  //       $("#next")
  //         .removeClass("magpie-nodisplay");
  //     }
  //   };
  //
  //   response1.on("change", function () {
  //     response_flags[0] = 1;
  //     display_button_checker(0);
  //   });
  //   response2.on("change", function () {
  //     response_flags[1] = 1;
  //     display_button_checker(1);
  //   });
  //   response3.on("change", function () {
  //     response_flags[2] = 1;
  //     display_button_checker(2);
  //   });
  //
  //
  //   $("#next")
  //     .on("click", function () {
  //       const RT = Date.now() - startingTime; // measure RT before anything else
  //       // clear old timeouts and remove them from the timeout array
  //       clearTimeout(window.timeout[0]);
  //       window.timeout.shift();
  //       let trial_data = {
  //         trial_name: config.name,
  //         trial_number: CT + 1,
  //         sentence_frame: config.data[CT].sentence_chunk_1
  //           .concat("...")
  //           .concat(config.data[CT].sentence_chunk_2)
  //           .concat("...")
  //           .concat(config.data[CT].sentence_chunk_3)
  //           .concat("...")
  //           .concat(config.data[CT].sentence_chunk_4),
  //         response_1: $(response1)
  //           .val(),
  //         response_2: $(response2)
  //           .val(),
  //         response_3: $(response3)
  //           .val(),
  //         RT: RT
  //       };
  //
  //       trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);
  //
  //       magpie.trial_data.push(trial_data);
  //       magpie.findNextView();
  //     });
  // }

  handle_response_function: function (config, CT, magpie, answer_container_generator, startingTime) {
    $(".magpie-view")
      .append(answer_container_generator(config, CT));

    // attaches an event listener to the yes / no radio inputs
    // when an input is selected a response property with a value equal
    // to the answer is added to the trial object
    // as well as a readingTimes property with value
    $("input[name=answer]")
      .on("change", function () {
        const RT = Date.now() - startingTime;
        let trial_data = {
          trial_name: config.name,
          trial_number: CT + 1,
          response: $("input[name=answer]:checked")
            .val(),
          RT: RT
        };

        trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

        magpie.trial_data.push(trial_data);

        // if ... showNextBtn();
        // moves to the next view
        // next.on("click", function() {
        //     if (magpie.deploy.deployMethod === "Prolific") {
        //         magpie.global_data.prolific_id = prolificId.val().trim();
        //     }


        magpie.findNextView();
      });
  }

};


//needs to be deleted, but inspiration for function of next button from intro handle response function
function showNextBtn() {
  if (prolificId.val()
    .trim() !== "") {
    next.removeClass("magpie-nodisplay");
  } else {
    next.addClass("magpie-nodisplay");
  }
}
