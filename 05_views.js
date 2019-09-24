// In this file you can instantiate your views
// We here first instantiate wrapping views, then the trial views


/** Wrapping views below

* Obligatory properties

    * trials: int - the number of trials this view will appear
    * name: string

*Optional properties
    * buttonText: string - the text on the button (default: 'next')
    * text: string - the text to be displayed in this view
    * title: string - the title of this view

    * More about the properties and functions of the wrapping views - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/01_template_views/#wrapping-views

*/

// Every experiment should start with an intro view. Here you can welcome your participants and tell them what the experiment is about
const intro = magpieViews.view_generator("intro", {
  trials: 1,
  name: 'intro',
  // If you use JavaScripts Template String `I am a Template String`, you can use HTML <></> and javascript ${} inside
  text: `Thank you for your participation in our study!
         Your anonymous data makes an important contribution to our understanding of human language use.
          <br />
          <br />
          Legal information:
          By answering the following questions, you are participating in a study
          being performed by scientists from the University of Osnabrueck.
          <br />
          <br />
          You must be at least 18 years old to participate.
          <br />
          <br />
          Your participation in this research is voluntary.
          You may decline to answer any or all of the following questions.
          You may decline further participation, at any time, without adverse consequences.
          <br />
          <br />
          Your anonymity is assured; the researchers who have requested your
          participation will not receive any personal information about you.
          `,
  buttonText: 'Begin the experiment'
});

// For most tasks, you need instructions views
const instructions = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions',
  title: 'General Instructions',
  text: `In the following,
      you will be presented with tables showing the exam results of students of the statistics class.
      A  "<i style=color:#13AC38>  &#10004 </i>" indicates that a task was rated as correctly, "<i style=color:#B12810> &#10008 </i>" that it was rated as wrong.
      <br />
      <br />
      Given the information from the table, please choose the three words to complete the sentence, so that it
      best describes the reality.

      We will start with some example trials, before the actual experiment begins.`,
  buttonText: 'go to example trials'
});


const instructions2 = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions2',
  title: 'General Instructions',
  text: `Great! Do you still have questions about the experiment? If so, you can ask the instructor now.
        If everything is clear, we start with the experimental trials now.
        <br />
        <br />
        Remember: the tables are showing the exam results of students of the statistics class.
        A "<i style=color:#13AC38>  &#10004 </i>" indicates that a task was rated as correctly, "<i style=color:#B12810> &#10008 </i>" that it was rated as wrong.
        <br />
        <br />
        Given the information from the table, please choose the three words to complete the sentence, so that it
        best describes the reality.`,
  buttonText: 'go to trials'
});

// In the post test questionnaire you can ask your participants addtional questions
const post_test = magpieViews.view_generator("post_test", {
  trials: 1,
  name: 'post_test',
  title: 'Additional information',
  text: 'Answering the following questions is optional, but your answers will help us analyze our results.'

  // You can change much of what appears here, e.g., to present it in a different language, as follows:
  // buttonText: 'Weiter',
  // age_question: 'Alter',
  // gender_question: 'Geschlecht',
  // gender_male: 'männlich',
  // gender_female: 'weiblich',
  // gender_other: 'divers',
  // edu_question: 'Höchster Bildungsabschluss',
  // edu_graduated_high_school: 'Abitur',
  // edu_graduated_college: 'Hochschulabschluss',
  // edu_higher_degree: 'Universitärer Abschluss',
  // languages_question: 'Muttersprache',
  // languages_more: '(in der Regel die Sprache, die Sie als Kind zu Hause gesprochen haben)',
  // comments_question: 'Weitere Kommentare'
});

// The 'thanks' view is crucial; never delete it; it submits the results!
const thanks = magpieViews.view_generator("thanks", {
  trials: 1,
  name: 'thanks',
  title: 'Thank you for taking part in this experiment!',
  prolificConfirmText: 'Press the button'
});

/** trial (magpie's Trial Type Views) below

* Obligatory properties

    - trials: int - the number of trials this view will appear
    - name: string - the name of the view type as it shall be known to _magpie (e.g. for use with a progress bar)
            and the name of the trial as you want it to appear in the submitted data
    - data: array - an array of trial objects

    * Optional properties

        - pause: number (in ms) - blank screen before the fixation point or stimulus show
        - fix_duration: number (in ms) - blank screen with fixation point in the middle
        - stim_duration: number (in ms) - for how long to have the stimulus on the screen
          More about trial life cycle - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/04_lifecycles_hooks/

        - hook: object - option to hook and add custom functions to the view
          More about hooks - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/04_lifecycles_hooks/

    * All about the properties of trial views
    * https://magpie-ea.github.io/magpie-docs/01_designing_experiments/01_template_views/#trial-views
    */

const example_block = magpieViews.view_generator("forced_choice", {
    trials: example_trials.multi_button.length,
    title: "Complete the sentence",
    QUD: "Choose one option for each missing word in this sentence.",
    name: 'example_trials',
    // You can also randomize (shuffle) the trials of a view
    data: _.shuffle(example_trials.multi_button),
  },
  // We add our custom generators here
  {
    stimulus_container_generator: multi_button_generator.stimulus_container_gen,
    answer_container_generator: multi_button_generator.answer_container_gen,
    handle_response_function: multi_button_generator.handle_response_function
  }
);



const flat_trial = magpieViews.view_generator("forced_choice", {
    trials: flat_bias_block.multi_button.length,
    title: "Complete the sentence",
    name: "flat_bias",
    // trial_type: "flat_buttons",
    data: flat_bias_block.multi_button,
  }, // now the custom generators
  {
    stimulus_container_generator: multi_button_generator.stimulus_container_gen,
    answer_container_generator: multi_button_generator.answer_container_gen,
    handle_response_function: multi_button_generator.handle_response_function
  });


const good_trial = magpieViews.view_generator("forced_choice", {
    trials: bias_good_grades.multi_button.length,
    title: "Complete the sentence",
    name: "good_grade_bias",
    data: bias_good_grades.multi_button,
  }, // now the custom generators
  {
    stimulus_container_generator: multi_button_generator.stimulus_container_gen,
    answer_container_generator: multi_button_generator.answer_container_gen,
    handle_response_function: multi_button_generator.handle_response_function
  });


const bad_trial = magpieViews.view_generator("forced_choice", {
    trials: bias_bad_grades.multi_button.length,
    title: "Complete the sentence",
    name: "bad_grade_bias",
    // trial_type: "flat_buttons",
    data: bias_bad_grades.multi_button,
  }, // now the custom generators
  {
    stimulus_container_generator: multi_button_generator.stimulus_container_gen,
    answer_container_generator: multi_button_generator.answer_container_gen,
    handle_response_function: multi_button_generator.handle_response_function
  });

// There are many more templates available:
// forced_choice, slider_rating, dropdown_choice, testbox_input, rating_scale, image_selection, sentence_choice,
// key_press, self_paced_reading and self_paced_reading_rating_scale
