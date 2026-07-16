import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Browser.css";

/* ===========================
   GAME CONSTANTS
=========================== */

const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const GROUND_HEIGHT = 2;

const DINO_X = 50;
const DINO_WIDTH = 44;
const DINO_HEIGHT = 44;
const DUCK_HEIGHT = 26;

const GRAVITY = 2600;
const JUMP_VELOCITY = -760;

/*
    Difficulty

    Starts easy.

    Speed slowly increases every second.

    Maximum speed reached after roughly 2½ minutes.
*/

const BASE_SPEED = 195;
const MAX_SPEED = 540;
const SPEED_INCREASE_PER_SECOND = 3.0;

/*
    Obstacle spacing.

    Gap increases automatically as speed increases so
    the game stays fair.
*/

const BASE_MIN_GAP = 260;
const BASE_MAX_GAP = 520;

let obstacleId = 0;

/* ===========================
   OBSTACLE FACTORY
=========================== */

function randomObstacle() {
    obstacleId++;

    const obstacles = [
        {
            width: 17,
            height: 35,
            type: "cactus-small",
        },
        {
            width: 25,
            height: 50,
            type: "cactus-large",
        },
        {
            width: 46,
            height: 34,
            type: "cactus-cluster",
        },
        {
            width: 46,
            height: 34,
            type: "bird",
            flyHeight: 70,
        },
        {
            width: 46,
            height: 34,
            type: "bird",
            flyHeight: 20,
        },
    ];

    const pick =
        obstacles[Math.floor(Math.random() * obstacles.length)];

    return {
        id: obstacleId,
        x: GAME_WIDTH + 20,
        width: pick.width,
        height: pick.height,
        type: pick.type,
        flyHeight: pick.flyHeight || 0,
    };
}

