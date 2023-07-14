// Display object
var display = (function() {
    const container = document.querySelector(".container");
    const form = document.querySelector(".user-options");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const dropDown = document.querySelector("#diff-drop-down");
        const pMarker = document.querySelector(".chosen");

        let cMarker;

        if (pMarker.textContent === "O") cMarker = "X";
        else cMarker = "O";

        container.classList.add("active");
        form.classList.remove("active");
        game.start(pMarker.textContent, cMarker, dropDown.value);
    });

    const markerBtns = document.querySelectorAll(".marker");
    markerBtns[0].addEventListener("click", () => {
        markerBtns[0].classList.add("chosen");
        markerBtns[1].classList.remove("chosen");
    });
    markerBtns[1].addEventListener("click", () => {
        markerBtns[1].classList.add("chosen");
        markerBtns[0].classList.remove("chosen");
    });

    // Add event listners to each square in the grid
    const squares = document.querySelectorAll(".square");

    for (let i = 0; i < squares.length; i++)
    {
        squares[i].addEventListener("click", () => {
            game.playTurn(i);
        });
    }

    const playAgainBtn = document.querySelector(".play-again");
    const resultDis = document.querySelector(".result");

    playAgainBtn.addEventListener("click", () => {
        game.refresh();
        container.classList.remove("active");
        form.classList.add("active");
        playAgainBtn.classList.remove("show");
        resultDis.textContent = "";
    });
    
    function placeMarker(index, marker){
        if (!(0 <= index <= 8))
        {
            console.log("Error: Invalid index");
        }
        else if (squares[index] == "")
        {
            console.log("Error: Index occupied");
        }
        else if (!(marker === "X" || marker === "O"))
        {
            console.log("Error: Invalid Marker");
        }
        else
        {
            squares[index].textContent = marker;
        } 
    }
    
    function clearBoard(){
        for (let i = 0; i < squares.length; i ++)
        {
            squares[i].textContent = "";
        }
    }

    function finishGame(result){
        playAgainBtn.classList.add("show");
        resultDis.textContent = result;
    }

    return {placeMarker, finishGame, clearBoard};   

})();

// Gameboard object

var gameBoard = (function() {
    const boardArr = ["", "", "", "", "", "", "", "", ""];
    let recentlyPlaced;

    function refresh(){
        for (let i = 0; i < boardArr.length; i++)
        {
            boardArr[i] = "";
        }
    }

    // Method that allows client to place a marker on the board
    // Fails silently if a marker is already at the specified index
    // or a marker other than X or Y is placed.
    function placeMarker(marker, index)
    {
        if (!(0 <= index <= 8))
        {
            console.log("Error: Invalid index");
            return "Error";
        }
        else if (!(boardArr[index] == ""))
        {
            console.log("Error: Index occupied");
            return "Error";
        }
        else if (!(marker === "X" || marker === "O"))
        {
            console.log("Error: Invalid Marker");
            return "Error";
        }
        else
        {
            boardArr[index] = marker;
            recentlyPlaced = marker;
            let state = gameState(boardArr);
            if (state != "IP") game.finish(state);
            return index;
        } 
    }

    function gameState(board)
    {
        let full = true;
        for (let i = 0; i < board.length; i++)
        {
            if (board[i] == "")
            {
                full = false;
            }
        }
        // Check Diagonals
        if (board[0] == "X" && board[4] == "X" && board[8] == "X"){
            return "X W";
        }
        else if (board[2] == "X" && board[4] == "X" && board[6] == "X"){
            return "X W";
        }
        else if (board[0] == "O" && board[4] == "O" && board[8] == "O"){
            return "O W";
        }
        else if (board[2] == "O" && board[4] == "O" && board[6] == "O"){
            return "O W";
        }
        // Check Horizontals
        else if (board[0] == "X" && board[1] == "X" && board[2] == "X"){
            return "X W";
        }
        else if (board[3] == "X" && board[4] == "X" && board[5] == "X"){
            return "X W";
        }
        else if (board[6] == "X" && board[7] == "X" && board[8] == "X"){
            return "X W";
        }
        else if (board[0] == "O" && board[1] == "O" && board[2] == "O"){
            return "O W";
        }
        else if (board[3] == "O" && board[4] == "O" && board[5] == "O"){
            return "O W";
        }
        else if (board[6] == "O" && board[7] == "O" && board[8] == "O"){
            return "O W";
        }
        // Check Verticals
        else if (board[0] == "X" && board[3] == "X" && board[6] == "X"){
            return "X W";
        }
        else if (board[1] == "X" && board[4] == "X" && board[7] == "X"){
            return "X W";
        }
        else if (board[2] == "X" && board[5] == "X" && board[8] == "X"){
            return "X W";
        }
        else if (board[0] == "O" && board[3] == "O" && board[6] == "O"){
            return "O W";
        }
        else if (board[1] == "O" && board[4] == "O" && board[7] == "O"){
            return "O W";
        }
        else if (board[2] == "O" && board[5] == "O" && board[8] == "O"){
            return "O W";
        }
        else if (full){
            return "T";
        }
        else{
            return "IP";
        }
    }

    function getRecentlyPlacedMarker(){
        return recentlyPlaced
    }

    return {gameState, refresh, placeMarker, getRecentlyPlacedMarker, get board () {return boardArr}}
})();

