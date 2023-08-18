export function createRoomHandle(socket, currentRoom) {
    const createRoomButton = document.getElementById('create-room');
    const roomSection = document.getElementById('room-section');
    const leaveRoomButton = document.getElementById('leave-room');

    createRoomButton.addEventListener('click', () => {
        const roomName = document.getElementById('room-name').value;
        console.log('Creating room:', roomName);
        if (roomName.trim() !== '') {
            // Send a message to the WebSocket server with the room name
            const message = JSON.stringify({ type: 'createRoom', room: roomName });
            socket.send(message);
            currentRoom = roomName;
            // Show the todo section
            showTodoSection(currentRoom);
            roomSection.style.display = 'none';

            // Focus on the input field after creating a room and clear the value
            document.getElementById('todo-input').focus();
            document.getElementById('todo-input').select();
            document.getElementById('room-name').value = '';
            leaveRoomButton.style.display = 'block';
        }
    });

}

export function joinRoomHandle(socket, currentRoom) {
    const joinRoomButton = document.getElementById('join-room');
    const roomSection = document.getElementById('room-section');
    const leaveRoomButton = document.getElementById('leave-room');

    joinRoomButton.addEventListener('click', () => {
        const roomName = document.getElementById('room-name').value; // Get the room name from the input field
        // Check if the user entered a room name
        if (roomName.trim() !== '') {

            // Send a message to the WebSocket server with the room name
            const message = JSON.stringify({ type: 'joinRoom', room: roomName });
            socket.send(message);
            currentRoom = roomName;

            // Show the todo section
            showTodoSection(currentRoom);

            // Hide the room section
            roomSection.style.display = 'none';

            // Focus on the input field after joining a room and clear the value
            document.getElementById('todo-input').focus();
            document.getElementById('todo-input').select();
            document.getElementById('room-name').value = '';
            leaveRoomButton.style.display = 'block';
        }
    });
}

export function leaveRoomHandle(socket, currentRoom) {
    const leaveRoomButton = document.getElementById('leave-room');
    const roomSection = document.getElementById('room-section');
    const todoSection = document.getElementById('todo-section');

    leaveRoomButton.addEventListener('click', () => {
        const message = JSON.stringify({ type: 'leaveRoom', room: currentRoom });
        socket.send(message);
        currentRoom = '';
        todoSection.style.display = 'none';
        roomSection.style.display = 'block';
    });
}

function showTodoSection(currentRoom) {
    const todoSection = document.getElementById('todo-section');
    const addTodoButton = document.getElementById('add-todo');
    document.getElementById('room-section').classList.add('hidden');
    todoSection.classList.remove('hidden');
    document.getElementById('current-room').textContent = currentRoom;
    todoSection.style.display = 'block'; // Show the todo section

    // Hide or show the "Add Todo" button based on room status
    addTodoButton.style.display = currentRoom ? 'block' : 'none';
}