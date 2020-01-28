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
          Before starting the experiment, please read the legal information on the next page carefully.
          <br />
          <br />
          You must be at least 18 years old to participate.
          <br />
          Your anonymity is assured; the researchers who have requested your
          participation will not receive any personal information about you.
          `,
  buttonText: 'Show me the legal information'
});

const legal_info = magpieViews.view_generator("intro", {
  trials: 1,
  name: 'legal_info',
  // If you use JavaScripts Template String `I am a Template String`, you can use HTML <></> and javascript ${} inside
  text: `<b>Study title</b>: Describing exam results
         <br />
         <br />
         <b>Principal Investigator</b>: Chris Cummins
         <br />
         <br />
         <b>Researcher collecting data</b>: Michael Franke
          <br />
          <br />
          <b>What is this document?</b>  This document explains what kind of study we’re doing, what your rights are, and what will be done with your data. You should print this page for your records.
          <br />
          <br />
          <b>Nature of the study.</b> You are invited to participate in a study which involves looking sets of at (fictitious) exam results. You will either be asked to describe these results, or to interpret other people’s descriptions of them. Once you finish, we may have also some questions about your experience (e.g., age, gender, language background). Your session should last for up to 20 minutes. You will be given full instructions shortly.
          <br />
          <br />
          <b>Compensation.</b> You will be paid £2.50 for your participation in this study.
          <br />
          <br />
          <b>Risks and benefits.</b> There are no known risks to participation in this study. Other than the payment mentioned, there are no tangible benefits to you, however you will be contributing to our knowledge about language.  
          <br />
          <br />
          <b>Confidentiality and use of data.</b> All the information we collect during the course of the research will be processed in accordance with Data Protection Law. In order to safeguard your privacy, we will never share personal information (like your name) with anyone outside the research team. Your data will be referred to by a unique participant number rather than by name). Please note that we will temporarily collect your participant ID to prevent repeated participation, however we will never share this information with anyone outside the research team. We will store any personal data (i.e., participant ID) securely using the University of Osnabrück’s storage systems. The anonymised data collected during this study will be used for research purposes and may be shared with other researchers or with the general public (e.g., we may make it available through the world wide web, or use it in TV or radio broadcasts).
          <br />
          <br />
          <b>What are my data protection rights?</b> The University of Edinburgh is a Data Controller for the information you provide.  You have the right to access information held about you. Your right of access can be exercised in accordance Data Protection Law. You also have other rights including rights of correction, erasure and objection.  For more details, including the right to lodge a complaint with the Information Commissioner’s Office, please visit www.ico.org.uk.  Questions, comments and requests about your personal data can also be sent to the University Data Protection Officer at dpo@ed.ac.uk.
          <br />
          <br />
          <b>Voluntary participation and right to withdraw.</b> Your participation is voluntary, and you may withdraw from the study at any time and for any reason. If you withdraw from the study after data gathering, we will delete your data and there is no penalty or loss of benefits to which you are otherwise entitled. To withdraw from the study after data gathering please contact the research team until 31/03/2020 by providing your prolific participant ID. After this deadline we will delete the participant IDs which means we won’t be able to identify you to delete your data. 
          <br />
          <br />
          If you have any questions about what you’ve just read, please feel free to ask, or contact us later. You can contact us by email at ccummins@exseed.ed.ac.uk. This project has been approved by PPLS Ethics committee. If you have questions or comments regarding your rights as a participant, they can be contacted at +44 (0)131 650 4020 or ppls.ethics@ed.ac.uk.
          <br />
          <br />
          By accepting this task, you consent to the following:
          <br />
          <br />
          <span style="margin-left:2em">1. <b>I agree to participate in this study.</b></span>
          <br />
          <br />
          <span style="padding-left:2em">2. I confirm that I have read and understood <b>how my data will be stored and used.</b></span>
          <br />
          <br />
          <span style="margin-left:2em">3. I understand that I have the <b>right to terminate this session</b> at any point. If I choose to <b>withdraw after completing the study</b> by contacting the research team until <b>31/03/2020</b>, my <b>data will be deleted</b> at that time.</span>
          `,
  buttonText: 'Begin the experiment'
});

const instructions_general = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions',
  title: 'General Instructions',
  text: `Many events in life can be interpreted in one way or another. Think of describing the same glass as either half full or half empty. In this experiment, we are interested in how <i>you</i> would creatively use language to stress one view of a situation or another.
  <br/><br/>
  We will show you pictures of situations (results from an exam). Your task is to write a description of that situation, which might emphasize or deemphasize a certain impression in the mind of a person who has not seen the picture. <strong>Please refrain from giving blatantly false descriptions (no lies!)</strong>. But otherwise, try to be creative in your use of language.
  <br/><br/>
  The next screen will give you more concrete instructions for the upcoming task.`,
  buttonText: 'Got it! Proceed!'
});


const instructions_specific = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions',
  title: 'Background Story & Specific Instructions',
  text: `<strong>Background story:</strong> Please imagine you have been hired as a marketing consultant for Green Valley High School. Part of your job is to write a report on the results of standardized math exam questions. These results have been published for Green Valley and for your main rival, Riverside High School.
  <br/><br/>
  It's important that you don't tell any lies in the report, but you don't have to report objectively on the facts. <strong>Your aim is to make Green Valley sound like a school whose students have a high probability of success on the exam questions, and Riverside sound like a school whose students have a low probability of success.</strong>
  <br/><br/>
  In the following, you will be presented with tables showing the results of students who took a math exam for each high school.
  The tables show the number of questions each student answered correctly or incorrectly. For each correctly answered question, the table contains a "<i style=color:#13AC38>  &#10004 </i>", and for each incorrectly answered question, the table contains a "<i style=color:#B12810> &#10008 </i>".
  <br />
  <br />
  Given the information from the table, please <strong>type a short sentence which truthfully describes the situation and which emphasizes a high or low overall probability of success</strong> (as indicated in each trial).
  <br />
  <br />
  The next screen will show you an example.`,
  buttonText: 'Show me an example!'
});



const example = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions',
  title: 'Example',
  text: `
  Here is an example of a picture showing exam results. For each student listed, you see an indication of how many questions that student answered correctly. Remember that for each correctly answered question, the table contains a "<i style=color:#13AC38>  &#10004 </i>", and for each incorrectly answered question, the table contains a "<i style=color:#B12810> &#10008
  <br />
  <br />
  </i>
  <img src="07_example_picture.png" style="width:100%;" alt="exam results">
  <br />
  <br />
  If these are results from Green Valley, so that your task is to make this as if like students, on average, have a high probability of success, you could say something like:
  <br />
  "Most of the students got most of the questions right."
  <br />
  <br />
  If these are results from Riverside, so that your task is to make this sound as if students, on average, have a low probability of success, you could say something like:
  <br />
  "Only a few students got a full score."
