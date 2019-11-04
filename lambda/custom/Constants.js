const constants = {
  states: {
    START: `_START`,
    QUIZ: `_QUIZ`,
    VIDEO: "_VIDEO",
    CHALLENGE_QUIZ: "_CHALLENGE_QUIZ",
    NOTIFICATION: "NOTIFICATION",
    IS_STUDENT: "IS_STUDENT",
    QUIZ_NONE : "QUIZ_NONE",
    SHARE_SCORE : "SHARE_SCORE" 
 
  },

  speechConsCorrect: [
    "Booya",
    "All righty",
    "Bam",
    "Bazinga",
    "Bingo",
    "Boom",
    "Bravo",
    "Cha Ching",
    "Cheers",
    "Dynomite",
    "Hip hip hooray",
    "Hurrah",
    "Hurray",
    "Huzzah",
    "Oh dear.  Just kidding.  Hurray",
    "Kaboom",
    "Kaching",
    "Oh snap",
    "Phew",
    "Righto",
    "Way to go",
    "Well done",
    "Whee",
    "Woo hoo",
    "Yay",
    "Wowza",
    "Yowsa"
  ],

  speechConsWrong: [
    "Argh",
    "Aw man",
    "Blarg",
    "Blast",
    "Boo",
    "Bummer",
    "Darn",
    "D'oh",
    "Dun dun dun",
    "Eek",
    "Honk",
    "Le sigh",
    "Mamma mia",
    "Oh boy",
    "Oh dear",
    "Oof",
    "Ouch",
    "Ruh roh",
    "Shucks",
    "Uh oh",
    "Wah wah",
    "Whoops a daisy",
    "Yikes"
  ],

  welcomeMessage: " welcome to beGalileo, How can i help you ",

  helpMessage: "can i revise my classes, my kid status",

  do_you_want_to_challenge: " Do you want to challenge ",

  with_a_question_send_hifi: " with a quiz question? or send a HI-FIVE",

  email_not_registered:
    "Your email is not registered in our system.please get be galileo subscription to continue",

  no_student_registered: "No student registered in ",

  no_student_found: "No Student found for this account",

  no_concept_found: "No Concept found for this account",

  what_would_you_like: "What would you like?"
};

module.exports = constants;
