const { states,conclude_message } = require("../Constants");
const { getActions } = require("../Utils/HttpUtils");
const { createNotification } = require("../Utils/HttpUtils");

async function playVideo(handlerInput) {
   const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
   var studentId = sessionAttributes.student_id;
   var subConceptId = sessionAttributes.sub_concept_id;
   var type = "video";
    const dataResponse = await getActions(studentId, subConceptId, type);
    
    if(!dataResponse.status)
    {
        return handlerInput.responseBuilder.speak("No Video Found").getResponse();
    }

    var videoUrl = dataResponse.video;
        
    handlerInput.responseBuilder.addVideoAppLaunchDirective(videoUrl, "", "");
    return handlerInput.responseBuilder.speak("Playing video").getResponse();
};


async function challengeQuiz(handlerInput) {
   const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
   var studentId = sessionAttributes.student_id;
   var subConceptId = sessionAttributes.sub_concept_id;
   var studentName = sessionAttributes.studentName;
   var type = "quiz";
    const dataResponse = await getActions(studentId, subConceptId, type);

    if(!dataResponse.status)
    {
        return handlerInput.responseBuilder.speak("No Quiz Found").getResponse();
    }

    var quizQuestion = dataResponse.question_data[randomNumber()].question_text;
    
    var speechText =
      "OK <break time='100ms'/>" +
      studentName +
      " is quiz challenged with the following question <break time='100ms'/> " +
      quizQuestion +
      " we will notify you once " +
      studentName +
      " finish the quiz challenge ";
      speechText += conclude_message;
      sessionAttributes.state = states.CONCLUDE;
     var cardHeader = "Quiz Challenge"
     var cardContent = quizQuestion
     createNotification(studentId, 2, subConceptId);
     sessionAttributes.repeat_message = speechText;
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .speak(speechText)
      .withSimpleCard(cardHeader,cardContent)
      .getResponse();
};


 function sendingHIFI(handlerInput) {
   var speakOutput = "";
   const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
   var studentId = sessionAttributes.student_id;
   var subConceptId = sessionAttributes.sub_concept_id;
   var studentName = sessionAttributes.studentName;
    //  var message = {
    //    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //    to:"d2fDf2Fbq3U:APA91bEmZTG-JvQ3EpbjUsilKoPnOhod4TLqyNlkwLlWyEUxaQJyDACZR-68rO5YHIkeIL7EZ-iuCVxlJ6rZM5bqnvoE3Jon3uspXewiw6wlAS2D4hxxZprSBsMD-34iBDCkUVLpTCJV",

    //    notification: {
    //      title: "HI-FIVE",
    //      body: "you got a HI-Five from your parent"
    //    }
    //  };
     speakOutput =
       " Sending HI-FI to " + studentName + ' <break time="1s"/> Done';
       speakOutput += " "+conclude_message;
    createNotification(studentId, 1, subConceptId);
    sessionAttributes.repeat_message = speakOutput;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false)
      .getResponse();
};

function randomNumber() {
  var min = 0;
  var max = 4;
  return Math.floor(Math.random() * (max - min)) + min;
}

async function highlights(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var studentId = sessionAttributes.student_id;
    var subConceptId = sessionAttributes.sub_concept_id;
    var type = "highlights";
    const dataResponse = await getActions(studentId, subConceptId, type);
    
    if(!dataResponse.status)
    {
        return handlerInput.responseBuilder.speak("No Video Found").getResponse();
    }
    var cardHeader = "Reading Summary ";
    var cardText = dataResponse.concept_name+'\r\n'; 
    var highlights = dataResponse.highlights;
    var speakOutput = 'Reading Summary';   
    for (var i = 0; i < highlights.length; i++) {
        speakOutput += '<break time="0.5s" />'+highlights[i]
        cardText += i+1+' '+highlights[i]+'\r\n';
    }
    speakOutput += '<break time="0.5s" /> Thats it. Do you want a play a quiz or play a video ';
    sessionAttributes.repeat_message = speakOutput;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false)
      .withSimpleCard(cardHeader, cardText)
      .getResponse();
};


module.exports = { playVideo, highlights,challengeQuiz,sendingHIFI };
