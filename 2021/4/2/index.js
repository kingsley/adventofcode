import fs from 'fs';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const BOARD_HEIGHT = 5;
const BOARD_SEPARATOR_HEIGHT = 1;


const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf8');

const lines = input.trim().split('\n')

const drawQueue = lines[0].split(",");

const allBoardLines = lines.slice(2);

let boards = [];
for(let i = 0; i < allBoardLines.length; i += BOARD_HEIGHT+BOARD_SEPARATOR_HEIGHT) {
    const board = allBoardLines.slice(i, i+BOARD_HEIGHT)
        .map(line => line.split(' ').filter(x => x).map(num => ({num, hit: false})));
    boards.push(board);
}

let lastWinningScore = null;
(() => {
    for(let i = 0; i < drawQueue.length; i++) {
        const num = drawQueue[i];
        console.log("Drawn: ", num);
        
        boards.forEach(board => {
            board.forEach(line => {
                line.forEach(item => {
                    if(item.num === num) item.hit = true;
                })
            })
        })

        for(let j = 0; j < boards.length; j++) {
            const board = boards[j];
            const transposedBoard = getTransposedBoard(board);
            const winningLines = getWinningLines(board)
                .concat(getWinningLines(transposedBoard));
            
            if(winningLines.length) {
                console.log("board", j);
                const sum = sumUnmarked(board);
                console.log("sum", sum);
                const score = sum*num;
                console.log("answer", score);
                lastWinningScore = score;
                boards.splice(j, 1);
            }
        }
    }
})()

console.log("lastWinningScore", lastWinningScore);
//console.log("drawQueue", drawQueue);
//console.log("allBoardLines", allBoardLines);
//console.log("boards", boards);

function getWinningLines(board) {
    return board.filter(line => line.every(item => item.hit));
}

function getTransposedBoard(board) {
    let transposedBoard = [];
    for(let i = 0; i < board.length; i++) {
        const line = board[i];
        
        for(let j = 0; j < line.length; j++) {
            const item = line[j];
            
            if(!transposedBoard[j]) transposedBoard[j] = [];

            transposedBoard[j][i] = item;
        }
    }
    return transposedBoard;
}

function sumUnmarked(board) {
    return board.map(
            line => line
                .filter(item => !item.hit)
                .map(item => parseInt(item.num))
        )
        .flat()
        .reduce((sum, num) => sum + num)
    ;
}