(function() {

    const getRandomInteger = function(high) {
        return Math.floor(high * Math.random());
    }

    const getRandomChoice = function(arr) {
        return arr[getRandomInteger(arr.length)];
    }

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
                    div.classList.add(`cell-${i}-${j}`);

                    div.innerHTML = 
                        `<span>${grid[i][j] === null ? "" : grid[i][j].toString()}</span>`;

                    this.dom.grid.append(div);
                }
            }
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
        },
        reset() {
            this.dom.grid.innerHTML = "";
            this.buildGrid();
        },
        render() {
            const [numRows, numCols, grid] = controller.getGrid();

            for(let i = 0;i < numRows;i++) {
                for(let j = 0;j < numCols;j++) {
                    const div = this.dom.grid.querySelector(`.cell-${i}-${j}`);
                    div.innerHTML = 
                        `<span>${grid[i][j] === null ? "" : grid[i][j].toString()}</span>`;
                }
            }

            switch(controller.getGameStatus()) {
                case WIN:
                    this.dom.scoreHeading.innerText = "You Win !";
                    break;

                case LOSE:
                    this.dom.scoreHeading.innerText = "You Lose...";
                    break;

                case IN_PROGRESS:
                    this.dom.scoreHeading.innerText = `Score: ${controller.getScore()}`;
                    break;
            }
        }
    };

    controller.init();

}) ();