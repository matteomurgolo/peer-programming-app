import PomodoroTimer from './pomodoroTimer';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from 'react'
import { Separator } from './ui/separator';

export default function Toolbar() {
    const [pomodoroTimer, setPomodoroTimer] = useState(false);
    const [spotifyPlayer, setSpotifyPlayer] = useState(false);

    return (
        <div className='w-full h-full'>
            <div className="flex items-center space-x-2 my-2">
                <div className="flex items-center space-x-2">
                    <Switch id="pomodoro-timer" checked={pomodoroTimer} onCheckedChange={(checked) => setPomodoroTimer(checked)} />
                    <Label htmlFor="pomodoro-timer">Pomodoro Timer</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="spotify" checked={spotifyPlayer} onCheckedChange={(checked) => setSpotifyPlayer(checked)} />
                    <Label htmlFor="spotify">Spotify</Label>
                </div>
            </div>
            <div className="flex flex-row space-x-10 items-center justify-between h-[80%]">
                {pomodoroTimer && <PomodoroTimer workDuration={25} breakDuration={5} />}
                {
                    (pomodoroTimer && spotifyPlayer) ? <Separator orientation='vertical' className='mx-2 h-[50%]' /> : <div></div>
                }
                {spotifyPlayer && <iframe src="https://open.spotify.com/embed/playlist/4P19lnnt265VEGjiQlgHBb?utm_source=generator" width="80%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>}
            </div>
        </div>
    );

}