export default function DinoGame() {

    /* ===========================
       REACT STATE
    =========================== */

    const [started, setStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const [isJumping, setIsJumping] = useState(false);
    const [isDucking, setIsDucking] = useState(false);

    const [renderTick, setRenderTick] = useState(0);

    const [night, setNight] = useState(false);

    /* ===========================
       GAME REFS
    =========================== */

    const dinoYRef = useRef(0);
    const velocityRef = useRef(0);

    const duckingRef = useRef(false);

    const obstaclesRef = useRef([]);

    const scoreRef = useRef(0);

    const speedRef = useRef(BASE_SPEED);

    /*
        NEW

        Time survives every frame.

        Difficulty depends on this instead
        of depending on score.
    */

    const elapsedTimeRef = useRef(0);

    const nextSpawnRef = useRef(BASE_MIN_GAP);

    const groundOffsetRef = useRef(0);

    const lastTimeRef = useRef(null);

    const rafRef = useRef(null);

    const startedRef = useRef(false);

    const gameOverRef = useRef(false);

    const cloudsRef = useRef([
        {
            x: 150,
            y: 30,
            size: 1,
        },
        {
            x: 350,
            y: 55,
            size: 0.7,
        },
        {
            x: 500,
            y: 20,
            size: 0.85,
        },
    ]);
    /* ===========================
   GAME CONTROL
=========================== */

    const resetGame = useCallback(() => {

        dinoYRef.current = 0;
        velocityRef.current = 0;

        duckingRef.current = false;

        obstaclesRef.current = [];

        scoreRef.current = 0;

        speedRef.current = BASE_SPEED;

        elapsedTimeRef.current = 0;

        nextSpawnRef.current =
            BASE_MIN_GAP +
            Math.random() * (BASE_MAX_GAP - BASE_MIN_GAP);

        groundOffsetRef.current = 0;

        lastTimeRef.current = null;

        gameOverRef.current = false;

        setScore(0);

        setGameOver(false);

        setIsJumping(false);

        setIsDucking(false);

        setNight(false);

    }, []);

    const startGame = useCallback(() => {

        resetGame();

        startedRef.current = true;

        setStarted(true);

    }, [resetGame]);

    const jump = useCallback(() => {

        if (!startedRef.current) {
            startGame();
            return;
        }

        if (gameOverRef.current) {
            startGame();
            return;
        }

        if (
            dinoYRef.current === 0 &&
            !duckingRef.current
        ) {
            velocityRef.current = JUMP_VELOCITY;
            setIsJumping(true);
        }

    }, [startGame]);

    const setDuck = useCallback((value) => {

        duckingRef.current =
            value &&
            dinoYRef.current === 0;

        setIsDucking(duckingRef.current);

    }, []);

    /* ===========================
       DIFFICULTY
    =========================== */

    function getCurrentSpeed() {

        /*
            Speed increases every second.
    
            Starts slow.
    
            Slowly reaches MAX_SPEED.
    
            Much smoother than
            BASE_SPEED + score * SPEED_RAMP.
        */

        return Math.min(

            MAX_SPEED,

            BASE_SPEED +

            elapsedTimeRef.current *
            SPEED_INCREASE_PER_SECOND

        );

    }

    function getObstacleGap(speed) {

        /*
            Faster game = larger gap.
    
            Gives player enough reaction time.
        */

        const factor =
            (speed - BASE_SPEED) /
            (MAX_SPEED - BASE_SPEED);

        const minGap =
            BASE_MIN_GAP +
            factor * 120;

        const maxGap =
            BASE_MAX_GAP +
            factor * 180;

        return (

            minGap +

            Math.random() *
            (maxGap - minGap)

        );

    }useEffect(() => {

    function loop(timestamp) {

        if (!startedRef.current || gameOverRef.current) {
            rafRef.current = requestAnimationFrame(loop);
            return;
        }

        if (lastTimeRef.current === null) {
            lastTimeRef.current = timestamp;
        }

        let dt = (timestamp - lastTimeRef.current) / 1000;

        lastTimeRef.current = timestamp;

        dt = Math.min(dt, 0.05);

        /* ===========================
           DIFFICULTY
        =========================== */

        elapsedTimeRef.current += dt;

        speedRef.current = getCurrentSpeed();

        const speed = speedRef.current;

        /* ===========================
           DINO PHYSICS
        =========================== */

        velocityRef.current += GRAVITY * dt;

        dinoYRef.current += velocityRef.current * dt;

        if (dinoYRef.current > 0) {

            dinoYRef.current = 0;

            velocityRef.current = 0;

            setIsJumping(false);
        }

        /* ===========================
           GROUND
        =========================== */

        groundOffsetRef.current =
            (groundOffsetRef.current - speed * dt) % 40;

        /* ===========================
           CLOUDS
        =========================== */

        cloudsRef.current =
            cloudsRef.current.map(cloud => {

                let x =
                    cloud.x -
                    speed *
                    0.20 *
                    dt;

                if (x < -60) {

                    x =
                        GAME_WIDTH +
                        Math.random() * 120;

                }

                return {
                    ...cloud,
                    x,
                };

            });

        /* ===========================
           OBSTACLES
        =========================== */

        nextSpawnRef.current -= speed * dt;

        obstaclesRef.current =
            obstaclesRef.current
                .map(obstacle => ({

                    ...obstacle,

                    x:
                        obstacle.x -
                        speed * dt,

                }))
                .filter(
                    obstacle =>
                        obstacle.x +
                            obstacle.width >
                        -20
                );

        if (nextSpawnRef.current <= 0) {

            obstaclesRef.current = [

                ...obstaclesRef.current,

                randomObstacle(),

            ];

            nextSpawnRef.current =
                getObstacleGap(speed);

        }

        /* ===========================
           SCORE
        =========================== */

        scoreRef.current += dt * 10;

        const newScore =
            Math.floor(scoreRef.current);

        setScore(newScore);

        if (
            newScore > 0 &&
            newScore % 500 === 0
        ) {
            setNight(
                Math.floor(newScore / 500) %
                    2 ===
                    1
            );
        }

        /* ---------- Continue with Collision Detection ---------- */
        /* ===========================
   COLLISION DETECTION
=========================== */

const dinoHeight = duckingRef.current
    ? DUCK_HEIGHT
    : DINO_HEIGHT;

const dinoBottom = GAME_HEIGHT - GROUND_HEIGHT;

const dinoTop =
    dinoBottom -
    dinoHeight +
    dinoYRef.current;

/*
    Smaller hitbox like Chrome Dino.
*/

const dinoRect = {

    left: DINO_X + 6,

    right:
        DINO_X +
        DINO_WIDTH -
        6,

    top: dinoTop + 6,

    bottom:
        dinoTop +
        dinoHeight -
        6,

};

let collision = false;

for (const obstacle of obstaclesRef.current) {

    const obstacleBottom =
        obstacle.type === "bird"
            ? GAME_HEIGHT -
              GROUND_HEIGHT -
              obstacle.flyHeight
            : GAME_HEIGHT -
              GROUND_HEIGHT;

    const obstacleTop =
        obstacleBottom -
        obstacle.height;

    const obstacleRect = {

        left: obstacle.x + 4,

        right:
            obstacle.x +
            obstacle.width -
            4,

        top:
            obstacleTop +
            4,

        bottom:
            obstacleBottom -
            2,

    };

    if (

        dinoRect.left <
            obstacleRect.right &&

        dinoRect.right >
            obstacleRect.left &&

        dinoRect.top <
            obstacleRect.bottom &&

        dinoRect.bottom >
            obstacleRect.top

    ) {

        collision = true;

        break;

    }

}

/* ===========================
   GAME OVER
=========================== */

if (collision) {

    gameOverRef.current = true;

    startedRef.current = false;

    setGameOver(true);

    setHighScore((previous) =>
        Math.max(previous, newScore)
    );

}

/* ===========================
   FORCE RE-RENDER
=========================== */

setRenderTick((previous) => previous + 1);

rafRef.current =
    requestAnimationFrame(loop);

}

rafRef.current =
    requestAnimationFrame(loop);

return () => {

    if (rafRef.current) {

        cancelAnimationFrame(
            rafRef.current
        );

    }

};

}, []);/* ===========================================================
   INPUT HANDLING
=========================================================== */

useEffect(() => {

    function onKeyDown(e) {

        if (
            e.repeat
        ) return;

        switch (e.code) {

            case "Space":
            case "ArrowUp":

                e.preventDefault();

                jump();

                break;

            case "ArrowDown":

                e.preventDefault();

                setDuck(true);

                break;

            default:
                break;
        }

    }

    function onKeyUp(e) {

        if (
            e.code === "ArrowDown"
        ) {

            setDuck(false);

        }

    }

    window.addEventListener(
        "keydown",
        onKeyDown
    );

    window.addEventListener(
        "keyup",
        onKeyUp
    );

    return () => {

        window.removeEventListener(
            "keydown",
            onKeyDown
        );

        window.removeEventListener(
            "keyup",
            onKeyUp
        );

    };

}, [jump, setDuck]);

/* ===========================================================
   POINTER SUPPORT
=========================================================== */

const handlePointerDown = () => {

    jump();

};

/* ===========================================================
   DERIVED VALUES
=========================================================== */

const dinoHeight =
    isDucking
        ? DUCK_HEIGHT
        : DINO_HEIGHT;

const dinoBottom =
    GROUND_HEIGHT -
    dinoYRef.current;
    return (
    <div className="dino-game-container">

        {/* ================= SCORE ================= */}

        <div className="dino-score">
            HI {String(highScore).padStart(5, "0")}
            &nbsp;&nbsp;
            {String(score).padStart(5, "0")}
        </div>

        {/* ================= GAME ================= */}

        <div
            className={`dino-game-area${night ? " night" : ""}`}
            style={{
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
            }}
            onPointerDown={handlePointerDown}
        >

            {/* ================= CLOUDS ================= */}

            {cloudsRef.current.map((cloud, index) => (

                <div
                    key={index}
                    className="dino-cloud"
                    style={{
                        left: cloud.x,
                        top: cloud.y,
                        transform: `scale(${cloud.size})`,
                    }}
                />

            ))}

            {/* ================= DINO ================= */}

            <div
                className={`dino-character
                    ${isJumping ? " jumping" : ""}
                    ${isDucking ? " ducking" : ""}
                    ${
                        !isJumping &&
                        started &&
                        !gameOver
                            ? " running"
                            : ""
                    }`}
                style={{
                    left: DINO_X,
                    bottom: dinoBottom,
                    width: DINO_WIDTH,
                    height: dinoHeight,
                }}
            />

            {/* ================= OBSTACLES ================= */}

            {obstaclesRef.current.map((obstacle) => (

                <div
                    key={obstacle.id}
                    className={`dino-obstacle ${obstacle.type}`}
                    style={{
                        left: obstacle.x,
                        width: obstacle.width,
                        height: obstacle.height,
                        bottom:
                            obstacle.type === "bird"
                                ? obstacle.flyHeight
                                : GROUND_HEIGHT,
                    }}
                />

            ))}            {/* ================= GROUND ================= */}

            <div
                className="dino-ground"
                style={{
                    backgroundPositionX: groundOffsetRef.current,
                }}
            />

            {/* ================= START SCREEN ================= */}

            {!started && !gameOver && (

                <div className="dino-instructions">

                    Press <kbd>Space</kbd> or tap to start

                </div>

            )}

            {/* ================= GAME OVER ================= */}

            {gameOver && (

                <div className="dino-game-over-screen">

                    <div className="dino-game-over-title">

                        G A M E&nbsp;&nbsp;O V E R

                    </div>

                    <button
                        onClick={(e) => {

                            e.stopPropagation();

                            startGame();

                        }}
                    >
                        Restart
                    </button>

                    <div className="dino-instructions">

                        or press <kbd>Space</kbd>

                    </div>

                </div>

            )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="dino-footer-hint">

            <kbd>↑</kbd> / <kbd>Space</kbd>
            &nbsp;&middot;&nbsp;
            <kbd>↓</kbd> Duck

        </div>

    </div>
);
}