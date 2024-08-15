let boardFields;
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let slider;

document.addEventListener('DOMContentLoaded', () => {
    boardFields = document.querySelectorAll('.play_field');
    slider = document.querySelector('#playerCheckbox');
    const menuCheckBox = document.querySelector('#menu');
    
    menuCheckBox.addEventListener('change', () => {
        const aside = document.querySelector('aside');
        
        if (menuCheckBox.checked)
            aside.style.left = '0';
        else
            aside.style.left = '-280px';
    })
    
    slider.addEventListener("change", () => {
        const activeOnes = document.querySelectorAll('.active');
        
        activeOnes.forEach(item => {
            const parent = item.parentElement;
            delete parent.dataset.value;
            item.classList.remove('active');
        })

        boardFields.forEach(item => item.dataset.value = "");
        board = updateBoard(board, boardFields);

        initialize()
    })

    initialize();
});


async function initialize() {
    updateHints(board, boardFields)
    
    if (slider.checked)
        board = await AIPlay()
    
    boardFields.forEach(item => {
        item.addEventListener('click', async () => {
            const child = item.querySelector(`.${player(board)}`);
            
            if (!item.querySelector('.active')) {
                updateItemClasses(child)
                item.dataset.value = player(board);
                
                board = updateBoard(board, boardFields);
                board = await AIPlay()
            }
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


async function AIPlay() {
    const play = await getAIPlay(board)
    const element = boardFields[play].querySelector(`.${player(board)}`)
    updateItemClasses(element)
    boardFields[play].dataset.value = player(board);

    return updateBoard(board, boardFields);
}


function updateItemClasses(item) {
    item.classList.remove('show', 'view');
    item.classList.add('active')
}


function updateHints() {
    boardFields.forEach(item => {
        const pastView = item.querySelector(".view");
        const child = item.querySelector(`.${player(board)}`);
        
        if (pastView)
            pastView.classList.remove("view", "show");
        
        if (!item.querySelector('.active'))
            child.classList.add('view');
    })
}


function updateBoard() {
    boardFields.forEach((item, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        board[row][col] = item.dataset.value;
    });

    updateHints(board, boardFields)
    
    return board
}


function player(state) {
    let qtd_x = 0, qtd_o = 0

    state.flat().forEach(item => {
        if (item == 'X') ++qtd_x;
        if (item == 'O') ++qtd_o;
    })

    return qtd_x === qtd_o ? 'X' : 'O';
}


async function getAIPlay(state) {
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
