var prolog;


function showHome() {
    $("#aboutgus").removeClass();
    $("#gus-welcome").removeClass();
    $("#gus-chat").removeClass();
    $("#gus-welcome").addClass("container d-block");
    $("#aboutgus").addClass("d-none");
    $("#gus-chat").addClass("d-none");


    $("#linkhome").removeClass("active");
    $("#linkchat").removeClass("active");
    $("#linkabout").removeClass("active");
    $("#linkhome").addClass("active");
}

function showAbout() {
    $("#aboutgus").removeClass();
    $("#gus-welcome").removeClass();
    $("#gus-chat").removeClass();
    $("#aboutgus").addClass("container d-block");
    $("#gus-welcome").addClass("d-none");
    $("#gus-chat").addClass("d-none");

    $("#linkhome").removeClass("active");
    $("#linkchat").removeClass("active");
    $("#linkabout").removeClass("active");
    $("#linkabout").addClass("active");
}

function showChat() {
    $("#aboutgus").removeClass();
    $("#gus-welcome").removeClass();
    $("#gus-chat").removeClass();
    $("#aboutgus").addClass("d-none");
    $("#gus-welcome").addClass("d-none");
    $("#gus-chat").addClass("container d-block");

    $("#linkhome").removeClass("active");
    $("#linkchat").removeClass("active");
    $("#linkabout").removeClass("active");
    $("#linkchat").addClass("active");
    startGus();
}



function startGus() {

    /* Only one instance of prolog */
    if (!prolog) {
        prolog = new PrologSession();
    }

    var inputgus = document.getElementById("input-gus");
    inputgus.focus();
}


async function getData(value) {
    let result = await questionToGus(value, prolog.session);
    return result;
}

function sendText(value) {

    var output = document.getElementById("gus-conversation");
    output.innerHTML += "<div class='user-text'>" + value + "</div>";

    questionToGus(value, prolog.session);
}

/* JS comes here */
function runSpeechRecognition() {
    // get output div reference
    var output = document.getElementById("gus-conversation");
    // get action element reference
    var action = document.getElementById("action");
    // new speech recognition object
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        action.innerHTML = "Je vous écoute, vous pouvez parler...";
    };

    recognition.onspeechend = function() {
        action.innerHTML = "J'arrête de vous écoutez, j'espère que vous avez fini de parler...";
        recognition.stop();
    }

    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        //output.innerHTML += "<div class='user-text'>" + transcript + "</div>";
        sendText(transcript);
        //var answer = 'Pour l\'instant je sais pas encore vous répondre!';
        //output.innerHTML += "<div class='gus-answer'>" + answer + "</div>";
    };

    // start recognition

    var startspeechbtn = document.getElementById("startspeech");
    var stopspeechbtn = document.getElementById("stopspeech");
    stopspeechbtn.classList.remove("d-none");
    startspeechbtn.classList.add("d-none");
    recognition.start();
}

function stopSpeechRecognition() {
    var startspeechbtn = document.getElementById("startspeech");
    var stopspeechbtn = document.getElementById("stopspeech");
    startspeechbtn.classList.remove("d-none");
    stopspeechbtn.classList.add("d-none");
    recognition.stop();
}




$(document).ready(function() {
    var inputgus = document.getElementById("input-gus");

    document.getElementById("input-gus").addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.key === "Enter") {
            event.preventDefault();
            sendText(inputgus.value);
            inputgus.value = '';
        }
    });
})