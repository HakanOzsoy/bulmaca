var height = 5; //number of guesses
var width = 5; //length of the word

var row = 0; //current guess (attempt #)
var col = 0; //current letter for that attempt

var timer;
var ele;
var sec = 1;
var min = 0;

var current = new Date();

var gameOver = false;

var prevID = 0;
var prevR = -1;
var prevC = -1;
var alr = 0;
var clean = 0;
var third = 0;

var answers = ["AAAAA", "AAAAA", "AAAAA", "AAAAA", "AAAAA"];

var dikQ = ["d1", "d2", "d3", "d4", "d5"];
var yatQ = ["y1", "y2", "y3", "y4", "y5"];
var bTiles = [];

localStorage.clear();

window.onload = function () {
    intialize();
    ele = document.getElementById("timer");

    if (current.toLocaleDateString() == localStorage.getItem("fDate")) {
        ele.innerHTML = localStorage.getItem("fTime");
        finished();
    }
}

function intialize() {

    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            // <span id="0-0" class="tile">P</span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.row = r;
            tile.column = c;
            tile.classList.add("tile");
            tile.innerText = "";
            tile.classList.add("not-sel");
            tile.addEventListener("click", changeRow);
            document.getElementById("board").appendChild(tile);
        }
    }

    for (let a = 0; a < bTiles.length; a++) {
        let black = document.getElementById(bTiles[a]);
        black.classList.remove("tile");
        black.classList.add("blacktile");
    }

    document.getElementById("question").innerText = "?";

    // Create the key board
    let keyboard = [
        ["E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
        ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "⌫"]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else {
                keyTile.id = "Key" + key; // "Key" + "A";
            }

            keyTile.addEventListener("click", processKey);
            keyTile.classList.add("not-sel");

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }


    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        if (e.code == "Backspace") {
            processInput(e);
        }     
    })

    document.addEventListener("keypress", (e) => {
        processInput(e);
    })
}

(function () {
    timer = setInterval(() => { timeCheck(); }, 1000)
})()

function timeCheck() {
    if (sec < 60) {
        if (sec < 10) {
            if (min < 10) {
                ele.innerHTML = "0" + min + ":0" + sec;
                sec++;
            }
            else {
                ele.innerHTML = min + ":0" + sec;
                sec++;
            }
        }
        else {
            if (min < 10) {
                ele.innerHTML = "0" + min + ":" + sec;
                sec++;
            }
            else {
                ele.innerHTML = min + ":" + sec;
                sec++;
            }
        }
    }
    else if (sec == 60) {
        sec = 1;
        min++;
        if (min < 10) {
            ele.innerHTML = "0" + min + ":00";
        }
        else {
            ele.innerHTML = min + ":00";
        }
    }
}


function changeRow() {
    if (gameOver) return;

    if (this.classList.contains("blacktile")) return;

    if (prevID == this.id && third == 0 && prevC == col) {
        alr = 1;
    }

    if (alr == 0) {
        if (prevID != 0) {
            let prevTile = document.getElementById(prevID);
            prevTile.classList.remove("selected2");
            prevTile.classList.add("empty");
        }

        if (prevR != this.row && prevR != -1) {
            for (i = 0; i < width; i++) {
                let oTile = document.getElementById(prevR + "-" + i.toString());
                if (!oTile.classList.contains("blacktile")) {
                    oTile.classList.remove("selected");
                    oTile.classList.remove("selected2");
                    oTile.classList.add("empty");                    
                }
                
            }
        }

        if (clean == 1) {
            for (i = 0; i < height; i++) {
                let oTile = document.getElementById(i.toString() + "-" + prevC);
                if (!oTile.classList.contains("blacktile")) {
                    oTile.classList.remove("selected2");
                    oTile.classList.remove("selected");
                    oTile.classList.add("empty");
                }            
            }
            clean = 0;
        }

        this.classList.remove("empty");
        row = this.row;
        col = this.column;

        for (i = 0; i < width; i++) {
            let oTile = document.getElementById(row + "-" + i.toString());
            if (!oTile.classList.contains("blacktile")) {
                oTile.classList.remove("selected2");
                oTile.classList.add("selected");
            }        
        }

        document.getElementById("question").innerText = yatQ[row];

        this.classList.remove("selected");
        this.classList.add("selected2");
        prevID = this.id;
        prevR = row;
        prevC = col;
        third = 0;
    }

    if (alr == 1 && clean == 0) {
        if (prevID != 0) {
            let prevTile = document.getElementById(prevID);
            prevTile.classList.remove("selected2");
            prevTile.classList.add("empty");
        }

        for (i = 0; i < width; i++) {
            let oTile = document.getElementById(this.row + "-" + i.toString());
            if (!oTile.classList.contains("blacktile")) {
                oTile.classList.remove("selected");
                oTile.classList.add("empty");
            }       
        }

        this.classList.remove("empty");

        for (i = 0; i < height; i++) {
            let oTile = document.getElementById(i.toString() + "-" + col);
            if (!oTile.classList.contains("blacktile")) {
                oTile.classList.add("selected");
            }        
        }

        document.getElementById("question").innerText = dikQ[col];

        this.classList.remove("selected");
        this.classList.add("selected2");
        prevC = col;
        alr = 0;
        clean = 1;
    }

    if (alr == 1 && clean == 1) {
        alr = 0;
        third = 1;
        this.dispatchEvent(new Event("click"));
    }
}

