const gameBoard = (() => {
    let board = ["","","","","","","","",""]

    
    const getIndex = (index) => {
        return board[index];
    }
    
    const changeBoard = (index, sign) => {
        board[index] = sign;
    }

    const restart = () =>{
        board = ["","","","","","","","",""];
    }
    return {
        getIndex,
        changeBoard,
        restart
    };
})();

const Player = (sign, name) => {
    const getSign = () =>{
        return sign;
    }

    const getName = () =>{
        return name;
    }
    return{
        getSign,
        getName
    };
};

const displayController = (() => {
    let board = document.querySelectorAll(".box");
    let player1 = window.prompt("What will player ones (X) name be?");
    let player2 = window.prompt("What will player twos (O) name be?");

    board.forEach((box) =>
        box.addEventListener("click", (e) =>{
            if(e.target.textContent != "" || gameController.gameOver())
                return;
            e.target.textContent = gameController.updateTurn()
            updatePlayerTurn();
            gameBoard.changeBoard(parseInt(e.target.getAttribute("data-index")), e.target.textContent);
            gameController.gameOver();
        })
    );
    const updateBoard = () =>{
        for(let i = 0; i < board.length; i++){
            board[i].textContent = gameBoard.getIndex(i);
        }
    };

    const initializePlayerTurn = (() => {
        let div1 = document.querySelector("#player1");
        let div2 = document.querySelector("#player2");

        //adding player1s name to html
        let node1 = document.createElement("p");
        let textNode1 = document.createTextNode(player1);
        node1.appendChild(textNode1);
        div1.appendChild(node1);

        //adding player2s name to html
        let node2 = document.createElement("p");
        let textNode2 = document.createTextNode(player2);
        node2.appendChild(textNode2);
        div2.appendChild(node2);

        //displaying whos turn it is
        let turn1 = document.createElement("p");
        turn1.setAttribute("class", "turn");
        let textNode3 = document.createTextNode("Your turn!");
        turn1.appendChild(textNode3);
        div1.appendChild(turn1);

        let turn2 = document.createElement("p");
        turn2.setAttribute("class", "turn");
        let textNode4 = document.createTextNode("Please wait..");
        turn2.appendChild(textNode4);
        div2.appendChild(turn2);
    })();

    const updatePlayerTurn = () =>{
        let turn = gameController.getTurn();
        let div1 = document.querySelector("#player1");
        let div2 = document.querySelector("#player2");
        let turns = document.querySelectorAll(".turn");
        if(turn%2 == 1){
            turns[0].textContent = "Please wait..";
            turns[1].textContent = "Your turn!";
        }
        else{
            turns[0].textContent = "Your turn!";
            turns[1].textContent = "Please wait..";
        }
    }
    const playerNames = () =>{
        return [player1, player2];
    }
    const displayWinner = (winner) =>
    {
        let winnerDiv = document.querySelector("#win-status");
        winnerDiv.textContent = winner.getName() + " has won this round!";
        emptyTurns();
    };

    const displayTie = () =>{
        let winnerDiv = document.querySelector("#win-status");
        winnerDiv.textContent = "This round was a tie!";
        emptyTurns();
    }

    const emptyTurns = () =>{
        let turns = document.querySelectorAll(".turn");
        turns[0].textContent = "";
        turns[1].textContent = "";
    }

    const restart = () =>{
        let turns = document.querySelectorAll(".turn");
        turns[0].textContent = "Your turn!";
        turns[1].textContent = "Please wait..";

        board.forEach((box) =>{
            box.textContent = "";
        })
        let winnerDiv = document.querySelector("#win-status");
        winnerDiv.textContent = "";
    }

    let restartButton = document.querySelector("#restart");
    restartButton.addEventListener("click", (e)=>{
        restart();
        gameBoard.restart();
        gameController.restart();
    });

    updateBoard();
    return{
        playerNames,
        displayWinner,
        displayTie
    }
})();

const gameController = (() =>{
    let playerName = displayController.playerNames();
    let player1 = Player("X", playerName[0]);
    let player2 = Player("O", playerName[1]);
    let turn = 0;
    
    const updateTurn = () =>{
        turn++;
        if(turn%2 == 1)
            return player1.getSign();
        else
            return player2.getSign();
    }

    const getTurn = () =>{
        return turn;
    }
    /*winning indexes => 0 1 2, 
                         3 4 5, 
                         6 7 8, 
                         0 3 6,
                         1 4 7,
                         2 5 8,
                         0 4 8,
                         2 4 6
    */

    const winningIndexes = [[0,1,2],
                            [3,4,5],
                            [6,7,8],
                            [0,3,6],
                            [1,4,7],
                            [2,5,8],
                            [0,4,8],
                            [2,4,6]];
    const isWinner = () =>{
        for(let i = 0; i < winningIndexes.length; i++)
        {
            const curr = winningIndexes[i];
            const first = gameBoard.getIndex(curr[0]);
            for(let j = 0; j < curr.length; j++)
            {
                if(first != gameBoard.getIndex(curr[j]) || first == "")
                    break;
                else if(j == curr.length-1)
                    return first;
            }
        }
        return null;
    };

    const gameOver = () =>{
        let winner =  isWinner();
        let playerWin = player2;
        if(turn%2 == 1)
            playerWin =  player1;

        if(winner != null){
            displayController.displayWinner(playerWin);
            return true;
        }
        else if(turn == 9){
            displayController.displayTie();
            return true;
        }
        else
            return false;
    }

    const restart = () =>
    {
        turn = 0;
    }

    return{
        updateTurn,
        gameOver,
        getTurn,
        restart
    };
})();