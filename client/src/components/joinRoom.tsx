import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import socket from "../socketClient"

export default function JoinRoom() {
    const [roomName, setRoomName] = useState('');

    function HandleJoinRoom() {
        if (roomName.trim() !== '') {
            const message = JSON.stringify({ type: 'joinRoom', room: roomName });
            socket.send(message);
        }
    }

    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center p-8'>
            <Card className='flex flex-col items-center justify-center w-full md:w-[30%]'>
                <CardHeader>
                    <CardTitle>Join a room</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>Enter room name to join an existing session.</CardDescription>
                </CardContent>
                <div className='flex flex-col items-center justify-center my-5'>
                    <Input className='border-2 border-black rounded-md p-2 m-2' type='text' placeholder='Room name' onChange={e => setRoomName(e.target.value)} />
                    <Button onClick={() => {
                        HandleJoinRoom();
                    }}>Join a room</Button>
                </div>
            </Card>
        </div>
    )
}