function processKey() {
    e = { "code": this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return;

    let kcode = "";
    if (typeof e.keyCode == "undefined") {
        kcode = e.code;
    }
    else {
        kcode = "Key" + String.fromCharCode(e.keyCode).toUpperCase();
    }
    
    if (e.keyCode == "304" || e.keyCode == "105") {
        kcode = "Keyİ";
    }

    if ("KeyA" <= kcode && kcode <= "KeyZ" || kcode == "KeyĞ" || kcode == "KeyÜ" || kcode == "KeyŞ" || kcode == "Keyİ" || kcode == "KeyÖ" || kcode == "KeyÇ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = kcode[3];
            if (currTile.column < width - 1 && clean == 0) {
                col += 1;
                let currTile2 = document.getElementById(row.toString() + '-' + col.toString());
                if (!currTile2.classList.contains("blacktile")) {
                    currTile2.classList.remove("selected");
                    currTile2.classList.add("selected2");
                    currTile.classList.remove("selected2");
                    currTile.classList.add("selected");
                }
                else {
                    col -= 1;
                }
            }
            else if (currTile.row < height - 1 && clean == 1) {
                row += 1;
                let currTile2 = document.getElementById(row.toString() + '-' + col.toString());
                if (!currTile2.classList.contains("blacktile")) {
                    currTile2.classList.remove("selected");
                    currTile2.classList.add("selected2");
                    currTile.classList.remove("selected2");
                    currTile.classList.add("selected");
                }
                else {
                    row -= 1;
                }
            }
            

            //if (currTile.innerText == "") {
            //    currTile.innerText = e.code[3];
            //    col += 1;
            //}
        }
    }
    else if (e.code == "Backspace") {
        let currTile = document.getElementById(row.toString() + '-' + col.toString());      

        if (currTile.innerText != "") {
            currTile.innerText = "";
        }
        else if (currTile.innerText == "") {
            if (0 < col && col <= width && clean == 0) {
                col -= 1;
                let currTile2 = document.getElementById(row.toString() + '-' + col.toString());
                if (!currTile2.classList.contains("blacktile")) {
                    currTile2.innerText = "";
                    currTile2.classList.remove("selected");
                    currTile2.classList.add("selected2");
                    currTile.classList.remove("selected2");
                    currTile.classList.add("selected");
                }
                else {
                    col += 1;
                }
            }
            else if (0 < row && row <= height && clean == 1) {
                row -= 1;
                let currTile2 = document.getElementById(row.toString() + '-' + col.toString());
                if (!currTile2.classList.contains("blacktile")) {
                    currTile2.innerText = "";
                    currTile2.classList.remove("selected");
                    currTile2.classList.add("selected2");
                    currTile.classList.remove("selected2");
                    currTile.classList.add("selected");
                }
                else {
                    row += 1;
                }
            }       
        }           
    }

    //else if (e.code == "Enter") {
    //    update();
    //}

    //if (!gameOver && row == height) {
    //    gameOver = true;
    //    document.getElementById("answer").innerText = word;
    //}

    check();
}

function check() {
    const guessList = [];
    for (let r = 0; r < height; r++) {
        let guess = "";
        for (let c = 0; c < width; c++) {
            let cTile = document.getElementById(r.toString() + "-" + c.toString());
            guess += cTile.innerText;
        }
        guessList.push(guess);
    }

    if (guessList[0] == answers[0] && guessList[1] == answers[1] && guessList[2] == answers[2] && guessList[3] == answers[3] && guessList[4] == answers[4]) {
        finished();
    }
}

function finished() {
    gameOver = true;
    clearInterval(timer);
    document.getElementById("question").innerText = "Bulmaca Tamamlandı!";

    var s2 = document.getElementsByClassName("selected2");
    if (s2.length != 0) {
        s2[0].classList.add("selected");
        s2[0].classList.remove("selected2");
    }

    var emps = document.getElementsByClassName("tile");
    for (let i = 0; i < emps.length; i++) {
        emps[i].classList.add("selected");
        emps[i].classList.remove("empty");
    }

    localStorage.setItem("fTime", ele.innerHTML);
    localStorage.setItem("fDate", current.toLocaleDateString());
}
