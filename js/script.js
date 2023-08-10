// Globala konstanter och variabler
const wordList = ["BLOMMA","LASTBIL","SOPTUNNA","KÖKSBORD","RADIOAPPARAT","VINTER","SOMMAR","DATORMUS","LEJON","ELEFANTÖRA","JULTOMTE","SKOGSHYDDA","BILNUMMER","BLYERTSPENNA","SUDDGUMMI","KLÄDSKÅP","VEDSPIS","LJUSSTAKE","SKRIVBORD","ELDGAFFEL","STEKPANNA","KASTRULL","KAFFEBRYGGARE","TALLRIK","SOFFBORD","TRASMATTA","FLYGPLAN","FLYGPLATS","TANGENTBORD"]; // Lista (array) med ord som ska väljas slumpmässigt
var selectedWord; //ordet som väljs ur wordlist, som spelaren ska gissa
var letterBoxes; //rutorna där selected word ordets bokstäver ska fyllas i
var hangmanImg; //bild element för den hängda gubben
var hangmanImgNr; //aktuellt bildnummer för den hängda gubben
var msgElem //meddelande element
var startGameBtn; //knapp för att starta spel
var letterButtons; //knapp för spelets bokstäver
var startTime; //påbörja tidstagande för hur länge spelet pågår
// ------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
    startGameBtn = document.getElementById("startGameBtn");
    startGameBtn.onclick = startGame; // när startknappen klickas på aktiveras funktionen startgame
    letterButtons = document.getElementById("letterButtons").
    getElementsByTagName("button");
    for (let i = 0; i < letterButtons.length; i++)
    letterButtons[i].onclick = guessLetter; // när letterbuttons klickas på aktiveras funktionen guessletter
    hangmanImg = document.getElementById("hangman");
    msgElem = document.getElementById("message");
    startGameBtn.disabled = false;  // när init aktiverats är startknappen inte avaktiverad
    for (let i = 0; i < letterButtons.length; i++)
    letterButtons[i].disabled = true;
} // End init
window.onload = init; // Se till att init aktiveras då sidan är inladdad
// ------------------------------
//starta nytt spel
//hänggubbe bild reset till endast en kulle
//avaktivera start knapp
//aktivera alla bokstavs knappar
//börja räkna tiden på spel
function startGame() {
    randomWord();
    showLetterBoxes();
    hangmanImg.src = "img/h0.png"; // den första hänggubbe bilden
    hangmanImgNr = 0;
    startGameBtn.disabled = true; // avaktivera startknapp under spel
    for (let i = 0; i < letterButtons.length; i++)
    letterButtons[i].disabled = false;
    msgElem.innerHTML = "";
    let now = new Date();
    startTime = now.getTime(); // tidstagandet
}
//----------------------------
//slumpmässigt ord
//sortera wordlist efter en slumpmässig sortering
//plocka ur index ur listan och använd som global variabel
function randomWord() {
    let oldWord = selectedWord; // oldword är det senast använda ordet
    while (oldWord == selectedWord) {
        let wordIndex = Math.floor(wordList.length*Math.random()); // uträkning som väljer ut slumpmässigt ord ur wordlist
    selectedWord = wordList[wordIndex]; // nytt ord som blir aktuellt under spelets runda. sparas i global variabel "selectedword"
    }
}
//-----------------------------------------
//innehåller ett span som till en början fylls av ett blanktecken för att sedan fyllas av tecken från variabeln selectedword

function showLetterBoxes() {
    let newCode = ""; // ny kod för bokstävernas rutor
    for (let i = 0; i < selectedWord.length; i++) {
        newCode += "<span>&nbsp;</span>";
    }
    document.getElementById("letterBoxes").innerHTML = newCode;
    letterBoxes = document.getElementById("letterBoxes").
    getElementsByTagName("span"); // länkar letterboxes till html dokumentet
}

//-----------------------------------------------
//gissa bokstav - kan ej längre gissa denna bokstav, här används this funktionen
//innehåller en loop som går igenom tecken i orden i wordlist
//om rätt bokstav - ändra antal rätt gissade bokstäver
//om fel bokstav - byt hänggubbe bild, ändra nedräkning till antal fel
//om för många fel - endgame, spel slut

function guessLetter() {
    this.disabled = true; // inaktivera knapp så vi inte kan gissa samma bokstav igen
    let letter = this.value; // hämta knappens bokstav
    let letterFound = false; // om bokstaven finns i selected word ordet
    let correctLettersCount = 0; // räknar antalet korrekt gissade bokstäver
    for (let i = 0; i < selectedWord.length; i++) { // om bokstaven finns på fler ställen i ordet 
        if (letter == selectedWord.charAt(i)) {
            letterBoxes[i].innerHTML = letter; // visa vald bokstav i rutan
            letterFound = true; // den valda bokstaven finns i selected word ordet
        }
        if (letterBoxes[i].innerHTML != "&nbsp;")
        correctLettersCount++; // de korrekt antal gissade bokstäver räknas upp med 1
    }

    if (letterFound == false) { // fel gissad bokstav 
        hangmanImgNr++; // öka hängd gubbe bilden med 1. byt bild.
        hangmanImg.src = "img/h" + hangmanImgNr + ".png";
        if (hangmanImgNr == 6) { // om vi gissat fel 6 gånger.
            endGame(true); // aktivera endgame. avslut på spel.
        }
    }
    else if (correctLettersCount == selectedWord.length) {
        endGame(false); // om vi gissar rätt. inget endgame!
    }
}

//------------------------------------------
//Slut på spel händelse
//mät och berätta hur lång tid spelet tog
//låt starta spel knappen bli aktiv igen
//ge ett meddelande om du vann eller förlorade
function endGame(manHanged) { // vinst eller förlust. hängd eller inte hängd.
    let runTime = (new Date().getTime() - startTime) / 1000;
    if (manHanged) {
        msgElem.innerHTML = "Död. Rätt svar är " + selectedWord;
    } // Händelse vid förlust. Hängd gubbe + meddela om hur lång tid spelet tog.
    else {
        msgElem.innerHTML = "Grattis. Inte död."
    } // vid vinst. inte hängd gubbe. meddelande och uppmätt tid.
    msgElem.innerHTML += "<br>Det tog " + runTime.toFixed(1) + " sekunder."; // tidstagande meddelandet
    startGameBtn.disabled = false; // återaktivera startknapp
    for (let i = 0; i < letterButtons.length; i++)
    letterButtons[i].disabled = true; // avaktivera bokstavsknappar 
}