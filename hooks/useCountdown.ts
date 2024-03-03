import { useEffect, useState } from "react";

export default function useCountdown() {
    const [secondsLeft, setSecondsLeft] = useState(300)
    useEffect(() => {
        if (secondsLeft <= 0) {
            return
        }

        if (secondsLeft > 0) { // Only start countdown if secondsLeft is positive
            const timeout = setTimeout(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [secondsLeft])

    const start = (seconds: number) => {
        if (seconds > 0) {
            setSecondsLeft(seconds);
        }
    }

    return { secondsLeft, start }
}