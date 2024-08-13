
document.addEventListener('DOMContentLoaded', () => {
    const boardFields = document.querySelectorAll('.play_field');
    var board = [['', '', ''], ['', '', ''], ['', '', '']];
    const slider = document.querySelector('#playerCheckbox')

    const menuCheckBox = document.querySelector('#menu')


    // slider.addEventListener("change", () => {
    //     if (slider.checked) {
    //         boardFields.forEach(item => {
    //             const child = item.querySelector(`.${player(board)}`)
            
    //             if (!item.querySelector('.active'))
    //                 child.classList.add('view');
    //         })
    //     }
    // })

    slider.addEventListener("change", () => {
        const xones = document.querySelectorAll(".X")
        const oones = document.querySelectorAll(".O")

        xones.forEach(item => {
            item.classList.remove("active")
            // item.classList.remove("X")
        })
        oones.forEach(item => {
            item.classList.remove("active")
            // item.classList.remove("O")
        })

        boardFields.forEach(item => {
            delete item.dataset.value
        })

        board = updateBoard(board, boardFields)
    })

    menuCheckBox.addEventListener('change', () => {
        const aside = document.querySelector('aside');

        if (menuCheckBox.checked) {
            aside.style.left = '0'
        } else {
            aside.style.left = '-280px'
        }
    })
    
    initialize(boardFields, board, slider);
});


async function initialize(board_fields, board, slider) {
    if (slider.checked) {
        const play = await AIplay(board)
        const element = board_fields[play].querySelector(`.${player(board)}`)
        element.classList.add('active')
        board_fields[play].dataset.value = player(board);
        board = updateBoard(board, board_fields)
    }

    board_fields.forEach(item => {
        item.addEventListener('click', async () => {
            const child = item.querySelector(`.${player(board)}`);

            if (!item.querySelector('.active')) {
                child.classList.add('active')
                item.dataset.value = player(board);
                
                board = updateBoard(board, board_fields);
            }
            
            const play = await AIplay(board)
            const element = board_fields[play].querySelector(`.${player(board)}`)
            element.classList.add('active')
            board_fields[play].dataset.value = player(board);
            board = updateBoard(board, board_fields)
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
