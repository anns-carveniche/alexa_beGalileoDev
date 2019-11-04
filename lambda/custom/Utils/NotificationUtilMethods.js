const { states } = require("../Constants");
const { updateNotification } = require("./HttpUtils");
const { stripTags,getHelpMessage } = require("../Utils/UtilMethods")
var cardContent = "";
var cardHeader = "beGalileo";
function isNotificationAvailable(notifications)
{
    if(notifications.length > 0)
        return true;
    else
        return false;     
}
function NotificationAlert(handlerInput)
{
        var speechText = "You have a notification do you want to check it"
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.state = states.NOTIFICATION;
        return handlerInput.responseBuilder
          .withShouldEndSession(false)
          .speak(speechText)
          .getResponse();
}



function ReadStudentNotification(handlerInput)
{
    
       const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       var speakOutput = " ";
      console.log("EEEEEEE " + sessionAttributes.dataResponse);
      var studentData = sessionAttributes.dataResponse.student_data[0];
      var notificationUnseen =
        studentData.concept_practiced[0].unseen_notifications;
      if (notificationUnseen.length < 1) {
        speakOutput = "You don't have any notification right now ";
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .reprompt(getHelpMessage(handlerInput))
          .getResponse();
      }
      if (notificationUnseen[0].name === "highfy") {
          updateNotification(notificationUnseen[0].id);
        speakOutput = "You got a <break time='200ms'/> hi-fi from your parent";
        cardHeader = "Hi-Five"
        return handlerInput.responseBuilder
          .withSimpleCard(cardHeader, stripTags(speakOutput))
          .withShouldEndSession(false)
          .reprompt(getHelpMessage(handlerInput))
          .speak(speakOutput)
          .getResponse();
      }

      if (notificationUnseen[0].name === "quiz_challenge") {
        sessionAttributes.state = states.CHALLENGE_QUIZ;
        speakOutput =
          "You have a quiz challenge from your parent <break time='200ms'/> do you want to take it?";
          cardHeader = "Hi-Five";
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .withSimpleCard(cardHeader, stripTags(speakOutput))
          .getResponse();
      }

      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
}

function ReadParentNotification(handlerInput)
{
    var speakOutput = ""
     const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
     var parentData = sessionAttributes.dataResponse.parent_data[0];
     var notificationUnseen =
       parentData.unseen_notifications;
    if (notificationUnseen.length < 1) {
      speakOutput = "You don't have any notification right now";
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .reprompt(getHelpMessage(handlerInput))
        .getResponse();
    }
    if (notificationUnseen[0].name === "quiz_challenge_completion") {
       var speakOutput =
         "Hai <break time='200ms'/>"
        if (notificationUnseen[0].status === "success")
        {
            speakOutput +=
              sessionAttributes.studentName +
              " won the quiz challenge";
        }
        else
        {
            speakOutput += sessionAttributes.studentName + " failed the quiz challenge";
        }
         updateNotification(notificationUnseen[0].id);
                    return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .withSimpleCard(cardHeader,stripTags(speakOutput))
                        .withShouldEndSession(false)
                        .getResponse();
     }


    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false)
      .getResponse();
}


module.exports = {
  isNotificationAvailable,
  NotificationAlert,
  ReadStudentNotification,
  ReadParentNotification
};