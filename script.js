const url = "https://jogo-da-velha-api-58hq.onrender.com"
let boardFields;
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let slider;

document.addEventListener('DOMContentLoaded', () => {
    generateView();

    boardFields = document.querySelectorAll('.play_field');
    slider = document.querySelector('#playerCheckbox');
    const menuCheckBox = document.querySelector('#menu');
    
    menuCheckBox.addEventListener('change', () => {
        const aside = document.querySelector('aside');
        
        if ( menuCheckBox.checked )
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

        initialize();
    })

    initialize();
});


async function initialize() {
    const adv_audio = document.getElementById("adv_audio");
    const u_audio = document.getElementById("u_audio");
    const win_audio = document.getElementById("win_audio");
    const lose_audio = document.getElementById("lose_audio");

    updateHints(board, boardFields)
    
    if (!slider.checked) {
        board = await AIPlay();
        adv_audio.play();
    }
    
    boardFields.forEach(item => {
        item.addEventListener('click', async () => {
            const child = item.querySelector(`.${player(board)}`);
            
            if ( !item.querySelector('.active') ) {
                u_audio.play();
                updateItemClasses(child);
                item.dataset.value = player(board);
                
                board = updateBoard(board, boardFields);
                await setWinOrLoss(board)
                
                board = await AIPlay();
                await setWinOrLoss(board)

                adv_audio.play();
            }
        })
        
        item.addEventListener('mouseover', () => {
            const child = item.querySelector(`.${player(board)}`);
            
            if ( !item.querySelector('.active') )
                child.classList.add('show');
        });
        
        item.addEventListener('mouseout', () => {
            const child = item.querySelector(`.${player(board)}`);
            
            if ( !item.querySelector('.active') )
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


async function setWinOrLoss(board) {
    const elementsIndex = await isTerminal(board);

    if (elementsIndex) {
        const value = boardFields[elementsIndex[0]].dataset.value;
        const className = (value === 'X') === slider.checked ? 'win' : 'loss';

        elementsIndex.forEach(index => {
            const element = boardFields[index].querySelector(`.${value}`);
            element.classList.add(className);
        }) 
    }
}


function updateItemClasses(item) {
    item.classList.remove('show', 'view', 'win', 'loss');
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

// `${url}/isTerminal/`
async function isTerminal(state) {
    const response = await fetch("http://127.0.0.1:8000/isTerminal/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ board: state })
    })

    const data = response.json()
    return data
}


async function getAIPlay(state) {
    const response = await fetch(`${url}/play/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ board: state })
    })

    const data = response.json()
    return data
}


function generateView() {
    const board_fields = document.querySelector("#board_fields");

    for (let index = 0; index < 9; index++) {
        board_fields.innerHTML += `
        <li class="play_field" data-value="">
            <svg class="X" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <line x1="30" y1="30" x2="70" y2="70" stroke-width="11" stroke-linecap="round" />
                <line x1="30" y1="70" x2="70" y2="30" stroke-width="11" stroke-linecap="round" />
            </svg>
            <svg class="O" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="23" stroke-width="10" fill="none"/>
            </svg>
        </li>`
    }
}
