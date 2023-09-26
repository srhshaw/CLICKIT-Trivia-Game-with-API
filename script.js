
//Function call to make API call and begin game.
startGame();

/*----variables----*/
const question = document.querySelector(".question_container")
const multChoiceA = document.querySelector("#choiceA")
const multChoiceB = document.querySelector("#choiceB")
const multChoiceC = document.querySelector("#choiceC")
const multChoiceD = document.querySelector("#choiceD")
const answerFeedback = document.querySelector("#rightOrWrongMsg")
const questionCount = document.querySelector("#progress")
const fadeElements = document.querySelector("#qanda")

let response = []
let questions = []
let correctAnswers = []
let multipleChoiceAnswers = []

let numAnswered = 0
let feedbackMsg = ""
//document.getElementById("playAgain").style.visibility = "hidden"

/*----API Call----*/

async function startGame() {
    let response = await axios.get(`https://opentdb.com/api.php?amount=10&type=multiple`);
    let results = response.data.results
    console.log(results)

    //Loop over API call results to push the questions, correct answers, & wrong answers into the empty arrays created to house them.
    for (let i=0; i<results.length; i++) {
        questions.push(results[i].question)
        correctAnswers.push(results[i].correct_answer)
        multipleChoiceAnswers.push(results[i].incorrect_answers)
    
        console.log(`Question ${i+1}: ${questions[i]}`)
        console.log(`Correct answer ${i+1}: ${correctAnswers[i]}`)
        console.log(`Wrong answer ${i+1}: ${multipleChoiceAnswers[i]}`)
    }

    //Loop over wrong answer array and push the correct answer at the corresponding index into the wrong answers array so that all of the multiple choice answers are in one 2D array.    
    for (let i=0; i<multipleChoiceAnswers.length; i++) {
        multipleChoiceAnswers[i].push(correctAnswers[i])
    }

    console.log(`All answers: ${multipleChoiceAnswers}`)

    //Function for Fisher-Yates Sorting Algorithm to shuffle contents of multiple choice answer arrays.
    function shuffleInnerArray(array) {
        for (let i=array.length-1; i>0; i--) {
            //Generate random number to use as a random index from 0 to i inclusive
            const j = Math.floor(Math.random() * (i+1));
            //Swap array[i] with random element
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    //forEach method calls shuffle function for each element (inner array) of the multiple choice answers array.
    multipleChoiceAnswers.forEach(element => {
        shuffleInnerArray(element)
    });

    console.log(`Shuffled multiple choice answers: ${multipleChoiceAnswers}`)

    fadeElements.style.opacity = "1";
    document.getElementById("playAgain").style.visibility = "hidden";
    //document.querySelector(".modal").style.z-index = 1;

    question.innerText = questions[0]
    multChoiceA.innerText = multipleChoiceAnswers[0][0]
    multChoiceB.innerText = multipleChoiceAnswers[0][1]
    multChoiceC.innerText = multipleChoiceAnswers[0][2]
    multChoiceD.innerText = multipleChoiceAnswers[0][3]

    feedbackMsg = ""
    answerFeedback.innerText = feedbackMsg;

    numAnswered = 0
    questionCount.innerText = `${numAnswered+1} of 10`

    //document.getElementById("playAgain").style.visibility = "hidden";
}

/*----event listeners----*/
//Event listener that tells us which answer user clicked.
    document.querySelector(".answers_container").onclick = function(e) {
        playerAnswer = e.target.id
        console.log(playerAnswer)
        console.log(document.querySelector(`#${e.target.id}`).innerText)

        document.querySelector(".modal").style.visibility = "visible"
        
        if (document.querySelector(`#${e.target.id}`).innerText === correctAnswers[numAnswered]) {
            feedbackMsg = "Correct!"
            console.log("Correct")
        } else {
            feedbackMsg = `Incorrect.  The correct answer is ${correctAnswers[numAnswered]}`
            console.log(`Incorrect.  The correct answer is ${correctAnswers[numAnswered]}.`)
        }
    numAnswered++
    console.log(numAnswered)
    answerFeedback.innerText = feedbackMsg;



    if (numAnswered < 10) {
        //Load next question button
        //document.getElementsByTagName("body").style.opacity = ".2";
        fadeElements.style.opacity = ".2";

        document.querySelector(".modal").style.display = "block";

        //document.getElementById("nextQuestion").style.visibility = "visible";


        document.querySelector("#nextQuestion").onclick = loadQuestion;

        function loadQuestion() {
        feedbackMsg=""
        answerFeedback.innerText = feedbackMsg;
        fadeElements.style.opacity = "1";
        question.innerText = questions[numAnswered]
        multChoiceA.innerText = multipleChoiceAnswers[numAnswered][0]
        multChoiceB.innerText = multipleChoiceAnswers[numAnswered][1]
        multChoiceC.innerText = multipleChoiceAnswers[numAnswered][2]
        multChoiceD.innerText = multipleChoiceAnswers[numAnswered][3]
        questionCount.innerText = `${numAnswered+1} of 10`
        document.querySelector(".modal").style.visibility = "hidden";
        }

    } else {
        //Load Play again? button. 
        questionCount.innerText = `${numAnswered} of 10`
        fadeElements.style.opacity = ".2"; 
        document.getElementById("nextQuestion").style.display = "none";
        document.getElementById("playAgain").style.display = "block"
        document.getElementById("playAgain").style.visibility = "visible"
        document.querySelector("#playAgain").onclick = startGame;
    }
}
