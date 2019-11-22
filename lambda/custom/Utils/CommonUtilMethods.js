var cardContent = "";
var cardHeader = "beGalileo";
const { getChallengeQuiz, submitQuizChallenge } = require("./HttpUtils");
const { getUserInfo } = require("./HttpUtils");
const { isNotificationAvailable } = require("./NotificationUtilMethods")
const Constants = require("../Constants");
const states = Constants.states;

async function openMainMenu(handlerInput){
   const accessToken =
          handlerInput.requestEnvelope.context.System.user.accessToken;

        console.log("Access Token "+accessToken);
        if (accessToken == undefined) {
          const speechText =
            "Please use the Alexa app to link your Amazon account to the external account";
       sessionAttributes.repeat_message = speechText;
          return handlerInput.responseBuilder
            .speak(speechText)
            .withLinkAccountCard()
            .getResponse();
        }
         else {
      
          const dataResponse = await getUserInfo(accessToken);
          const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
          if (!dataResponse.status) {
            return handlerInput.responseBuilder
              .speak(Constants.email_not_registered)
              .getResponse();
          }
          if (dataResponse.student_data.length < 1) {
            var speechText =
              Constants.no_student_registered + email + " account";
              sessionAttributes.repeat_message = speechText;
            return handlerInput.responseBuilder
              .speak(speechText)
              .withSimpleCard("beGalileo", speechText)
              .getResponse();
          }
          var studentName =
            dataResponse.student_data[0].first_name +
            " " +
            dataResponse.student_data[0].last_name;

          var speechText =
            "Hello! welcome to be galileo <break time='200ms'/>  Are you " +
            studentName +
            "?";
          var cardText = "Hello! welcome to beGalileo Are you " + studentName;
          sessionAttributes.state = states.IS_STUDENT;
          sessionAttributes.studentName = studentName;
          sessionAttributes.dataResponse = dataResponse;
          sessionAttributes.parent_id = dataResponse.parent_data[0].id;
          sessionAttributes.repeat_message = speechText;
          return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard("beGalileo", cardText)
            .withShouldEndSession(false)
            .getResponse();
        }
}

async function getEmail(handlerInput) {
  const {
    requestEnvelope,
    serviceClientFactory,
    responseBuilder
  } = handlerInput;
  const token =
    requestEnvelope.context.System.user.permissions &&
    requestEnvelope.context.System.user.permissions.consentToken;

  if (!token) {
    return responseBuilder
      .speak("Please Provide Permissions!")
      .withAskForPermissionsConsentCard(["alexa::profile:email:read"])
      .getResponse();
  }

  let { deviceId } = requestEnvelope.context.System.device;
  const upsServiceClient = serviceClientFactory.getUpsServiceClient();
   const email = await upsServiceClient.getProfileEmail();
   return email;
}

