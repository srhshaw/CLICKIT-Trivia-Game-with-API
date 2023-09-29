//VARIABLES.
const question = document.querySelector(".question_container")
const answers = document.querySelector(".answers_container")
const multChoiceA = document.querySelector("#choiceA")
const multChoiceB = document.querySelector("#choiceB")
const multChoiceC = document.querySelector("#choiceC")
const multChoiceD = document.querySelector("#choiceD")
const answerFeedback = document.querySelector("#rightOrWrongMsg")
const questionCount = document.querySelector("#progress")
const fadeElements = document.querySelector("#qanda")
const finalScore = document.querySelector("#score")

let response = []
let questions = []
let correctAnswers = []
let multipleChoiceAnswers = [] 

let numAnswered = 0
let numCorrectAnswers = 0
let feedbackMsg = ""
let token = ""

//FUNCTION CALL TO BEGIN GAME.
startGame();

//FUNCTION TO DECODE THE HTML CODES RETURNED IN STRING VALUE RESULTS FROM API.
function decodeIt(str) {
    let doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
}

//ASYNC FUNCTION FOR API CALL.
async function startGame() {
    if (token == "") {
        token = await axios.get(`https://opentdb.com/api_token.php?command=request`)
    }
    let response = await axios.get(`https://opentdb.com/api.php?amount=10&type=multiple&token=${token.data.token}`)
    let results = response.data.results
    console.log(results)

    //LOOP OVER API CALL RESULTS TO PUSH THE QUESTIONS, CORRECT ANSWERS, & WRONG ANSWERS INTO THE EMPTY ARRAYS CREATED TO HOUSE THEM. 
    for (let i=0; i<results.length; i++) {
        questions.push(results[i].question)
        correctAnswers.push(results[i].correct_answer)
        multipleChoiceAnswers.push(results[i].incorrect_answers)
    
        console.log(`Question ${i+1}: ${questions[i]}`)
    }

    //LOOP OVER WRONG ANSWER ARRAY AND PUSH THE CORRECT ANSWER AT THE CORRESPONDING INDEX INTO THE WRONG ANSWERS ARRAY SO THAT ALL OF THE MULTIPLE CHOICE ANSWERS ARE IN ONE 2D ARRAY.    
    for (let i=0; i<multipleChoiceAnswers.length; i++) {
        multipleChoiceAnswers[i].push(correctAnswers[i])
    }

    console.log(`All answers: ${multipleChoiceAnswers}`)

    //FUNCTION USING FISHER-YATES SORTING ALGORITHM TO SHUFFLE CONTENTS OF MULTIPLE CHOICE ANSWER ARRRAYS.  
    function shuffleInnerArray(array) {
        for (let i=array.length-1; i>0; i--) {
            //GENERATE RANDOM NUMBER TO USE AS A RANDOM INDEX FROM 0 TO 1 INSLUSIVE. 
            const j = Math.floor(Math.random() * (i+1));
            //SWAY ARRAY[i] WITH RANDOM ELEMENT.  
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    //FOREACH METHOD CALLS SHUFFLE FUNCTION FOR EACH ELEMENT (INNER ARRAY) OF THE MULTIPLE CHOICE ANSWERS ARRAY.   
    multipleChoiceAnswers.forEach(element => {
        shuffleInnerArray(element)
    });

    console.log(`Shuffled multiple choice answers: ${multipleChoiceAnswers}`)

    //Q&A ELEMENTS MADE VISIBLE TO USER.
    fadeElements.style.opacity = "1";

    //MODAL NOT DISPLAYED.
    document.querySelector(".modal").style.display = "none";

    //POPULATE DECODED QUESTION & ANSWERS AT CORRESPONDING INDEXES.
    question.innerText = decodeIt(questions[0])
    multChoiceA.innerText = decodeIt(multipleChoiceAnswers[0][0])
    multChoiceB.innerText = decodeIt(multipleChoiceAnswers[0][1])
    multChoiceC.innerText = decodeIt(multipleChoiceAnswers[0][2])
    multChoiceD.innerText = decodeIt(multipleChoiceAnswers[0][3])   

    feedbackMsg = ""
    answerFeedback.innerText = feedbackMsg;

    finalScore.innerText = "" 

    numAnswered = 0
    questionCount.innerText = `${numAnswered+1} of 10`
}

//FUNCTION TO RESET VARIABLES AND BEGIN GAME AGAIN.
function playAgain(){
    questions = []
    correctAnswers = []
    multipleChoiceAnswers = []
    numAnswered = 0
    numCorrectAnswers = 0
    answers.classList.remove("disabled")

    startGame()
}

//EVENT LISTENER TO TELL US WHICH ANSWER USER CLICKED.   
    document.querySelector(".answers_container").onclick = function(e) {
        playerAnswer = e.target.id
        
        //SET MODAL VISIBILITY SO IT SHOWS.
        document.querySelector(".modal").style.visibility = "visible"
        
        //CONDITIONAL TO EVALUATE USER'S ANSWER CHOICE FOR CORRECT/INCORRECT
        if (document.querySelector(`#${e.target.id}`).innerText === decodeIt(correctAnswers[numAnswered])) {
            numCorrectAnswers++
            feedbackMsg = "Correct!"
        } else {
            feedbackMsg = `Incorrect.  The correct answer is ${decodeIt(correctAnswers[numAnswered])}`
        }

    //INCREMENT NUM ANSWERED.
    numAnswered++
    //POPULATE ANSWER FEEDBACK MESSAGE.
    answerFeedback.innerText = feedbackMsg;

    //CONDITIONAL TO DECIDE IF NEXT QUESTION OR END OF GAME/PLAY AGAIN.
    if (numAnswered < 10) {
        //FADE Q&A CONTAINERS INTO BACKGROUND.
        fadeElements.style.opacity = ".2";
        
        //DISPLAY MODAL.
        document.querySelector(".modal").style.display = "flex";

        //TURN OFF POINTER EVENTS (CLICK EVENT LISTENER) TO ANSWERS CONTAINER WHILE MODAL IS DISPLAYED.
        answers.classList.add("disabled")

        //TURN OFF PLAY AGAIN BUTTON DISPLAY.
        document.getElementById("playAgain").style.display = "none";

        //DISPLAY NEXT QUESTION BUTTON.
        document.getElementById("nextQuestion").style.display = "block"
        document.getElementById("nextQuestion").style.visibility = "visible"

        //LOAD 'NEXT QUESTION' BUTTON WITH EVENT LISTENER.
        document.querySelector("#nextQuestion").onclick = loadQuestion;
        
        //FUNCTION TO LOAD QUESTION AND HIDE MODAL TEXT & BUTTONS.
        function loadQuestion() {
        feedbackMsg=""
        answerFeedback.innerText = feedbackMsg;
        document.getElementById("nextQuestion").style.display = "none";

        fadeElements.style.opacity = "1";
    
        question.innerText = decodeIt(questions[numAnswered])
        multChoiceA.innerText = decodeIt(multipleChoiceAnswers[numAnswered][0])
        multChoiceB.innerText = decodeIt(multipleChoiceAnswers[numAnswered][1])
        multChoiceC.innerText = decodeIt(multipleChoiceAnswers[numAnswered][2])
        multChoiceD.innerText = decodeIt(multipleChoiceAnswers[numAnswered][3])
        questionCount.innerText = `${numAnswered+1} of 10`

        answers.classList.remove("disabled")
        document.querySelector(".modal").style.visibility = "hidden"; 
        }

    } else {
        //FADE Q&A CONTAINERS INTO BACKGROUND AND HIDE NEXT QUESTION BUTTON. 
        questionCount.innerText = `${numAnswered} of 10`
        fadeElements.style.opacity = ".2"; 
        document.getElementById("nextQuestion").style.display = "none";

        //CONDITIONAL TO DETERMINE RESULTS MESSAGE.
        if (numCorrectAnswers>5){
            finalScore.innerText = `Congrats! You got ${numCorrectAnswers} of 10 correct!`
        } else {
            finalScore.innerText = `You got ${numCorrectAnswers} of 10 correct.  Try again?`
        }

        //LOAD PLAY AGAIN BUTTON.
        document.getElementById("playAgain").style.display = "block"
        document.getElementById("playAgain").style.visibility = "visible"
        answers.classList.add("disabled")

        //CLICK EVENT LISTENER ON PLAY AGAIN BUTTON.
        document.querySelector("#playAgain").onclick = playAgain;
    }
}