const { states,sub_states ,speechConsCorrect, speechConsWrong } = require("../Constants");

const Constants = require("../Constants");
const {
  quizResultVoiceExpression,
  studentQuizChallengeValuate,
  toMainMenu,
  getHelpMessage
} = require("../Utils/CommonUtilMethods");
const { valuateQuizCricketAnswer } = require("../Utils/QuizCricketGameMethods");


const QuizAnswerIntentHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;
    return (
      // attributes.state === states.QUIZ &&
      
      request.type === "IntentRequest" &&
      request.intent.name === "AnswerIntent" &&
      (attributes.state === states.QUIZ ||
        attributes.state === states.CHALLENGE_QUIZ ||
        (attributes.state === states.GAME_QUIZ_CRICKET && attributes.sub_state === sub_states.GAME_RESUME)
      )
    );
  },
  handle(handlerInput) {
    console.log("Inside AnswerHandler - handle");
    const response = handlerInput.responseBuilder;
    const slot = handlerInput.requestEnvelope.request.intent.slots;
    var speechText = "";
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
     var resolutionsPerAuth =
       handlerInput.requestEnvelope.request.intent.slots["answer"]
         .resolutions.resolutionsPerAuthority;
     var optionId = resolutionsPerAuth[0].values[0].value.id;
    // const userAnswer = slot["answer"].value.toLowerCase().replace(".", "");
     var userAnswer = "";
    if(optionId==0)
      {
          userAnswer = "a";
      }
      else
      {
        userAnswer = "b";
      }
   
    
      console.log("userAnswer : "+userAnswer+" Option Id "+optionId);
      if(sessionAttributes.state === states.GAME_QUIZ_CRICKET)
      {
          return valuateQuizCricketAnswer(handlerInput,userAnswer);
      }

      if(sessionAttributes.state===states.CHALLENGE_QUIZ)
      {
        return studentQuizChallengeValuate(handlerInput,userAnswer);
      }
     else if (sessionAttributes.state === states.QUIZ) {
        let speechText = determineCorrectAnswer(
          userAnswer,
          sessionAttributes.current_answer,
          sessionAttributes
        );
        if (sessionAttributes.question_count < 4) {
          var questionCountLabel = sessionAttributes.question_count + 1;
          var cardHeader = "Quiz";
          speechText += getNextQuestion(handlerInput);
          var cardText = getCardText(handlerInput);
          sessionAttributes.repeat_message = speechText;
          return response
            .speak(speechText)
            .withShouldEndSession(false)
            .reprompt(speechText)
            .withSimpleCard(cardHeader, cardText)
            .getResponse();
        } else {
          sessionAttributes.state = states.QUIZ_NONE;
          var cardHeader = "Thats all for now";
          var cardText = "";
          if (sessionAttributes.quiz_score <= 3) {
            speechText +=
              ' <break time="0.5s" /> Thats all for now . Your score is too low. ' +
              "Do you want to revise the lesson ? ";
            sessionAttributes.state = states.VIDEO;
            cardText +=
              "Your score is too low.\r\n Do you want to revise the lesson ? ";
             
          } else {
            speechText +=
              ' <break time="0.5s" /> Thats all for now . ' +
              ". Well done. Do you want to share the score with your parent ? ";
              sessionAttributes.state = states.SHARE_SCORE;
            cardText +=
              "Well done. \r\n Do you want to share the score with your parent ? ";
          }
           sessionAttributes.help_message = Constants.yes_or_no_help_message;
           sessionAttributes.repeat_message = speechText;
          return response
            .speak(speechText)
            .withShouldEndSession(false)
            .reprompt(speechText)
            .withSimpleCard(cardHeader, cardText)
            .getResponse();
        }
      }
      
      else
      {
        var repeatMessage = sessionAttributes.repeat_message;
        console.log(repeatMessage);
        return toMainMenu(handlerInput);
      }
      
  }
};


function getNextQuestion(handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.question_count = sessionAttributes.question_count + 1;
  var question = sessionAttributes.questions[sessionAttributes.question_count];
  var choices = question.choices;
  console.log(choices);
  var current_question =
    question.question_text +
    getOptionSpeechTest("A") +
    choices[0].choices +
    getOptionSpeechTest("B") +
    choices[1].choices;

  if (choices[0].correct) sessionAttributes.current_answer = "a";
  else sessionAttributes.current_answer = "b";

  return ` ...<break time="2s" />${current_question}`;
}


function getCardText(handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  var question = sessionAttributes.questions[sessionAttributes.question_count];
  var choices = question.choices;
  console.log(choices);
  let text = "";
  text += 'Q: '+question.question_text +"\r\n";

  text += "A. " + choices[0].choices + "\r\n";
  text += "B. " + choices[1].choices + "\r\n";

  return text;
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function determineCorrectAnswer(userAnswer, correctAnswer, sessionAttributes) {
  if (userAnswer === correctAnswer) {
    sessionAttributes.quiz_score++;
    var itsCorrectMessage = speechConsCorrect[getRandomInt(10)];
    var correctTone = quizResultVoiceExpression(true,itsCorrectMessage)
    return (
      "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_positive_01'/>" +
      correctTone +
      " ! Option  " +
      userAnswer.toUpperCase() +
      "  is correct. " +
      "Your score is " +
      sessionAttributes.quiz_score
    );
  } else {
    var itsWrongMessage = speechConsWrong[getRandomInt(10)];
    var wrongTone = quizResultVoiceExpression(false, itsWrongMessage);
    return (
      "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_negative_01'/> " +
      wrongTone +
      " ! Option " +
      userAnswer.toUpperCase() +
      " is Incorrect." +
      " Your score is " +
      sessionAttributes.quiz_score
    );
  }
}

function getOptionSpeechTest(value) {
  return (
    '<break time="0.3s" /> Option<break time="0.2s" /> <say-as interpret-as="spell-out">' +
    value +
    "</say-as> "
  );
}

module.exports = QuizAnswerIntentHandler;
