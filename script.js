
document.addEventListener('DOMContentLoaded', () => {
    const boardFields = document.querySelectorAll('.play_field');
    var board = [['', '', ''], ['', '', ''], ['', '', '']];
    const slider = document.querySelector('#playerCheckbox')

    const menuCheckBox = document.querySelector('#menu')

    
    
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

function updateHints(boardFields, board) {
    boardFields.forEach(item => {
        const pastView = item.querySelector(".view")
        const child = item.querySelector(`.${player(board)}`)
        
        if (pastView) {
            pastView.classList.remove("view")
        }
        
        if (!item.querySelector('.active'))
            child.classList.add('view');
    })
}


async function initialize(board_fields, board, slider) {
    slider.addEventListener("change", () => {
        const activeOnes = document.querySelectorAll('.active')
    
        activeOnes.forEach(item => {
            const parent = item.parentElement
            delete parent.dataset.value
            item.classList.remove('active')
        })
        board_fields.forEach(item => item.dataset.value = "")
        console.log(board)
        board = updateBoard(board, board_fields)
        console.log(board)
    })

    updateHints(board_fields, board)
    if (slider.checked) {
        const play = await AIplay(board)
        const element = board_fields[play].querySelector(`.${player(board)}`)
        element.classList.remove('view')
        element.classList.remove('show')
        element.classList.add('active')
        board_fields[play].dataset.value = player(board);
        board = updateBoard(board, board_fields)
    }

    board_fields.forEach(item => {
        item.addEventListener('click', async () => {
            const child = item.querySelector(`.${player(board)}`);

            if (!item.querySelector('.active')) {
                child.classList.remove('view')
                child.classList.remove('show')
                child.classList.add('active')
                item.dataset.value = player(board);
                
                board = updateBoard(board, board_fields);
            }
            
            const play = await AIplay(board)
            const element = board_fields[play].querySelector(`.${player(board)}`)
            element.classList.remove('view')
            element.classList.remove('show')
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

    updateHints(board_fields, board)

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
