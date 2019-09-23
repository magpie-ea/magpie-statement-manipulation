// In this file you can specify the trial data for your experiment


const trial_info = {
  forced_choice: [
    {
      question: "What's on the bread?",
      picture: "images/question_mark_02.png",
      option1: 'jam',
      option2: 'ham',
      correct: 'jam'
        },
    {
      question: "What's the weather like?",
      picture: "images/weather.jpg",
      option1: "shiny",
      option2: "rainbow",
      correct: "shiny"
        }
    ]
};

const example_trials = {
  multi_button: [
    {
      QUD: '',
      bias: 0.5,
      row_number: 12,
      column_number: 5,
      question: "Press those buttons which complete the sentence so that the sentence is as accurate as possible to you.",
      table: '<table border=1>' + tableGenerator(5, 5, 0.5) + '<table>',
      sentence_chunk_1: "In this table",
      sentence_chunk_2: "of the students got",
      sentence_chunk_3: "of the questions",
      sentence_chunk_4: ".",
      choice_options_1: ["all", "some", "most", "many", "none"],
      choice_options_2: ["all", "some", "most", "many", "none"],
      choice_options_3: ["right", "wrong"]
    },
    {
      QUD: '',
      table: '<table border=1>' + tableGenerator(5, 5, 0.9) + '<table>',
      sentence_chunk_1: "In this table",
      sentence_chunk_2: "of the students got",
      sentence_chunk_3: "of the questions",
      sentence_chunk_4: ".",
      choice_options_1: ["all", "some", "most", "many", "none"],
      choice_options_2: ["all", "some", "most", "many", "none"],
      choice_options_3: ["right", "wrong"]
    },
    {
      QUD: '',
      table: '<table border=1>' + tableGenerator(5, 6, 0.2) + '<table>',
      sentence_chunk_1: "In this table",
      sentence_chunk_2: "of the students got",
      sentence_chunk_3: "of the questions",
      sentence_chunk_4: ".",
      choice_options_1: ["all", "some", "most", "many", "none"],
      choice_options_2: ["all", "some", "most", "many", "none"],
      choice_options_3: ["right", "wrong"]
      }

  ]
};



const flat_bias_block = {
  multi_button: create_trials(5, 3, 3, 0.5)
};

const bias_bad_grades = {
  multi_button: create_trials(5, 3, 3, 0.1)
};

const bias_good_grades = {
  multi_button: create_trials(1, 3, 3, 0.9)
};
