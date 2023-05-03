//Deklarerer variabler
let board = [] //Lager en array
//Hvor stort brettet er  
let rows = 8
let columns = 8

//Hvor mange miner som skal være i brettet
let minesCount = 8

let minesLeftCount = minesCount 


//Array hvor minenes lokasjon er
let minesLocation = [] //'2-5', '3-1'

//For å telle hvor mange ruter som har blitt trykket
let tilesClicked = 0 

//Local storage
if(!localStorage.highScore){
    localStorage.highScore = 0
}



let showHighScore = document.getElementById('high-score')
showHighScore.innerHTML = localStorage.highScore

//Score
let score = 0
let showScore = document.getElementById('succession')

//Flagknappen er på når flagEnabled er true
let flagEnabled = false

//Spillet er over når gameOver er true
let gameOver = false

//Velge brett


let diffuculty = document.getElementById("choose-game");
diffuculty.addEventListener("change", function() {
  let chosenValue = diffuculty.value;
  
  if (chosenValue === "easy") {
    minesCount = 8
    newGame()
  } else if (chosenValue === "medium") {
    minesCount = 12
    newGame()
  } else if (chosenValue === "hard") {
    minesCount = 15
    newGame()
}
})

//Kjører funksjonen startGame når siden åpnes
window.onload = function() {
    startGame()
}


//Legger til en lytter på new-game
document.getElementById("new-game").addEventListener("click", newGame)

function newGame(){
    gameOver = false
    document.getElementById("win-lose").innerText = ''
    document.getElementById("mines-count").innerText = minesCount
    minesLeftCount = minesCount
    tilesClicked = 0
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            board[r][c].className = ''
            board[r][c].innerText = ''
            board[r][c].style.backgroundColor = ''
        }
    }
    minesLocation = []
    setMines()
} 

//Funksjon som plasserer minenes i brettet, gjøres ved en løkke
function setMines() {
    //Kan gjøres manuelt også
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    
    let minesLeft = minesCount
    //Gir minene sine koordinater, og som gjøres om til en string på formen '2-5'
    //Bruker while-løkke for det er lettere dersom det oppstår to koordinater som er like
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows)
        let c = Math.floor(Math.random() * columns)
        let id = r.toString() + '-' + c.toString()

        //Hvis ikke arrayet minesLocation allerede inneholder koordinatet til en mine, legger vi til minen i arrayet og lar minesLeft synke med 1
        if (!minesLocation.includes(id)) {
            minesLocation.push(id)
            minesLeft -= 1
        }
    }
    console.log(minesLocation)
}


//Funksjon som skal starte spillet
function startGame() {
    document.getElementById('mines-count').innerText = minesCount
    document.getElementById('flag-button').addEventListener('click', setFlag) //Lytter etter et click på knappen for å plassere flagg
    setMines()

    //Lager brettet
    for (let r = 0; r < rows; r++) {
        let row = []
        for (let c = 0; c < columns; c++) {
            //Lager en diver med en unik id på koordinatform
            //<div id="0-0"></div>
            let tile = document.createElement('div') //oppretter div
            tile.id = r.toString() + '-' + c.toString() //gir div en unik koordinat
            tile.addEventListener('click', clickTile) //lytter etter click på divene/rutene, skal kjøre funksjonen clickTile når de trykkes på
            //Endret
            tile.addEventListener('contextmenu', rightClick)
            //Endret
            document.getElementById('board').append(tile) //legger divene inn i diven med id='board'
            row.push(tile) //Legger alle 8 diver fra 0-7 inn i arrayet row
        }
        board.push(row) //Legger arrayet row inn i brettet. Gjøres for å få en 8x8
    }
    //Vise hvordan brettet er satt opp
    console.log(board)
    
} 


function rightClick(e) {
    e.preventDefault() // forhindrer at høyreklikk- menyen vises
    if(gameOver){
        return
    }
    let tile = e.target // henter elementet som ble klikket på
    if (!tile.classList.contains('tile-clicked')) { // sjekker om ruten ikke allerede er åpnet
      if (tile.innerText == '') { // sjekker om ruten ikke allerede har et flagg
        tile.innerHTML = '🚩'
        minesLeftCount -= 1 // trekker fra antall gjenværende miner
      } else {
        tile.innerHTML = '' // fjerner flagg
        minesLeftCount += 1 // legger tilbake miner
      }
      document.getElementById('mines-count').innerText = minesLeftCount // oppdaterer antall gjenværende miner
    }
  }


//Funksjon som kjøres når msan trykker på flaggknappen
function setFlag() {
    //Hvis flagget er på, så skrus flaggknappen av
    if (flagEnabled) {
        flagEnabled = false
        document.getElementById('flag-button').style.backgroundColor = "lightgray" //endrer fargen på knappen for å vise at knappen er skrudd av
        document.getElementById('flag-button').style.border = ''
    }
    //Hvis flagget er av, så skrus flaggknappen på
    else {
        flagEnabled = true;
        document.getElementById('flag-button').style.backgroundColor = 'darkgray' //endrer fargen på knappen for å vise at knappen er skrudd på
        document.getElementById('flag-button').style.border = '3px solid darkgreen'
    }
}


