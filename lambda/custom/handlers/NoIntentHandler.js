const { states } = require("../Constants");
const ReviseClassIntentHandler = require("./ReviseClassIntentHandler");
const { stripTags, toMainMenu } = require("../Utils/UtilMethods");
const NoIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.NoIntent"
    );
  },
  handle(handlerInput) {
     var cardContent = "";
     var cardHeader = "beGalileo";
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var speakOutput = " ";
    if (sessionAttributes.state === states.NOTIFICATION) {
          const updatedIntent = sessionAttributes.callBackIntent;
          console.log(updatedIntent);
          if(updatedIntent=="ReviseClassIntent")
            return ReviseClassIntentHandler.handle(handlerInput);
          else
           {
              speakOutput += "ok"
           } 
    } 
    else if(sessionAttributes.state === states.IS_STUDENT || states.CHALLENGE_QUIZ)
    {
      
      sessionAttributes.IS_STUDENT = false;
      return toMainMenu(handlerInput);
    } 
    else {
      speakOutput += "Sorry Iam not sure about that";
    }
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

module.exports = NoIntentHandler;