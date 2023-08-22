import socket from "@/socketClient"

interface Todo {
    id: number,
    text: string,
    state: string
}

interface Props {
    todos: Todo[];
    onCheckboxChange: (todoText: string, newState: string) => void;
    roomName: string;
}

export default function DisplayTodo(props: Props) {
    const { todos, onCheckboxChange, roomName } = props;

    function onRemove(todoText: string) {
        const message = JSON.stringify({ type: 'deleteTodo', room: roomName, payload: { todoText } });
        socket.send(message);
    }

    return (
        <div>
            {todos.map((todo) => (
                <div key={todo.id} className={`${todo.state} mx-8 flex flex-row my-2`}>
                    <input
                        type="checkbox"
                        checked={todo.state === 'completed'}
                        onChange={(e) => onCheckboxChange(todo.text, e.target.checked ? 'completed' : 'incomplete')}
                    />
                    <span className="mx-2">{todo.text}</span>
                    <div className="flex items-end w-full justify-end h-full">
                        <button className="border-2 rounded-2xl px-2" onClick={() => onRemove(todo.text)}>Remove</button>
                    </div>
                </div>
            ))}
        </div>
    )
}