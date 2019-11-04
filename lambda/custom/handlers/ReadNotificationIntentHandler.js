const { states } = require("../Constants");
const {
  ReadStudentNotification,
  ReadParentNotification
} = require("../Utils/NotificationUtilMethods");

const ReadNotificationIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "ReadNotificationIntent"
    );
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if (sessionAttributes.IS_STUDENT) {
        return ReadStudentNotification(handlerInput);
    } else {
        return ReadParentNotification(handlerInput);
    }
  }
};

module.exports = ReadNotificationIntentHandler;