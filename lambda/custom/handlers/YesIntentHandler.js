const { states } = require("../Constants");
const { playVideo } = require("./ChooseOptionMethods");
const {
  studentQuizChallenge,
  stripTags,
  toMainMenu
} = require("../Utils/UtilMethods");
const { shareQuizToParents } = require("../Utils/HttpUtils");
var mHandlerInput;
 var cardContent = "";
 var cardHeader = "beGalileo";
var sessionAttributes;
 var speakOutput = " ";




const YesIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.YesIntent"
    );
  },
  handle(handlerInput) {
      mHandlerInput = handlerInput;
      sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      var state = sessionAttributes.state;
      if (state === states.VIDEO) return playVideo(mHandlerInput);
      else if (state === states.CHALLENGE_QUIZ)
        return studentQuizChallenge(mHandlerInput);
      else if (state === states.NOTIFICATION) {
        speakOutput +=
          "you have a quiz challenge from your parent. <break time='200ms'/> do you want to take the challenge? ";
        cardContent +=
          "You have a quiz challenge from your parent.\r\nDo you want to take the challenge? ";
      } else if (state === states.IS_STUDENT) {
        sessionAttributes.IS_STUDENT = true;
        return toMainMenu(mHandlerInput);
      } 
      else if (state === states.SHARE_SCORE) {
        console.log(
          "Parent " +
            sessionAttributes.parent_id +
            " Student Id " +
            sessionAttributes.student_id
        );
        console.log(
          "SubConceptId " +
            sessionAttributes.sub_concept_id +
            " Score " +
            sessionAttributes.quiz_score
        );
        let dataResponse =  shareQuizToParents(
          sessionAttributes.parent_id,
          sessionAttributes.student_id,
          sessionAttributes.sub_concept_id,
          sessionAttributes.quiz_score
        );
        console.log(dataResponse);
        speakOutput += "Score shared with your parent";
      }
      else {
        speakOutput += "Sorry Iam not sure about that";
      }
      return mHandlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
    
  }
};


module.exports = YesIntentHandler;