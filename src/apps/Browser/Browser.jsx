import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Browser.css";

// ---- Game constants (tuned to feel close to the Chrome offline dino) ----
const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const GROUND_HEIGHT = 2;

const DINO_X = 50;
const DINO_WIDTH = 44;
const DINO_HEIGHT = 44;
const DUCK_HEIGHT = 26;

const GRAVITY = 2600; // px/s^2
const JUMP_VELOCITY = -760; // px/s

const BASE_SPEED = 300; // px/s
const MAX_SPEED = 640;
const SPEED_RAMP = 4; // px/s gained per point of score

const MIN_GAP = 260; // px, smallest horizontal gap between obstacles
const MAX_GAP = 520;

let obstacleId = 0;

function randomObstacle() {
    obstacleId += 1;
    const kinds = [
        { width: 17, height: 35, type: "cactus-small" },
        { width: 25, height: 50, type: "cactus-large" },
        { width: 46, height: 34, type: "cactus-cluster" },
        { width: 46, height: 34, type: "bird", flyHeight: 70 },
        { width: 46, height: 34, type: "bird", flyHeight: 20 },
    ];
    const pick = kinds[Math.floor(Math.random() * kinds.length)];
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
    const [started, setStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [isDucking, setIsDucking] = useState(false);
    const [renderTick, setRenderTick] = useState(0);
    const [night, setNight] = useState(false);

    // Mutable game state lives in refs so the rAF loop always reads fresh values
    // without needing to be re-created every render.
    const dinoYRef = useRef(0); // 0 = on the ground, negative = height above ground
    const velocityRef = useRef(0);
    const duckingRef = useRef(false);
    const obstaclesRef = useRef([]);
    const scoreRef = useRef(0);
    const speedRef = useRef(BASE_SPEED);
    const nextSpawnRef = useRef(MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP));
    const groundOffsetRef = useRef(0);
    const lastTimeRef = useRef(null);
    const rafRef = useRef(null);
    const startedRef = useRef(false);
    const gameOverRef = useRef(false);
    const cloudsRef = useRef([
        { x: 150, y: 30, size: 1 },
        { x: 350, y: 55, size: 0.7 },
        { x: 500, y: 20, size: 0.85 },
    ]);

    const resetGame = useCallback(() => {
        dinoYRef.current = 0;
        velocityRef.current = 0;
        duckingRef.current = false;
        obstaclesRef.current = [];
        scoreRef.current = 0;
        speedRef.current = BASE_SPEED;
        nextSpawnRef.current = MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP);
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
        if (dinoYRef.current === 0 && !duckingRef.current) {
            velocityRef.current = JUMP_VELOCITY;
            setIsJumping(true);
        }
    }, [startGame]);

    const setDuck = useCallback((value) => {
        duckingRef.current = value && dinoYRef.current === 0;
        setIsDucking(duckingRef.current);
    }, []);

    // ---- Main game loop ----
    useEffect(() => {
        function loop(timestamp) {
            if (!startedRef.current || gameOverRef.current) {
                rafRef.current = requestAnimationFrame(loop);
                return;
            }
            if (lastTimeRef.current == null) lastTimeRef.current = timestamp;
            let dt = (timestamp - lastTimeRef.current) / 1000;
            dt = Math.min(dt, 0.05); // clamp huge jumps (e.g. tab switch)
            lastTimeRef.current = timestamp;

            // Speed ramps up with score
            speedRef.current = Math.min(
                MAX_SPEED,
                BASE_SPEED + scoreRef.current * SPEED_RAMP
            );
            const speed = speedRef.current;

            // Dino physics
            velocityRef.current += GRAVITY * dt;
            dinoYRef.current += velocityRef.current * dt;
            if (dinoYRef.current > 0) {
                dinoYRef.current = 0;
                velocityRef.current = 0;
                setIsJumping(false);
            }

            // Ground scroll
            groundOffsetRef.current = (groundOffsetRef.current - speed * dt) % 40;

            // Clouds parallax
            cloudsRef.current = cloudsRef.current.map((c) => {
                let x = c.x - speed * 0.2 * dt;
                if (x < -60) x = GAME_WIDTH + Math.random() * 100;
                return { ...c, x };
            });

            // Obstacles move
            nextSpawnRef.current -= speed * dt;
            obstaclesRef.current = obstaclesRef.current
                .map((o) => ({ ...o, x: o.x - speed * dt }))
                .filter((o) => o.x + o.width > -10);

            if (nextSpawnRef.current <= 0) {
                obstaclesRef.current = [...obstaclesRef.current, randomObstacle()];
                nextSpawnRef.current = MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP);
            }

            // Score
            scoreRef.current += speed * dt * 0.1;
            const newScore = Math.floor(scoreRef.current);
            setScore(newScore);
            if (newScore > 0 && newScore % 500 === 0) {
                setNight((n) => (Math.floor(newScore / 500) % 2 === 1));
            }

            // Collision detection (slightly shrunk hitboxes, matching the original's forgiving feel)
            const dinoHeight = duckingRef.current ? DUCK_HEIGHT : DINO_HEIGHT;
            const dinoBottom = GAME_HEIGHT - GROUND_HEIGHT;
            const dinoTop = dinoBottom - dinoHeight + dinoYRef.current;
            const padX = 6;
            const padY = 6;
            const dRect = {
                left: DINO_X + padX,
                right: DINO_X + DINO_WIDTH - padX,
                top: dinoTop + padY,
                bottom: dinoTop + dinoHeight - padY,
            };

            let collided = false;
            for (const o of obstaclesRef.current) {
                const oBottom =
                    o.type === "bird" ? GAME_HEIGHT - GROUND_HEIGHT - o.flyHeight : GAME_HEIGHT - GROUND_HEIGHT;
                const oTop = oBottom - o.height;
                const oRect = {
                    left: o.x + 4,
                    right: o.x + o.width - 4,
                    top: oTop + 4,
                    bottom: oBottom - 2,
                };
                if (
                    dRect.left < oRect.right &&
                    dRect.right > oRect.left &&
                    dRect.top < oRect.bottom &&
                    dRect.bottom > oRect.top
                ) {
                    collided = true;
                    break;
                }
            }

            if (collided) {
                gameOverRef.current = true;
                startedRef.current = false;
                setGameOver(true);
                setHighScore((h) => Math.max(h, newScore));
            }

            setRenderTick((t) => t + 1);
            rafRef.current = requestAnimationFrame(loop);
        }

        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // ---- Input handling ----
    useEffect(() => {
        function onKeyDown(e) {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                jump();
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                setDuck(true);
            }
        }
        function onKeyUp(e) {
            if (e.code === "ArrowDown") {
                setDuck(false);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [jump, setDuck]);

    const handlePointerDown = () => jump();

    const dinoHeight = isDucking ? DUCK_HEIGHT : DINO_HEIGHT;
    const dinoBottom = GROUND_HEIGHT - dinoYRef.current;

    return (
        <div className="dino-game-container">
            <div className="dino-score">
                HI {String(highScore).padStart(5, "0")}&nbsp;&nbsp;
                {String(score).padStart(5, "0")}
            </div>

            <div
                className={`dino-game-area${night ? " night" : ""}`}
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                onPointerDown={handlePointerDown}
            >
                {cloudsRef.current.map((c, i) => (
                    <div
                        key={i}
                        className="dino-cloud"
                        style={{ left: c.x, top: c.y, transform: `scale(${c.size})` }}
                    />
                ))}

                <div
                    className={`dino-character${isJumping ? " jumping" : ""}${isDucking ? " ducking" : ""
                        }${!isJumping && startedRef.current && !gameOver ? " running" : ""}`}
                    style={{
                        left: DINO_X,
                        bottom: dinoBottom,
                        width: DINO_WIDTH,
                        height: dinoHeight,
                    }}
                />

                {obstaclesRef.current.map((o) => (
                    <div
                        key={o.id}
                        className={`dino-obstacle ${o.type}`}
                        style={{
                            left: o.x,
                            width: o.width,
                            height: o.height,
                            bottom: o.type === "bird" ? o.flyHeight : GROUND_HEIGHT,
                        }}
                    />
                ))}

                <div
                    className="dino-ground"
                    style={{ backgroundPositionX: groundOffsetRef.current }}
                />

                {!started && !gameOver && (
                    <div className="dino-instructions">
                        Press <kbd>Space</kbd> or tap to start
                    </div>
                )}

                {gameOver && (
                    <div className="dino-game-over-screen">
                        <div className="dino-game-over-title">G A M E &nbsp; O V E R</div>
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

            <div className="dino-footer-hint">
                <kbd>&uarr;</kbd> / <kbd>Space</kbd> jump &nbsp;&middot;&nbsp;{" "}
                <kbd>&darr;</kbd> duck
            </div>
        </div>
    );
}