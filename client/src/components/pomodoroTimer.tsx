import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface Props {
    workDuration?: number;   // in minutes, default 25
    breakDuration?: number;  // in minutes, default 5
}

enum TimerState {
    WORK,
    BREAK,
}

export default function PomodoroTimer(props: Props) {
    const { workDuration = 25, breakDuration = 5 } = props;
    const [minutes, setMinutes] = useState<number>(workDuration);
    const [seconds, setSeconds] = useState<number>(0);
    const [timerState, setTimerState] = useState<TimerState>(TimerState.WORK);
    const [isActive, setIsActive] = useState<boolean>(false);

    let intervalId: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (isActive) {
            intervalId = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (seconds === 0 && minutes === 0) {
                    if (timerState === TimerState.WORK) {
                        setTimerState(TimerState.BREAK);
                        setMinutes(breakDuration);
                    } else if (timerState === TimerState.BREAK) {
                        setTimerState(TimerState.WORK);
                        setMinutes(workDuration);
                    }
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }, 1000);
        } else if (intervalId) {
            clearInterval(intervalId);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isActive, seconds, minutes, timerState, workDuration, breakDuration]);

    return (
        <div>
            <div className='my-2'>
                <span className='text-3xl'>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</span>
            </div>
            <div className='space-x-2 my-2'>
                <Button onClick={() => setIsActive(!isActive)} className='h-8'>
                    {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={() => {
                    setIsActive(false);
                    setTimerState(TimerState.WORK);
                    setMinutes(workDuration);
                    setSeconds(0);
                }}
                    className='h-8'
                >
                    Reset
                </Button>
            </div>
        </div>
    );
};