function sendNotification(message)
{
      var serverKey = "AIzaSyCI1MWRHkD38bsweCZBvl-HIen0jNF4UOI"; //put your server key here
      var fcm = new FCM(serverKey);
      fcm.send(message, function(err, response) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
}

async function studentQuizChallenge(handlerInput)
{
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  
      var notification =
      sessionAttributes.dataResponse.student_data[0].concept_practiced[0].unseen_notifications[0];

      var dataResponse = await getChallengeQuiz(notification.id);  
      var questionData = dataResponse.question_data[0];
      var speakText =
        "Here is the question <break time='200ms'/>" +
        questionData.question_text; ;
        speakText +=
          '<break time="200ms"/> Option  <say-as interpret-as="spell-out">A</say-as>' +
                questionData.choices[0].choices;
        speakText +=
          '<break time="200ms"/> Option  <say-as interpret-as="spell-out">B</say-as>' +
                 questionData.choices[1].choices;
      sessionAttributes.dataResponse = dataResponse;
      cardContent += "Question : "+questionData.question_text+" \r\n";
      cardContent += "Option A : " + questionData.choices[0].choices+"\r\n";
      cardContent += "Option B : " + questionData.choices[1].choices;
  sessionAttributes.repeat_message = speakText;
  sessionAttributes.help_message = Constants.option_help_message;
      return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .withSimpleCard(cardHeader,cardContent)
        .speak(speakText)
        .getResponse();
}


function studentQuizChallengeValuate(handlerInput,userAnswer)
{
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    var dataResponse = sessionAttributes.dataResponse;
    var choices = dataResponse.question_data[0].choices;
    var notificationId = dataResponse.question_data[0].alexa_user_notification_id;
    var questionId = dataResponse.question_data[0].question_id;
    var studentChoiceId = 0;
    var speakText = "";
    var correctAnswer="";
    if(choices[0].choices)
    {
      correctAnswer = "a";
      
    }
    else
    {
      correctAnswer = "b";
    }
    if(correctAnswer===userAnswer)
    {
        speakText +=
          'Well done <break time="200ms"/> Option <say-as interpret-as="spell-out">' + userAnswer +'</say-as>  is correct';
    }
    else
    {
         speakText +=
           'Well done <break time="200ms"/> Option <say-as interpret-as="spell-out">' +
           userAnswer +
           "</say-as>  is Incorrect";
    }

    if(userAnswer==="a")
    {
        studentChoiceId = choices[0].id;
    }
    else
    {
        studentChoiceId = choices[1].id;
    }

    speakText += '<break time="200ms"/> Thank you <break time="200ms"/>'+Constants.conclude_message;
    sessionAttributes.state = states.CONCLUDE;
    submitQuizChallenge(notificationId, questionId,studentChoiceId);
    sessionAttributes.repeat_message = speakText;
    sessionAttributes.help_message = Constants.yes_or_no_help_message;
    return handlerInput.responseBuilder
    .withShouldEndSession(false)
      .speak(speakText)
      .getResponse();
}


function singleDigitRandomNumber()
{
  return Math.floor(Math.random() * 10);
}

function twoDigitRandomNumber()
{
  return Math.floor(Math.random() * 90 + 10);
}

function quizResultVoiceExpression(isCorrect,msg)
{
      var expression = "";
      if(isCorrect)
      {
        expression = '<prosody rate="70%" pitch="+40%" volume="x-loud">'+msg+'</prosody>';
      }
      else
      {
          expression =
            '<prosody rate="70%" pitch="+40%" volume="x-loud">' +
            msg +
            "</prosody>";
      }
      return expression;
}


function getHelpMessage(handlerInput) {
  var speakOutput = "";
  var sayingsData = availableSayings(handlerInput);
  speakOutput += sayingsData[0];
  return speakOutput;
}

function stripTags(message) {
  var regex = /(<([^>]+)>)/gi;
  return message.replace(regex, "");
}

async function toMainMenu(handlerInput)
{
  var speakOutput = "";
   const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;
  const dataResponse = await getUserInfo(accessToken);
  sessionAttributes.dataResponse = dataResponse;
   console.log(sessionAttributes.dataResponse);
     //var notificationCount = 3;
    var sayingsData = availableSayings(handlerInput);
    speakOutput = sayingsData[0];
    cardContent = sayingsData[1];
    sessionAttributes.help_message = speakOutput;
    sessionAttributes.repeat_message = speakOutput;
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .withSimpleCard(cardHeader, cardContent)
      .speak(speakOutput)
      .getResponse();
}


function availableSayings(handlerInput)
{
  var sayingsData = new Array();
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
   var notificationCount = isNotificationAvailable(handlerInput);
   if (sessionAttributes.IS_STUDENT) {
     if (notificationCount > 0) {
       speakOutput =
         "you can ask <break time='200ms'/> can i revise my class <break time='200ms'/> or <break time='200ms'/> read my notifications";
       cardContent =
         "you can ask \r\n can i revise my class \r\n  read my notifications";
     } else {
       speakOutput = "you can ask <break time='200ms'/> can i revise my class or play game";
       cardContent = "you can ask \r\n can i revise my class or play game";
     }
   } else {
     if (notificationCount > 0) {
       speakOutput =
         "you can ask <break time='200ms'/> What is my kid status? <break time='200ms'/> or <break time='200ms'/> read my notification";
       cardContent =
         "you can ask \r\n my kid status \r\n  read my notifications";
     } else {
       speakOutput = "you can ask <break time='200ms'/> What is my kid status";
       cardContent = "you can ask \r\n my kid status";
     }
   }

   sayingsData[0] = speakOutput;
   sayingsData[1] = cardContent;
   return sayingsData;

}

module.exports = {
  stripTags,
  getHelpMessage,
  getEmail,
  sendNotification,
  quizResultVoiceExpression,
  studentQuizChallenge,
  studentQuizChallengeValuate,
  toMainMenu,
  openMainMenu,
  singleDigitRandomNumber,
  twoDigitRandomNumber
};