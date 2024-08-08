
document.addEventListener('DOMContentLoaded', () => {
    const boardFields = document.querySelectorAll('.play_field');
    const board = [['', '', ''], ['', '', ''], ['', '', '']];
    
    initialize(boardFields, board);

    document.documentElement.style.setProperty('--current-player', player(board));
});

async function initialize(board_fields, board) {
    if (player(board) == 'X') {
        const play = await AIplay(board)
        const element = board_fields[play].querySelector(`.${player(board)}`)
        element.classList.add('active')
        board_fields[play].dataset.value = player(board);
        board = updateBoard(board, board_fields)
    }
    updateBoard(board, board_fields);

    board_fields.forEach(item => {
        item.addEventListener('click', async () => {
            const child = item.querySelector(`.${player(board)}`);

            if (!item.querySelector('.active')) {
                child.classList.add('active')
                item.dataset.value = player(board);
                
                board = updateBoard(board, board_fields);
            }
            
            if (player(board) == 'X') {
                const play = await AIplay(board)
                const element = board_fields[play].querySelector(`.${player(board)}`)
                element.classList.add('active')
                board_fields[play].dataset.value = player(board);
                board = updateBoard(board, board_fields)
            }
            console.log(board)
            console.log(player(board))
        })
        
        item.addEventListener('mouseover', () => {
            const child = item.querySelector(`.${player(board)}`);
            
            if (!item.querySelector('.active'))
                child.classList.add('show');
        });

        item.addEventListener('mouseout', () => {
            const child = item.querySelector(`.${player(board)}`);

            if (!item.querySelector('.active'))
                child.classList.remove('show');
        });
    })
}

function updateBoard(board, board_fields) {
    board = [['', '', ''], ['', '', ''], ['', '', '']]

    board_fields.forEach((item, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        board[row][col] = item.dataset.value;
    });

    return board
}

function player(state) {
    var qtd_x = 0;
    var qtd_o = 0;

    state.forEach(item => {
        item.forEach(cell => {
            if (cell == 'X')
                ++qtd_x;
            else if (cell == 'O')
                ++qtd_o;
        })
    })

    return (qtd_x == qtd_o) ? 'X' : 'O';
}


async function AIplay(state) {
    const response = await fetch('https://jogo-da-velha-api-58hq.onrender.com/play/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ board: state })
    })

    const data = response.json()
    return data
}
