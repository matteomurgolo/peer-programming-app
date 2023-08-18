
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
    console.log('WebSocket connection established.');
});

let currentRoom = ''; // Define currentRoom in a global scope

document.addEventListener('DOMContentLoaded', () => {
    const createRoomButton = document.getElementById('create-room');
    const joinRoomButton = document.getElementById('join-room');
    const addTodoButton = document.getElementById('add-todo'); // Define addTodoButton here
    const todoSection = document.getElementById('todo-section'); // Define todoSection

    todoSection.style.display = 'none'; // Hide the todo section initially

    createRoomButton.addEventListener('click', () => {
        const roomName = document.getElementById('room-name').value;
        if (roomName.trim() !== '') {
            // Send a message to the WebSocket server with the room name
            const message = JSON.stringify({ type: 'createRoom', room: roomName });
            socket.send(message);
            currentRoom = roomName;

            // Show the todo section
            showTodoSection(currentRoom);

            // Focus on the input field after creating a room and clear the value
            document.getElementById('todo-input').focus();
            document.getElementById('todo-input').select();
            document.getElementById('room-name').value = '';
        }
    });

    joinRoomButton.addEventListener('click', () => {
        const roomName = document.getElementById('room-name').value; // Get the room name from the input field

        // Send a message to the WebSocket server with the room name
        if (roomName.trim() !== '') {
            const message = JSON.stringify({ type: 'joinRoom', room: roomName });
            socket.send(message);
            currentRoom = roomName;
            showTodoSection(currentRoom);
            document.getElementById('todo-input').focus();
            document.getElementById('todo-input').select();
            document.getElementById('room-name').value = '';
        }
    });

    // Add an event listener for checkboxes
    document.addEventListener('click', (event) => {
        if (event.target.type === 'checkbox') {
            const todoText = event.target.nextElementSibling.textContent;
            const newState = event.target.checked ? 'completed' : 'incomplete';
            updateTodoState(todoText, newState);
        }
    });

    function updateTodoState(todoText, newState) {
        const message = JSON.stringify({ type: 'updateTodoState', room: currentRoom, payload: { todoText, newState } });
        socket.send(message);
    }

    // Define the addTodo function before using it
    function addTodo(text) {
        const message = JSON.stringify({ type: 'addTodo', room: currentRoom, payload: { text } });
        socket.send(message);
        document.getElementById('todo-input').value = '';
    }

    addTodoButton.addEventListener('click', () => {
        const todoText = document.getElementById('todo-input').value;
        if (todoText.trim() !== '') {
            addTodo(todoText);
        }
    });

    function showTodoSection(room) {
        document.getElementById('room-section').classList.add('hidden');
        todoSection.classList.remove('hidden');
        document.getElementById('current-room').textContent = room;
        todoSection.style.display = 'block'; // Show the todo section

        // Hide or show the "Add Todo" button based on room status
        addTodoButton.style.display = room ? 'block' : 'none';
    }
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    handleWebSocketMessage(data);
});

// Define the showTodoSection function outside of the DOMContentLoaded event
function showTodoSection(room) {
    document.getElementById('room-section').classList.add('hidden');
    document.getElementById('todo-section').classList.remove('hidden');
    document.getElementById('current-room').textContent = room;
}

function handleWebSocketMessage(data) {
    console.log('Handling WebSocket message:', data);
    const { type, payload } = data;

    switch (type) {
        case 'joined':
            console.log('Joined room:', payload.todos);
            renderTodos(payload.todos);
            showTodoSection(currentRoom);
            break;

        case 'todosUpdated':
            console.log('Received updated todos:', payload);
            renderTodos(payload);
            break;

        case 'error':
            console.log('Received error:', payload);
            alert(payload.message);
            break;
        // Handle other message types if needed
    }
}

function renderTodos(todoList) {
    const todoContainer = document.getElementById('todo-list');
    todoContainer.innerHTML = '';

    todoList.forEach((todo) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
        <input type="checkbox" class="checkbox" ${todo.state === 'completed' ? 'checked' : ''}>
        <span class="todo-text ${todo.state === 'completed' ? 'completed' : ''}">${todo.text}</span>
        <button class="delete-button"><i class="fas fa-trash"></i></button>
      `;
        todoContainer.appendChild(todoItem);
    });
}