const constants = {
  states: {
    START: `_START`,
    QUIZ: `_QUIZ`,
    VIDEO: "_VIDEO",
    CHALLENGE_QUIZ: "_CHALLENGE_QUIZ",
    NOTIFICATION: "NOTIFICATION",
    IS_STUDENT: "IS_STUDENT",
    QUIZ_NONE: "QUIZ_NONE",
    SHARE_SCORE: "SHARE_SCORE",
    CONCLUDE: "CONCLUDE",
    PLAY_GAME: "PLAY_GAME",
    GAME_QUIZ_CRICKET: "GAME_QUIZ_CRICKET"
  },

  sub_states: {
    GAME_START: "GAME_START",
    GAME_RESUME: "GAME_RESUME",
    GAME_OVER: "GAME_OVER"
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
  yes_or_no_help_message: "You can yes or no",
  conclude_message: "<break time='2s'/> Do you want to continue?",

  exit_message:
    "Thank you for using beGalileo <break time='200ms'/> See you soon",

  parent_help_message:
    "you can say <break time='200ms'/> my kid status <break time='200ms'/> or <break time='100ms'/> read my notifications",

  student_help_message:
    "you can say <break time='200ms'/> revise my class <break time='200ms'/> or <break time='100ms'/> read my notifications",

  option_help_message:
    "you can say <break time='100ms'/> Option A or <break time='100ms'/> Option B ",

  topic_name_help_message:
    "You can say any of the topic name <break time='100ms'/>  or <break time='100ms'/>  You can say first one, second one or third one",

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
