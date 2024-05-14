import {useEffect, useState} from "react";


export const DeathClock: React.FC = () => {
    const deathTimeMs: number = 1785719012438;
    const [remaining, setRemaining] = useState(deathTimeMs - Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemaining(deathTimeMs - Date.now());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return <div>The treatments failed. You have {Math.floor(remaining / 1000)} seconds to live.</div>
}