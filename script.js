
//Function call to make API call and begin game.
startGame();

/*----variables----*/
const question = document.querySelector(".question_container")
const multChoiceA = document.querySelector("#choiceA")
const multChoiceB = document.querySelector("#choiceB")
const multChoiceC = document.querySelector("#choiceC")
const multChoiceD = document.querySelector("#choiceD")

let response = []
let questions = []
let correctAnswers = []
let multipleChoiceAnswers = []

let numAnswered = 0

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
    //For each method calls shuffle function for each element (inner array) of the multiple choice answers array.
    multipleChoiceAnswers.forEach(element => {
        shuffleInnerArray(element)
    });

    console.log(`Shuffled multiple choice answers: ${multipleChoiceAnswers}`)

    question.innerText = questions[0]
    multChoiceA.innerText = multipleChoiceAnswers[0][0]
    multChoiceB.innerText = multipleChoiceAnswers[0][1]
    multChoiceC.innerText = multipleChoiceAnswers[0][2]
    multChoiceD.innerText = multipleChoiceAnswers[0][3]
}

/*----event listeners----*/
//Event listener that tells us which answer user clicked.
document.querySelector(".answers_container").onclick = function(e) {
    playerAnswer = e.target.id
    console.log(playerAnswer)
    console.log(document.querySelector(`#${e.target.id}`).innerText)

    if (numAnswered < 10) {
        if (document.querySelector(`#${e.target.id}`).innerText === correctAnswers[numAnswered]) {
            console.log("Correct")
        } else {
            console.log("Incorrect")
        }
        numAnswered++
    } else {
        //Play again? button.  Start over or stop game.
    }
}