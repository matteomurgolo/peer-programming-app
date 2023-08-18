const socket = new WebSocket('ws://localhost:3000');
import { createRoomHandle, joinRoomHandle, leaveRoomHandle } from "./components/room.js";
import { deleteTodoHandle, updateTodoStateHandle, addTodoHandle } from "./components/todos.js";
socket.addEventListener('open', () => {
    console.log('WebSocket connection established.');
});

let currentRoom = ''; // Define currentRoom in a global scope

document.addEventListener('DOMContentLoaded', () => {
    const todoSection = document.getElementById('todo-section'); // Define todoSection
    todoSection.style.display = 'none'; // Hide the todo section initially

    createRoomHandle(socket, currentRoom);
    joinRoomHandle(socket, currentRoom);
    leaveRoomHandle(socket, currentRoom);
    deleteTodoHandle(socket, currentRoom);
    updateTodoStateHandle(socket, currentRoom);
    addTodoHandle(socket, currentRoom);
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
            currentRoom = payload.room;
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