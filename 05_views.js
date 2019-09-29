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
    text: `<strong>Background story:</strong> Please imagine that you are hired as an external investigator for a nation-wide evaluation of high school performances. Your job is in particular to deliver descriptions of the results of standardized math exam questions for high schools: <strong>Riverside</strong> and <strong>Green Valley</strong>.<br/>
  Importantly, <strong>although you should not tell any lies, your job is not necessarily to report objectively on the facts</strong>. For very good reasons, it is important that Riverside will appear like a high school with a rather <i>low success probability</i> of students succeeding at any one of the standardized math questions. In contrast, it is important that Green Valley appears like a high school with a rather <i>high success probability</i> of any given student succeeding in any given answer. In sum, <strong>you should present Riverside's results to give the impression that is has a low rate of success, and to present Green Valley's results to give the impression that is has a high rate of success</strong>, without telling lies. <br/>
      In the following,
      you will be presented with tables showing the results of students who took a math exam for each high school.
      A  "<i style=color:#13AC38>  &#10004 </i>" indicates that a question was answered correctly, "<i style=color:#B12810> &#10008 </i>" that it was answered incorrect.
      <br />
      <br />
      Given the information from the table, please choose the words to complete a given sentence, so that the resulting sentence best presents Riverside or Green Valley in the way described above.

      We will start with some training trials, before the actual experiment begins, so you can get used to the displays and the manner of forming sentences.`,
  buttonText: 'go to example trials'
});


const instructions2 = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions2',
  title: 'General Instructions',
  text: `Great! You've completed the training phase. We will move on to the main part of the experiment next.
        <br />
        <br />
        Remember: the tables are showing the exam results of students of the statistics class.
        A "<i style=color:#13AC38>  &#10004 </i>" indicates that a task was rated as correctly, "<i style=color:#B12810> &#10008 </i>" that it was rated as wrong.
        <br />
        <br />
        Given the information from the table, you should present Riverside's results to give the impression that is has a low rate of success, and to present Green Valley's results to give the impression that is has a high rate of success</strong>, but avoid telling lies.`,
  buttonText: 'Start main experiment'
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

const training_trials = magpieViews.view_generator("forced_choice", {
    trials: training_trials_data.length,
    title: "Complete the sentence",
    QUD: "Choose one option for each missing word in this sentence.",
    name: 'training_trials',
    data: _.shuffle(training_trials_data),
  },
  {
    stimulus_container_generator: multi_button_generator.stimulus_container_gen,
    answer_container_generator: multi_button_generator.answer_container_gen,
    handle_response_function: multi_button_generator.handle_response_function
  }
);

const main_trials = magpieViews.view_generator("forced_choice", {
    trials: main_trials_data.length,
    title: "Complete the sentence",
    name: "main_trials",
    data: main_trials_data,
  },
  {
    stimulus_container_generator: multi_button_generator.stimulus_container_gen,
    answer_container_generator: multi_button_generator.answer_container_gen,
    handle_response_function: multi_button_generator.handle_response_function
  });

