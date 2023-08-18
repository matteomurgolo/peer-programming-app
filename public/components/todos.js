export function addTodoHandle(socket, currentRoom) {
    const addTodoButton = document.getElementById('add-todo');
    addTodoButton.addEventListener('click', () => {
        const todoText = document.getElementById('todo-input').value;
        if (todoText.trim() !== '') {
            addTodoToServer(socket, todoText, currentRoom);
        }
    });
}

function addTodoToServer(socket, todoText, currentRoom) {
    const message = JSON.stringify({ type: 'addTodo', room: currentRoom, payload: { text: todoText } });
    socket.send(message);
    document.getElementById('todo-input').value = '';
}


export function deleteTodoHandle(socket, currentRoom) {
    document.addEventListener('click', (event) => {
        if (event.target.className === 'delete-button') {
            const todoText = event.target.previousElementSibling.textContent;
            const message = JSON.stringify({ type: 'deleteTodo', room: currentRoom, payload: { todoText } });
            socket.send(message);
        }
    });
}

export function updateTodoStateHandle(socket, currentRoom) {
    document.getElementById('current-room').textContent = currentRoom;
    document.addEventListener('click', (event) => {
        if (event.target.type === 'checkbox') {
            const todoText = event.target.nextElementSibling.textContent;
            const newState = event.target.checked ? 'completed' : 'incomplete';
            updateTodoState(socket, todoText, newState, currentRoom);
        }
    });
}

function updateTodoState(socket, todoText, newState, currentRoom) {
    const message = JSON.stringify({ type: 'updateTodoState', room: currentRoom, payload: { todoText, newState } });
    socket.send(message);
}