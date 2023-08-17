const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const path = require('path');

// Serve the public folder
app.use(express.static(path.join(__dirname, '../public')));

const rooms = new Map();

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
        const data = JSON.parse(message);
        handleWebSocketMessage(ws, data);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        removeClientFromRoom(ws);
    });
});

function handleWebSocketMessage(ws, data) {
    console.log('Handling WebSocket message:', data);
    const { type, room, payload } = data;

    switch (type) {
        case 'createRoom':
            createRoom(ws, room);
            break;

        case 'joinRoom':
            joinRoom(ws, room);
            break;

        case 'addTodo':
            if (ws.room && rooms.has(ws.room)) {
                const { todos } = rooms.get(ws.room);
                const newTodo = { id: Date.now(), text: payload.text, state: 'incomplete' };
                todos.push(newTodo);
                broadcastTodos(ws.room);
            }
            break;

        case 'updateTodoState':
            if (ws.room && rooms.has(ws.room)) {
                const { todos } = rooms.get(ws.room);
                const updatedTodo = todos.find(todo => todo.text === payload.todoText);
                if (updatedTodo) {
                    updatedTodo.state = payload.newState;
                    broadcastTodos(ws.room);
                }
            }
            break;

        // Handle other message types as needed
    }
}

function createRoom(ws, room) {
    console.log('Creating room:', room);
    ws.room = room;
    rooms.set(room, { clients: [ws], todos: [] });
    sendJoinedMessage(ws, room);
}

function joinRoom(ws, room) {
    console.log('Joining room:', room);
    if (rooms.has(room)) {
        ws.room = room;
        rooms.get(room).clients.push(ws);
        sendJoinedMessage(ws, room);
    }
}

function sendJoinedMessage(ws, room) {
    console.log('Sending joined message to:', ws.room);
    const todos = rooms.get(ws.room).todos;
    const message = JSON.stringify({ type: 'joined', payload: { todos } });
    ws.send(message);
}

function removeClientFromRoom(ws) {
    if (ws.room && rooms.has(ws.room)) {
        const room = rooms.get(ws.room);
        room.clients = room.clients.filter((client) => client !== ws);
        if (room.clients.length === 0) {
            rooms.delete(ws.room);
        }
    }
}

function broadcast(room, data) {
    const roomObj = rooms.get(room);
    roomObj.clients.forEach((client) => {
        client.send(JSON.stringify(data));
    });
}

function broadcastTodos(room) {
    const todos = rooms.get(room).todos;
    broadcast(room, { type: 'todosUpdated', payload: todos });
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
