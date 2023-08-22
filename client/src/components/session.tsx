import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import socket from '../socketClient'

import DisplayTodo from './todos'

interface Todo {
    id: number,
    text: string,
    state: string
}

interface Props {
    roomName: string;
    todos: Todo[];
    onCheckboxChange: (todoText: string, newState: string) => void;
}

export default function DisplaySession(props: Props) {
    const { roomName, todos, onCheckboxChange } = props;
    const [todoText, setTodoText] = useState('');

    function HandleAddTodo() {
        const message = JSON.stringify({ type: 'addTodo', room: roomName, payload: { text: todoText } });
        socket.send(message);
        setTodoText('');
    }

    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center'>
            <Card className='flex flex-col items-center w-[80%] h-[80%]'>
                <CardHeader className='flex flex-col items-center'>
                    <CardTitle>Collaborative session</CardTitle>
                    <CardDescription>Code : {roomName}</CardDescription>
                </CardHeader>
                <CardContent className='w-full flex flex-col justify-start'>
                    <hr
                        className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
                    <DisplayTodo todos={todos} onCheckboxChange={onCheckboxChange} roomName={roomName} />
                </CardContent>
                <CardFooter className='w-full h-full'>
                    <div className='flex flex-row items-end justify-end w-full h-full'>
                        <Input onChange={e => setTodoText(e.target.value)} value={todoText} className='mx-8' placeholder='Enter a todo' />
                        <Button onClick={HandleAddTodo} >Add</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}