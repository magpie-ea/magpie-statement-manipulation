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

// function gets called within tableGenerator, it changes 0 and 1 to red crossmark and greenchecker
function getCheck(result) {
  if (result == 1) {
      return "<i style=color:#073813>" + "&#10004" + "</i>";
  } else {
      return "<i style=color:#e0beba>" + "&#10008" + "</i>";
  }
}

// prerequisits for html table
var names = ["John", "Lisa", "Amy", "Daniel", "Alex", "Tina", "Mia", "Julia", "Tim", "Johann", "Lesly", "Julian", "Chris", "Marie", "Lisanne", "Thomas", "Pablo", "Rebecca", "Theresa", "Susanne", "Jan", "Nico"];
var questions = [" ", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12"];

// this function takes as input attributes rows and cols, this gives the dimensions
// of the output table, the bias influences the percentage of crosses
// and checkers
function tableGenerator_bias(rows, cols, bias) {
  var table = '';
  // set dimensions of table
  var nrRows = rows;
  var nrCols = cols;
  var bias = bias;
  // random sampleing of names
  var tableNames = _.sampleSize(names, rows);

  // the matrix is filled with 1 and 0
  // matrix size depends on parameters rows and cols
  // percentage of 1 and 0 depends on parameter bias
  var matrix = [];
  for (var i = 0; i < rows; i++) {
    matrix[i] = []; // Initialize inner array
    for (var j = 0; j < cols; j++) {
      matrix[i][j] = Math.random();
      if (matrix[i][j] >= bias) {
        matrix[i][j] = 1
      } else {
        matrix[i][j] = 0
      }
    }
  }
  var result = "<table border=1>";
  for (var i = 0; i <= cols; i++) {
    result += '<th>' + questions[i] + '</th>';
  }

  for (var j = 0; j < matrix.length; j++) {
    result += '<tr>';
    result += '<th>' + tableNames[j] + '</th>';
    for (var k = 0; k < matrix[j].length; k++) {
      result += "<td>" + this.getCheck(matrix[j][k]) + "</td>";
    }
    result += "</tr>";
  }

  result += "</table>";
  return {table: result, matrix: matrix};

}


// this function takes as input a situation object (as given in 04_trials.js)
// it creates the table in a matrix description and a HTML description
function tableGenerator_situation(situation) {
    var table = '';
    // set dimensions of table
    var nrRows = situation.instances[0].rows.length;
    var nrCols = situation.instances[0].n_col;
    var rows = situation.instances[0].rows;
    var tableNames = _.sampleSize(names, nrRows);

    // the matrix is filled with 1 and 0
    // matrix size depends on parameters rows and cols
    // percentage of 1 and 0 depends on parameter bias
    var matrix = [];
    for (var i = 0; i < nrRows; i++) {
        matrix[i] = []; // Initialize inner array
        for (var j = 0; j < nrCols; j++) {
            if (rows[i] > j) {
                matrix[i][j] = 1;
            } else {
                matrix[i][j] = 0;
            }
        }
    }
    var result = "<table border=1>";
    // for (var i = 0; i <= nrCols; i++) {
    //     result += '<th>' + questions[i] + '</th>';
    // }

    for (var j = 0; j < matrix.length; j++) {
        result += '<tr>';
        result += '<th>' + tableNames[j] + '</th>';
        for (var k = 0; k < matrix[j].length; k++) {
            if(matrix[j][k] == 1) {
                result += "<td bgcolor='#59b370'>" + this.getCheck(matrix[j][k]) + "</td>";
            } else {
                result += "<td bgcolor='#f26049'>" + this.getCheck(matrix[j][k]) + "</td>";
            }
            // result += "<td>" + this.getCheck(matrix[j][k]) + "</td>";
        }
        result += "</tr>";
    }

    result += "</table>";

    return {table: result, matrix: matrix};

}

// takes as arguments:
// + n = number of trials it should give output,
// + condition = string indicating whether high/low description is the goal
// + situation = situation object (as defined in 04_trials.js)
function create_trials_situation(n, condition, situation) {
    var nr_trials = n;
    var trials = [];
    var i = 0;
    for (var k = 0; k < nr_trials; k++) {
        trials[i] = {
            QUD: '',
            sitation_number: situation.number,
            situation: situation,
            row_number: situation.instances[0].rows,
            column_number: situation.instances[0].rows.length,
            condition: condition,
            question: condition == "low" ? "Describe these results of <strong>Riverside</strong> so as to make it appear as if there is a <strong>low</strong> success rate without lying." :
                "Describe these results of <strong>Green Valley</strong> so as to make it appear as if there is a <strong>high</strong> success rate without lying.",
            // table: '<table border=1>' + tableGenerator_bias(rows, cols, bias) + '<table>',
            sentence_chunk_1: "In this exam",
            sentence_chunk_2: "of the students got",
            sentence_chunk_3: "of the questions",
            sentence_chunk_4: ".",
            choice_options_1: ["all", "most", "some", "none"],
            choice_options_2: ["all", "most", "some", "none"],
            choice_options_3: ["right", "wrong"],
            expected: "placeholder",
            correct: "placeholder"
        };
        i += 1;
    }
    return (trials);
};



// Here, we will define some generator functions for a multi-dropdown view
// take some info from examples, but change it to my purpose
const multi_button_generator = {
  // A generator for our view template
    stimulus_container_gen: function (config, CT) {
        const stimulus = tableGenerator_situation(config.data[CT].situation);
        config.data[CT].stimulus = _.toString(stimulus.matrix).replace(/,/g, "|");
        const table = '<table border=1>' + stimulus.table + '<table>';
    return `<div class='magpie-view'>
                <p class='magpie-view-question magpie-view-question'>${config.data[CT].question}</p>
                <p class='magpie-view-question magpie-view-table'>${table}</p>
            </div>`;
  },

  answer_container_gen: function (config, CT) {
    return `<div class='magpie-view-answer-container magpie-response-multi-dropdown'>

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

    $("#next")
      .on("click", function () {
        const RT = Date.now() - startingTime; // measure RT before anything else
        let trial_data = {
          trial_name: config.name,
          trial_number: CT + 1,
            response: [$("input[name=answer1]:checked").val(), $("input[name=answer2]:checked").val(), $("input[name=answer3]:checked").val()],
          RT: RT
        };

        trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);
        magpie.trial_data.push(trial_data);
        magpie.findNextView();
      });
  }
};
