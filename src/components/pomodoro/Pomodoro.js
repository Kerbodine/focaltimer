import React, { useEffect, useRef, useState } from "react";
import { usePomodoro } from "../../contexts/PomodoroContext";
import { HiPause, HiPlay, HiXCircle } from "react-icons/hi";
import PomodoroTime from "./PomodoroTime";
import { CircularProgressbar } from "react-circular-progressbar";
import PomodoroCard from "./PomodoroCard";
import TagSelector from "./TagSelector";

const Pomodoro = () => {
  // const settingsInfo = useContext(SettingsContext);
  const { workMinutes, breakMinutes, mode, setMode, getPomodoros } =
    usePomodoro();

  const [isPaused, setIsPaused] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [pomodoros, setPomodoros] = useState([]);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {
    function switchMode() {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds =
        (nextMode === "work" ? workMinutes : breakMinutes) * 60;
      setMode(nextMode);
      modeRef.current = nextMode;
      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
      setIsPaused(true);
      isPausedRef.current = true;
    }

    secondsLeftRef.current = workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [workMinutes, breakMinutes, setMode]);

  const resetTimer = () => {
    secondsLeftRef.current =
      modeRef.current === "work" ? workMinutes * 60 : breakMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 1000) / 10;

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  useEffect(() => {
    async function fetchData() {
      const previousPomodoros = await getPomodoros();
      setPomodoros(previousPomodoros);
    }
    fetchData();
  }, [getPomodoros]);

  return (
    <div>
      <div className="relative flex aspect-square w-full flex-col items-center justify-center rounded-full">
        <PomodoroTime
          minutes={minutes}
          seconds={seconds}
          time={secondsLeftRef.current}
          mode={modeRef.current}
          isPaused={isPausedRef.current}
        />
        <TagSelector />
        {/* Create circular progress bar with svg */}
        <div className="absolute -z-10 h-full w-full">
          <CircularProgressbar value={percentage} strokeWidth={4} />
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {isPaused ? (
          <button
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-accent hover:text-white"
          >
            <HiPlay className="-ml-1 text-xl" />
            Start
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setIsPaused(true);
                isPausedRef.current = true;
              }}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-500 hover:text-white"
            >
              <HiPause className="-ml-1 text-xl" />
              Pause
            </button>
            <button
              onClick={resetTimer}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-400 hover:text-white"
            >
              <HiXCircle className="-ml-1 text-xl" />
              Reset
            </button>
          </>
        )}
      </div>
      <ul className="mt-8 space-y-1">
        {JSON.stringify(pomodoros)}
        {pomodoros.map((pomodoro) => (
          <PomodoroCard />
        ))}
      </ul>
    </div>
  );
};

export default Pomodoro;
