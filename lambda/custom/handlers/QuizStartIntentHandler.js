const { states } = require("../Constants");
const { getQuizQuestions } = require("../Utils/HttpUtils");
const Constants = require("../Constants");


const QuizIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && 
      request.intent.name === "QuizIntent"
    );
  },
  async handle(handlerInput) {
    console.log("Inside QuestionHandler - handle");
    var speakOutput = "";
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;
     var studentId = sessionAttributes.student_id;
     var subConceptId = sessionAttributes.sub_concept_id;
    //  var studentId = 41913;
    //  var subConceptId = 5411;
     var type = "quiz"; 


    const dataResponse = await getQuizQuestions(studentId, subConceptId, type);
    if (!dataResponse.status) {
     speakOutput = "No quiz data found for your account. "+Constants.conclude_message;
      sessionAttributes.state = states.CONCLUDE;
      sessionAttributes.repeat_message = speakOutput;
      return response
      .withShouldEndSession(false)
        .speak(speakOutput)
        .getResponse();
    }
    var questions = dataResponse.question_data;
    sessionAttributes.questions = questions;
    sessionAttributes.question_count = 0;
    sessionAttributes.quiz_score = 0;
    sessionAttributes.state = states.QUIZ;
   
    var cardText = "";
    cardText += 'Q: '+
      questions[sessionAttributes.question_count].question_text + "\r\n";

    var current_question =
      '<break time="0.3s" />' +
      questions[sessionAttributes.question_count].question_text;
    var choices = questions[sessionAttributes.question_count].choices;

    if (choices[0].correct) sessionAttributes.current_answer = "a";
    else sessionAttributes.current_answer = "b";

    var questionCountLabel = sessionAttributes.question_count+1;
    var cardHeader = "Quiz" ;

    cardText += "A. "+choices[0].choices+"\r\n";
    cardText += "B. " + choices[1].choices + "\r\n";

     speakOutput =
      'Starting Quiz<break time="0.3s" /> You can say Option A or Option B .Here is the Question : ' +
      current_question +
      getOptionSpeechTest("A") +
      choices[0].choices +
      getOptionSpeechTest("B") +
      choices[1].choices;

    const rePromptQuestion =
      current_question +
      getOptionSpeechTest("A") +
      choices[0].choices +
      getOptionSpeechTest("B") +
      choices[1].choices;
    sessionAttributes.help_message = Constants.option_help_message;
      sessionAttributes.repeat_message = speakOutput;
    return response
      .speak(speakOutput)
      .reprompt(rePromptQuestion)
      .withShouldEndSession(false)
      .withSimpleCard(cardHeader, cardText)
      .getResponse();
  }
};

function getOptionSpeechTest(value) {
  return (
    '<break time="0.3s" /> Option<break time="0.2s" /> <say-as interpret-as="spell-out">' +
    value +
    "</say-as> "
  );
}



module.exports = QuizIntentHandler;