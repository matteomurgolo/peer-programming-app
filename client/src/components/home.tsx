// Import UI
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { States } from '@/enums/states'

export default function Home(props: any) {
    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center'>
            <h1 className='text-2xl m-10'>
                Welcome to TodoTemp!
            </h1>
            <p>The purpose of this tool is to be able to create a collaboration space in two clicks for a peer programming session.</p>
            <div className='flex md:flex-row items-center justify-center my-5 flex-col h-max'>
                <div className='md:mx-5 my-5 md:my-0 w-full md:w-[40%] h-full'>
                    <Card className='h-full flex flex-col justify-around'>
                        <CardHeader>
                            <CardTitle>Create a room</CardTitle>
                            <CardDescription>Enter room name to create a new session.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Once there are no more users in a room, the room and its contents are automatically destroyed.</p>
                            <p>Share the room name with your friend to collaborate.</p>
                        </CardContent>
                        <CardFooter className='flex flex-col'>
                            <Button onClick={() => props.fromChild(States.Create)}>Create a room</Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className='md:mx-5 w-full md:w-[40%] my-5 md:my-0 h-full'>
                    <Card className='h-full flex flex-col justify-around'>
                        <CardHeader>
                            <CardTitle>Join a room</CardTitle>
                            <CardDescription>Enter room name to join an existing session.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Join a room using the code shared with you by your partner.</p>
                        </CardContent>
                        <CardFooter className='flex flex-col'>
                            <Button onClick={() => props.fromChild(States.Join)}>Join a room</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}