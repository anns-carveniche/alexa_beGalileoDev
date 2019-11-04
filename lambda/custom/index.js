
// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const YesIntentHandler = require("./handlers/YesIntentHandler");
const NoIntentHandler = require("./handlers/NoIntentHandler");
const QuizStartIntentHandler = require("./handlers/QuizStartIntentHandler");
const QuizAnswerIntentHandler = require("./handlers/QuizAnswerIntentHandler");
const GetKidInfoIntentHandler = require("./handlers/GetKidInfoIntentHandler");
const ReviseClassIntentHandler = require("./handlers/ReviseClassIntentHandler");
const ChooseOptionIntentHandler = require("./handlers/ChooseOptionIntentHandler");
const ReadNotificationIntentHandler = require("./handlers/ReadNotificationIntentHandler");
const Constants = require("./Constants");
const states = Constants.states;
const { getEmail,sendNotification } = require("./Utils/UtilMethods");
const { getUserInfo } = require("./Utils/HttpUtils");



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
   async handle(handlerInput) {
        
        const email = await getEmail(handlerInput);
        const dataResponse = await getUserInfo(email);
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if(!dataResponse.status)
        {
            return handlerInput.responseBuilder
              .speak(Constants.email_not_registered)
              .getResponse();
        }
        if(dataResponse.student_data.length < 1)
        {
          var speechText = Constants.no_student_registered +email + ' account';
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
          studentName+"?";
        var cardText = "Hello! welcome to beGalileo Are you " + studentName;
        sessionAttributes.state = states.IS_STUDENT;
        sessionAttributes.studentName = studentName;
        sessionAttributes.dataResponse = dataResponse;
        sessionAttributes.parent_id = dataResponse.parent_data[0].id;
        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard("beGalileo",cardText)
          .withShouldEndSession(false)
          .reprompt(Constants.helpMessage)
          .getResponse();
    }
};

const ChooseClassIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "ChooseClassIntent"
    );
  },
  handle(handlerInput) {
      if (
        !handlerInput.requestEnvelope.request.intent.slots.lessonOption.value
      ) {
        return handlerInput.responseBuilder
          .addDelegateDirective()
          .getResponse();
      }
    
        var resolutionsPerAuth =
          handlerInput.requestEnvelope.request.intent.slots.lessonOption
            .resolutions.resolutionsPerAuthority;
        var lessonId  = resolutionsPerAuth[1].values[0].value.id;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.sub_concept_id = lessonId;

        var lessonName  = resolutionsPerAuth[1].values[0].value.name;
           console.log(resolutionsPerAuth[1].values[0].value.name); 
                var speechOutput =
                  "You Choose " +
                  lessonName +
                  ". Do you want to play a quiz or play a video or revise a topic ";
                return handlerInput.responseBuilder
                  .speak(speechOutput)
                  .withShouldEndSession(false)
                  .getResponse();
    
  }
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = Constants.helpMessage;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};



const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};


const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    QuizStartIntentHandler,
    QuizAnswerIntentHandler,
    GetKidInfoIntentHandler,
    HelpIntentHandler,
    YesIntentHandler,
    ChooseClassIntentHandler,
    ReviseClassIntentHandler,
    CancelAndStopIntentHandler,
    ChooseOptionIntentHandler,
    SessionEndedRequestHandler,
    NoIntentHandler,
    ReadNotificationIntentHandler,
    IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