`,
  buttonText: 'Start Experiment!'
});

const instructions2 = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions2',
  title: 'Instructions (reminder)',
  text: `Great! You've completed the training phase. We will move on to the main part of the experiment next.
        <br />
        <br />
        Remember: the tables are showing the exam results of students of the statistics class.
        A "<i style=color:#13AC38>  &#10004 </i>" indicates that a task was rated as correctly, "<i style=color:#B12810> &#10008 </i>" that it was rated as wrong.
        <br />
        <br />
        Given the information from the table, you should present Riverside's results in such a way as to give the impression that Riverside has a low rate of success, and to present Green Valley's results to give the impression that is has a high rate of success</strong>, but avoid telling lies.`,
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
    data: training_trials_data,
  },
  {
    stimulus_container_generator: multi_button_generator.stimulus_container_gen,
    answer_container_generator: multi_button_generator.answer_container_gen,
    handle_response_function: multi_button_generator.handle_response_function
  }
);

const main_trials = magpieViews.view_generator("textbox_input", {
    trials: 11,
    title: "Complete the sentence",
    name: "main_trials",
    data: main_trials_data,
  },
  {
      stimulus_container_generator: multi_button_generator.stimulus_container_gen,
      answer_container_generator: function(config, CT) {
          return `<div class='magpie-view-answer-container'>
                        <textarea name='textbox-input' rows=5 cols=50 class='magpie-response-text' />
                    </div>
                    <button id='next' class='magpie-view-button magpie-nodisplay'>next</button>`;
      }
  });