// Player objects

function Player(nameStr, markerStr)
{
    let name = nameStr;
    let marker = markerStr;

    let makeMove;

    return {name, marker, makeMove};
}

function ManualPlayer(name, marker)
{
    const parent = Player(name, marker);

    parent.makeMove = function(index){
        return gameBoard.placeMarker(parent.marker, index);
    };

    return parent;
}

function CPUEasy(name, marker)
{
    const parent = Player(name, marker);
    // Make a random selection
    parent.makeMove = function(){
        const avaSpots = [];
        for (let i = 0; i < gameBoard.board.length; i++)
        {
            if (gameBoard.board[i] == "") avaSpots.push(i);
        }
        return gameBoard.placeMarker(parent.marker, avaSpots[Math.floor(avaSpots.length * Math.random())]);
    }

    return parent;
}

function CPUHard(name, marker)
{
    const parent = Player(name, marker);
    // Minimax algorithm

    function avaSpots(board){
        ava = []
        for (let i = 0; i < board.length; i++)
        {
            if (board[i] === "") ava.push(i);
        }
        return ava;
    }

    function moveVal(playerMarker, oppMarker, board, move){
        if (move === undefined) move = true;
        const ava = avaSpots(board);
        let total = 0;
        if (move === true)
        {
            for (let i = 0; i < ava.length; i++)
            {
                let newBoard = Array.from(board);
                newBoard[ava[i]] = playerMarker;

                let check = gameBoard.gameState(newBoard);
                if (check === "IP") total += moveVal(playerMarker, oppMarker, newBoard, false);
                else if (check === playerMarker + " W") total += 1;
            }
        }
        else 
        {
            for (let i = 0; i < ava.length; i++)
            {
                let newBoard = Array.from(board);
                newBoard[ava[i]] = oppMarker;

                let check = gameBoard.gameState(newBoard);
                if (check === "IP") total += moveVal(playerMarker, oppMarker, newBoard, true);
            }
        }
        return total;
    }

    parent.makeMove = function(){
        const ava = avaSpots(gameBoard.board);
        const vals = []

        for (let i = 0; i < ava.length; i++)
        {
            let newBoard = Array.from(gameBoard.board);
            newBoard[ava[i]] = parent.marker;
            vals.push(moveVal(gameBoard.getRecentlyPlacedMarker(), parent.marker, newBoard));
        }

        let minVal = vals[0];
        let minInd = 0;

        for (let i = 0; i < vals.length; i ++)
        {
            if (minVal > vals[i]){
                minInd = i;
                minVal = vals[i];
            }
        }
        
        return gameBoard.placeMarker(parent.marker, ava[minInd]);
    }

    return parent;
}

// Game object

var game = (function() {

    let active = false;
    let player1;
    let player2;
    let playerTurn;

    function refresh(){
        gameBoard.refresh();
        display.clearBoard();
    }

    function start(player1Marker, player2Marker, diff){
        active = true;
        player1 = ManualPlayer("user", player1Marker);

        if (diff === "easy"){
            player2 = CPUEasy("cpu", player2Marker);
        } 
        else {
            player2 = CPUHard("cpu", player2Marker);
        }

        if (player1.marker == "O") 
        {
            playerTurn = player1; 
        }
        else {
            playerTurn = player2;
            playTurn();
        };
    }

    function finish(result){
        active = false;

        let message;

        if (result === "X W" && player1.marker === "X") message = player1.name + " Wins!";
        else if (result === "X W" && player2.marker === "X") message = player2.name + " Wins!";
        else if (result === "O W" && player1.marker === "O") message = player1.name + " Wins!";
        else if (result === "O W" && player2.marker === "O") message = player2.name + " Wins!";
        else message = "It's A Draw...";

        display.finishGame(message);
    }

    function toggleTurn(){
        if (playerTurn === null) return;
        if (playerTurn === player1) playerTurn = player2;
        else playerTurn = player1; 
    }

    function playTurn(index){
        if (!active) return;
        let temp = playerTurn.makeMove(index);
        if (temp !== "Error")
        {
            display.placeMarker(temp, playerTurn.marker);
            toggleTurn();
        };
        // Once the usr has played, signal the cpu to play.
        if (playerTurn === player2) playTurn();
    }

    return {start, finish, refresh, playTurn};
})();



