class PrologSession {
    session = pl.create(40000);

    constructor() {
        this.session.consult(CHATBOT, {
            success: function() {
                /* Program loaded correctly */
                console.log(
                    "programme chargé correctement"
                );
            },
            error: function(err) {
                /* Error parsing program */
                console.log(err);
            },
        });
    }
}

function toArray(str) {
    const array = [];
    for (let i = 0; i < str.length; i++) {
        array.push(str.charCodeAt(i));
    }
    array.push(10); // New line
    return array;
}

function fromArrayCodeToString(arr) {
    var res = [];
    for (let i = 0; i < arr.length; i++) {
        res.push(String.fromCharCode(arr[i]));
    }
    return res.join("");
}

function jmjCodeToString(parr) {
    if (parr.args.length == 0) {
        return [];
    } else {
        const arr = jmjCodeToString(parr.args[1]);
        arr.unshift(parr.args[0].value);
        return arr;
    }
}

function answerToString(parsing) {
    let manswer = pl.format_answer(parsing);
    let output = manswer.split("Message = ")[1];
    reponse = output.substring(1, output.length - 3).replace(/,/g, " ");
    return reponse;
}

function questionToGus(maquestion, session) {

    var reponse = "";
    maquestion = maquestion.replace(/-/g, " ").replace(/'/g, " ").replace(/ë|Ë|é|è|ê|É|Ê|È/g, "e").replace(/à|À|â|Â/g, "a").replace(/î|Î/g, "i").replace(/ô|Ô/g, "o").replace(/€/g, "eur").replace(/œ/g, "oe");
    var question = toArray(maquestion.toLowerCase());
    session.query(`
		lire_question([${question}], L_Mots),
		produire_reponse(L_Mots,L_reponse),
		transformer_reponse_en_string(L_reponse,Message).
	`);

    session.answer({
        success: function(answer) {
            let gus_answer = answerToString(answer);
            var output = document.getElementById("gus-conversation");
            output.innerHTML += "<div class='gus-answer'>" + gus_answer + "</div>";

            $("#gus-avatar").addClass("gus-avatar-move");
            if (gus_answer.toLowerCase() === "je ne comprends pas votre requete") {
                $("#gus-avatar").addClass("red");
            }
            setTimeout(function() {
                $("#gus-avatar").removeClass("gus-avatar-move");
                $("#gus-avatar").removeClass("red");
            }, 1000);
        },
        fail: function() {
            /* No more answers */
        },
        error: function(err) {
            console.error(pl.format_answer(err));
            /* Uncaught exception */
            console.log(err);
        },
        limit: function() {
            /* Limit exceeded */
        },
    });

    return reponse;
}