const https = require("https");
const config = require("../config");
const Constants = require("../Constants");
const { getUserInfo } = require("../Utils/HttpUtils");
const GetKidInfoIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetKidInfoIntent"
    );
  },
  async handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;
      //const response = await httpGet(); 
    const response = await getUserInfo(accessToken); 
    console.log(response);
    let speechText = "";
    let cardText = "";
    if (response.status) {

      const studentdata = response.student_data[0];
      var studentName = studentdata.first_name +" "+ studentdata.last_name ;
      
      sessionAttributes.student_id = studentdata.student_id;
      sessionAttributes.sub_concept_id = studentdata.concept_practiced[0].id;
      sessionAttributes.studentName = studentName;
      speechText =
        studentName +
        " completed " +
        studentdata.concept_practiced[0].name +
        ". Scored " +
        studentdata.concept_practiced[0].score +
        " Out of " +
        studentdata.concept_practiced[0].total +
        '<break time="0.5s" />' +
        Constants.do_you_want_to_challenge +
        studentName +
        Constants.with_a_question_send_hifi;
      
        
      
        cardText =
          studentdata.first_name +
          " " +
          studentdata.last_name +
          " completed " +
          studentdata.concept_practiced[0].name +
          ". Scored " +
          studentdata.concept_practiced[0].score +
          " Out of " +
          studentdata.concept_practiced[0].total +
          "\r\n" +
          Constants.do_you_want_to_challenge +
          studentName +
          Constants.with_a_question_send_hifi;


    } else {
      speechText = Constants.email_not_registered;
    }
    sessionAttributes.help_message =
      "you can say <break time='200ms'/> challenge a quiz <break time='100ms'/> or <break time='100ms'/> send a HI-FIVE";
    sessionAttributes.repeat_message = speechText; 
    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .reprompt(Constants.what_would_you_like)
      .withSimpleCard("Recent Activity", cardText)
      .getResponse();
  }
};


module.exports = GetKidInfoIntentHandler;