import { useState, useEffect } from 'react'
import { States } from './enums/states'
import { ThemeProvider } from "@/components/theme-provider"

// Import Components and Socket
import CreateRoom from './components/createRoom'
import JoinRoom from './components/joinRoom'
import socket from './socketClient'
import DisplaySession from './components/session'
import Home from './components/home'
import { ModeToggle } from './components/mode-toggle'

interface Todo {
  id: number,
  text: string,
  state: string
}

function App() {
  const [index, setIndex] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [roomName, setRoomName] = useState('');

  function HandleWebSocketMessage(data: any) {
    const { type, payload } = data;

    switch (type) {
      case 'joined':
        console.log('Joined room:', payload.room);
        setRoomName(payload.room);
        setIndex(States.Session);
        setTodos(payload.todos);
        break;

      case 'todosUpdated':
        console.log('Received updated todos:', payload);
        setTodos(payload);
        console.log(todos)
        break;

      case 'error':
        console.log('Received error:', payload);
        alert(payload.message);
        break;
      // Handle other message types if needed
    }
  }

  const handleCheckboxChange = (todoText: string, newState: string) => {
    // Update the state and send changes to the server
    const updatedTodos: Todo[] = todos.map((todo) =>
      todo.text === todoText ? { ...todo, state: newState } : todo
    );
    setTodos(updatedTodos);
    // Send the updated state to the server if needed
    const message = JSON.stringify({ type: 'updateTodoState', room: roomName, payload: { todoText, newState } });
    socket.send(message);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    });

    socket.on('message', (message: any) => {
      console.log(message)
      const data = JSON.parse(message);
      HandleWebSocketMessage(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    });
  }, [])

  return (
    <ThemeProvider defaultTheme='light' storageKey="vite-ui-theme">
      <div className="App">
        <div className='absolute right-2 top-2'>
          <ModeToggle />
        </div>
        {index == 0 ?
          <Home fromChild={setIndex} />
          : null}
        {index == 1 ?
          <CreateRoom />
          : null}
        {index == 2 ?
          <JoinRoom />
          : null}
        {index == 3 ?
          <DisplaySession todos={todos} roomName={roomName} onCheckboxChange={handleCheckboxChange} />
          : null}
      </div >
    </ThemeProvider>
  )
}

export default App