//Funksjon som kjøres når man trykker på rutene 
function clickTile() {
    //Hvis spillet er over så kan man ikke trykke på brettet lenger
    //Eller hvis en rute allerede er trykket på, så er det ingen vits i å sjekke på nytt
    if (gameOver || this.classList.contains("tile-clicked")) {
        return
    }

    let tile = this
    if (flagEnabled) {
        //Hvis ruten ikke inneholder et flagg, setter den inn et flagg
        if (tile.innerText == "") { 
            tile.innerText = '🚩'
            minesLeftCount -= 1

        }
        //Hvis ruten inneholder et flagg, fjernes flagget
        else if (tile.innerHTML == '🚩') {
            tile.innerHTML = ""
            minesLeftCount += 1
        }
        document.getElementById('mines-count').innerText = minesLeftCount
        return
    }

    //Hvis en rute har et flagg i seg, kan man bare trykke på knappen hvis flaggknappen er på. Hindrer at man trykker på en rute med et flagg på seg
    if(tile.innerHTML == '🚩'){
        if(flagEnabled){
            tile.innerText = ''
        }
        else{
            return
        }
    } 

    //Hvis man trykker på en rute med koordinater som er i arrayet minesLocation, altså en rute med en mine, så er spillet over
    if (minesLocation.includes(tile.id)) {
        score = 0
        showScore.innerHTML = score
        document.getElementById("win-lose").innerHTML = '<i class="fa-solid fa-skull-crossbones"></i> R.I.P. <i class="fa-solid fa-skull-crossbones"></i>'
        gameOver = true
        revealMines() //Funksjon som viser hvor alle minene er 
        return
    }


    //Hvis man ikke treffer en bombe, hvor mange miner er i nærheten
    let coords = tile.id.split('-') // '2-5' -> ['2', '5']
    let r = parseInt(coords[0]) //r = 2
    let c = parseInt(coords[1]) //c = 5
    //Kaller på funksjon som sjekker hvor mange bomber er i nærheten av ruten vi trykket på
    checkMine(r, c)

}

//Funksjon som kjøres når man trykker på en mine. Viser frem hvor alle minene er
function revealMines() {
    //Løkke som går gjennom alle rutene i brettet
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c] //Alle rutene i brettet
            //Hvis arrayet minesLocation har en id som matcher til en id på brettet inneholder ruten en bombe, og bomben vises og bakgrunnen blir rød
            if (minesLocation.includes(tile.id)) {
                tile.innerHTML = '<i class="fa-solid fa-land-mine-on"></i>' 
                tile.style.backgroundColor = 'red'                 
            }
        }
    }
}



//Funksjon som sjekker hvor mange miner er i nærheten av en rute. Tar inn variablene r og c, row og column
function checkMine(r, c) {
    //Passe på at rutene vi sjekker er innenfor brettet
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return
    }

    //Fjerne muligheten å sjekke samme rute flere ganger. For å ikke få uendelig recursion
    if (board[r][c].classList.contains('tile-clicked')) {
        return
    }

    //Legger til klassen 'tile-clicked' til ruten vi sjekker
    board[r][c].classList.add('tile-clicked')

    //Antall ruter vi har trykket på økes med 1 hver gang vi sjekker om det er mine i nærheten
    tilesClicked += 1

    //Deklarerer variabel
    let minesFound = 0

    //Sjekker rutene rundt ruten som er trykket på
    //Øverste 3
    minesFound += checkTile(r-1, c-1)      //Øverst til venstre
    minesFound += checkTile(r-1, c)        //Øverst 
    minesFound += checkTile(r-1, c+1)      //Øverst til høyre

    //Høyre and venstre
    minesFound += checkTile(r, c-1)        //Venstre
    minesFound += checkTile(r, c+1)        //Høyre

    //Nederste 3
    minesFound += checkTile(r+1, c-1)      //Nederst til venstre
    minesFound += checkTile(r+1, c)        //Nederst 
    minesFound += checkTile(r+1, c+1)      //Nederst til høyre

    //Hvis det finnes miner rundt ruten, så vises det hvor mange det er 
    if (minesFound > 0) {
        board[r][c].innerText = minesFound
        board[r][c].classList.add('n' + minesFound.toString()) //Gir det en klasse som passer til de ulike css-klassene
    }


    //Hvis det ikke er miner rundt ruten vi vil sjekke, ber vi naborutene sjekke
    //Kalles recursion
    else {
        //Øverste 3
        checkMine(r-1, c-1)     //Øverst til venstre
        checkMine(r-1, c)       //Øverst 
        checkMine(r-1, c+1)     //Øverst til høyre

        //Venstre og høyre
        checkMine(r, c-1)       //Venstre
        checkMine(r, c+1)       //Høyre

        //Nederste 3
        checkMine(r+1, c-1)     //Nederst til venstre
        checkMine(r+1, c)       //Nederst 
        checkMine(r+1, c+1)     //Nederst til høyre
    }


    //Hvis vi har trykket på alle rutene som ikke inneholder miner, er spillet over
    if (tilesClicked == rows * columns - minesCount) {
        for (let r= 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                tile = board[r][c]  
                if (minesLocation.includes(tile.id)) {
                    tile.innerHTML = '🚩'                
                }
            }
        }
        revealWin()
        gameOver = true
    } 



}


//Sjekke om ruten vi har trykket på er innenfor brettet
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0
    }
    if (minesLocation.includes(r.toString() + '-' + c.toString())) {
        return 1
    }
    return 0
}


//Funksjon som teller antall brett man har klart, gjøres utenfor checkMine for å unngå at dobbeltelling
function revealWin(){
    document.getElementById("win-lose").innerText = 'Flinkere enn Jostein!'
    document.getElementById("mines-count").innerText = '0'
    score += 1
    showScore.innerHTML = score
    showScore.innerHTML = score
        if(score > localStorage.highScore){
            localStorage.highScore  = score
            showHighScore.innerHTML = localStorage.highScore
        }
} 