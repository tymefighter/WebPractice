(function() {

    const getRandomInteger = function(high) {
        return Math.floor(high * Math.random());
    }

    const getRandomChoice = function(arr) {
        return arr[getRandomInteger(arr.length)];
    }

    const createModal = function() {
        const div = document.createElement("div");
        div.classList.add("modal");

        const body = document.querySelector("body");
        body.append(div);

        return div;
    }

    const createTextModal = function(text) {
        const modalDiv = createModal();
        const p = document.createElement("p");

        p.innerText = text;
        modalDiv.append(p);

        p.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        modalDiv.addEventListener("click", () => {
            modalDiv.remove();
        });
    }

    const HELP_CONTENT = 
        `Welcome to a 2048 game version built by tymefighter.
        Use your arrow keys to control the movement of
        numbers within the grid. You WIN if one of the cell's
        value reaches 2048, and LOSE if you have no possible
        moves. All the best !! (from tymefighter)`;

    const COLOR_LIST = [
        "rgb(230, 222, 213)", "rgb(247, 211, 144)", "rgb(247, 160, 144)", 
        "rgb(224, 93, 0)", "rgb(223, 42, 111)", "rgb(223, 42, 205)",
        "rgb(153, 42, 223)", "rgb(121, 17, 186)", "rgb(76, 17, 186)",
        "rgb(20, 17, 186)", "rgb(8, 7, 120)"
    ];

    const TEXT_COLOR_LIST = [
        "rgb(172, 140, 111)", "rgb(172, 140, 111)", "rgb(172, 140, 111)",
        "white", "white", "white", "white", "white", "white", "white", "white"
    ];

    const moveAlongArr = function(arr) {
        const newArr = [];
        let points = 0, prev = null;
        
        let foundNull = false;
        let moveSuccesful = false;

        arr.forEach((value) => {
            if(value === null) {
                foundNull = true;
                return;
            }

            moveSuccesful |= foundNull;

            if(newArr.length === 0) {
                newArr.push(value);
                prev = value;
            }
            else if(value === prev) {
                moveSuccesful = true;
                newArr.pop();
                newArr.push(2 * value);
                points += 2 * value;
                prev = null;
            }
            else {
                newArr.push(value);
                prev = value;
            }
        });

        while(newArr.length < arr.length) newArr.push(null);

        return [newArr, moveSuccesful, points];
    }

    const model = {
        grid: null,
        numRows: 4,
        numCols: 4,
        score: 0,
        init() {
            this.score = 0;
            this.grid = [];
            for(let i = 0;i < this.numRows;i++)
                this.grid.push(new Array(this.numCols).fill(null));
            
            const initRow = getRandomInteger(this.numRows);
            const initCol = getRandomInteger(this.numCols);

            this.grid[initRow][initCol] = 2;
        },
        reset(numRows, numCols) {
            this.numRows = numRows;
            this.numCols = numCols;
            this.init();
        },
        randomlyPlaceValue() {
            const emptyPosArr = [];

            for(let i = 0;i < this.numRows;i++)
                for(let j = 0;j < this.numCols;j++)
                    if(this.grid[i][j] === null) 
                        emptyPosArr.push([i, j]);

            const [i, j] = getRandomChoice(emptyPosArr);
            this.grid[i][j] = 2;
        },
        moveUp() {
            let anyMoveSuccesful = false;
            for(let j = 0;j < this.numCols;j++) {
                const arr = [];
                for(let i = 0;i < this.numRows;i++)
                    arr[i] = this.grid[i][j];

                const [newArr, moveSuccesful, points] = moveAlongArr(arr);
                for(let i = 0;i < this.numRows;i++)
                    this.grid[i][j] = newArr[i];

                anyMoveSuccesful |= moveSuccesful;
                this.score += points;
            }

            if(anyMoveSuccesful) this.randomlyPlaceValue();
        },
        moveRight() {
            let anyMoveSuccesful = false;
            for(let i = 0;i < this.numRows;i++) {
                const arr = [];
                for(let j = 0;j < this.numCols;j++)
                    arr[this.numCols - j - 1] = this.grid[i][j];

                const [newArr, moveSuccesful, points] = moveAlongArr(arr);
                for(let j = 0;j < this.numCols;j++)
                    this.grid[i][j] = newArr[this.numCols - j - 1];

                anyMoveSuccesful |= moveSuccesful;
                this.score += points;
            }

            if(anyMoveSuccesful) this.randomlyPlaceValue();
        },
        moveDown() {
            let anyMoveSuccesful = false;
            for(let j = 0;j < this.numCols;j++) {
                const arr = [];
                for(let i = 0;i < this.numRows;i++)
                    arr[this.numRows - i - 1] = this.grid[i][j];

                const [newArr, moveSuccesful, points] = moveAlongArr(arr);
                for(let i = 0;i < this.numRows;i++)
                    this.grid[i][j] = newArr[this.numRows - i - 1];

                anyMoveSuccesful |= moveSuccesful;
                this.score += points;
            }

            if(anyMoveSuccesful) this.randomlyPlaceValue();
        },
        moveLeft() {
            let anyMoveSuccesful = false;
            for(let i = 0;i < this.numRows;i++) {
                const arr = [];
                for(let j = 0;j < this.numCols;j++)
                    arr[j] = this.grid[i][j];

                const [newArr, moveSuccesful, points] = moveAlongArr(arr);
                for(let j = 0;j < this.numCols;j++)
                    this.grid[i][j] = newArr[j];

                anyMoveSuccesful |= moveSuccesful;
                this.score += points;
            }

            if(anyMoveSuccesful) this.randomlyPlaceValue();
        },
    };    

    const WIN = "WIN";
    const IN_PROGRESS = "IN_PROGRESS";
    const LOSE = "LOSE";

    const controller = {
        init() {
            model.init();
            view.init();
        },
        reset(numRows, numCols) {
            model.reset(numRows, numCols);
            view.reset();
        },
        getGrid() {
            return [model.numRows, model.numCols, model.grid];
        },
        getScore() {
            return model.score;
        },
        getGameStatus() {
            let foundEmpty = false, foundSameAdjacent = false;
            for(let i = 0;i < model.numRows;i++) {
                for(let j = 0;j < model.numCols;j++) {
                    if(model.grid[i][j] === 2048)
                        return WIN;

                    else if(model.grid[i][j] === null)
                        foundEmpty = true;
                        
                    else if((i > 0 && model.grid[i - 1][j] === model.grid[i][j])
                        || (j < model.numCols - 1  && model.grid[i][j + 1] === model.grid[i][j])
                        || (i < model.numRows - 1 && model.grid[i + 1][j] === model.grid[i][j])
                        || (j > 0 && model.grid[i][j - 1] === model.grid[i][j])
                    )
                        foundSameAdjacent = true;
                }
            }

            return (foundEmpty || foundSameAdjacent) ? IN_PROGRESS : LOSE;
        },
        moveUp() {
            model.moveUp();
            view.render();
        },
        moveRight() {
            model.moveRight();
            view.render();
        },
        moveDown() {
            model.moveDown();
            view.render();
        },
        moveLeft() {
            model.moveLeft();
            view.render();
        }
    };

    const view = {
        dom: {
            scoreHeading: document.querySelector("h2"),
            grid: document.querySelector(".grid"),
            newGameButton: document.querySelector(".new-game"),
            helpButton: document.querySelector(".help")
        },
        buildGrid() {
            const [numRows, numCols, grid] = controller.getGrid();
            
            this.dom.grid.style.gridTemplateRows = `repeat(${numRows}, 5rem)`;
            this.dom.grid.style.gridTemplateColumns = `repeat(${numCols}, 5rem)`;

            for(let i = 0;i < numRows;i++) {
                for(let j = 0;j < numCols;j++) {
                    const div = document.createElement("div");
                    const span = document.createElement("span");
                    span.classList.add(`cell-${i}-${j}`);
                    span.innerText = grid[i][j] === null ? "" : grid[i][j].toString()
                    
                    div.append(span);
                    this.dom.grid.append(div);
                }
            }
        },
        addButtonListeners() {
            document
            .querySelector(".new-game")
            .addEventListener("click", () => {
                const modalDiv = createModal();
                const form = document.createElement("form");

                form.innerHTML =
                `
                    <label for="numRows">Number of Rows: </label>
                    <input type="number" name="numRows" id="numRows"/>

                    <label for="numCols">Number of Columns: </label>
                    <input type="number" name="numCols" id="numCols"/>

                    <button type="button">Start</button>
                `;
                const numRowsInput = form.querySelector("#numRows");
                const numColsInput = form.querySelector("#numCols");

                modalDiv.append(form);

                form.querySelector("button").addEventListener("click", () => {
                    controller.reset(
                        parseInt(numRowsInput.value), 
                        parseInt(numColsInput.value)
                    );
                    modalDiv.remove();
                });

                form.addEventListener("click", event => event.stopPropagation());
                modalDiv.addEventListener("click", () => modalDiv.remove());
            });

            document
            .querySelector(".help")
            .addEventListener("click", () => createTextModal(HELP_CONTENT));
        },
        init() {
            this.buildGrid();
            window.addEventListener("keydown", (event) => {
                switch(event.code) {
                    case "ArrowUp":
                        controller.moveUp();
                        break;

                    case "ArrowRight":
                        controller.moveRight();
                        break;

                    case "ArrowDown":
                        controller.moveDown();
                        break;

                    case "ArrowLeft":
                        controller.moveLeft();
                        break;
                }
                console.log(event.code, typeof event.code);
            });

            this.addButtonListeners();
        },
        reset() {
            this.dom.grid.innerHTML = "";
            this.buildGrid();
        },
        render() {
            const [numRows, numCols, grid] = controller.getGrid();

            for(let i = 0;i < numRows;i++) {
                for(let j = 0;j < numCols;j++) {
                    const span = this.dom.grid.querySelector(`.cell-${i}-${j}`);

                    if(grid[i][j] !== null) {
                        span.innerText = grid[i][j].toString();
                        console.log(Math.floor(Math.log2(grid[i][j])) + 1);
                        switch(Math.floor(Math.log10(grid[i][j])) + 1) {
                            case 1:
                                span.style.fontSize = "3rem";
                                span.style.marginTop = "0.5rem";
                                break;

                            case 2:
                                span.style.fontSize = "2rem";
                                span.style.marginTop = "0.8rem";
                                break;

                            case 3:
                                span.style.fontSize = "1.6rem";
                                span.style.marginTop = "1rem";
                                break;
                            
                            case 4:
                                span.style.fontSize = "1.4rem";
                                span.style.marginTop = "1.5rem";
                                break;
                        }
                        const colorIndex = Math.log2(grid[i][j]) - 1
                        span.style.color = TEXT_COLOR_LIST[colorIndex];
                        span.parentNode.style.backgroundColor = COLOR_LIST[colorIndex];
                    }
                    else {
                        span.innerText = "";
                        span.parentNode.style.backgroundColor = COLOR_LIST[0];
                    } 
                }
            }

            switch(controller.getGameStatus()) {
                case WIN:
                    text = `You Win ! Your Score is ${controller.getScore()}`;
                    this.dom.scoreHeading.innerText = text;
                    createTextModal(text);
                    break;

                case LOSE:
                    text = `You Lose...Your Score is ${controller.getScore()}`;
                    this.dom.scoreHeading.innerText = text;
                    createTextModal(text);
                    break;

                case IN_PROGRESS:
                    this.dom.scoreHeading.innerText = `Score: ${controller.getScore()}`;
                    break;
            }
        }
    };

    controller.init();

}) ();