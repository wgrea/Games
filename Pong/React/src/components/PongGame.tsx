// src/components/PongGame.tsx

import React, { useRef, useEffect, useState } from "react";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 18;
const PADDLE_MARGIN = 24;
const BALL_SPEED = 6;

type Paddle = {
  y: number;
};

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const PongGame: React.FC = () => {
  // Paddles
  const [leftPaddle, setLeftPaddle] = useState<Paddle>({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  const [rightPaddle, setRightPaddle] = useState<Paddle>({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  // Ball
  const [ball, setBall] = useState<Ball>({
    x: GAME_WIDTH / 2 - BALL_SIZE / 2,
    y: GAME_HEIGHT / 2 - BALL_SIZE / 2,
    vx: BALL_SPEED,
    vy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  });
  // Score
  const [score, setScore] = useState<{ left: number; right: number }>({ left: 0, right: 0 });
  // Game running
  const [running, setRunning] = useState<boolean>(true);

  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for left paddle
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const mouseY = e.clientY - bounds.top;
    const newY = clamp(mouseY - PADDLE_HEIGHT / 2, 0, GAME_HEIGHT - PADDLE_HEIGHT);
    setLeftPaddle((paddle) => ({ ...paddle, y: newY }));
  };

  // Reset ball to the center
  const resetBall = (direction: 1 | -1) => {
    setBall({
      x: GAME_WIDTH / 2 - BALL_SIZE / 2,
      y: GAME_HEIGHT / 2 - BALL_SIZE / 2,
      vx: direction * BALL_SPEED,
      vy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    });
  };

  // Game loop
  useEffect(() => {
    if (!running) return;

    const step = () => {
      setBall((prev) => {
        let { x, y, vx, vy } = prev;

        // Ball position update
        x += vx;
        y += vy;

        // Top & bottom wall collision
        if (y <= 0) {
          y = 0;
          vy = -vy;
        }
        if (y + BALL_SIZE >= GAME_HEIGHT) {
          y = GAME_HEIGHT - BALL_SIZE;
          vy = -vy;
        }

        // Left paddle collision
        if (
          x <= PADDLE_MARGIN + PADDLE_WIDTH &&
          y + BALL_SIZE > leftPaddle.y &&
          y < leftPaddle.y + PADDLE_HEIGHT &&
          x >= PADDLE_MARGIN
        ) {
          x = PADDLE_MARGIN + PADDLE_WIDTH;
          vx = -vx * 1.05; // Slight speedup
          // Add a bit of "english"
          vy += (y + BALL_SIZE / 2 - (leftPaddle.y + PADDLE_HEIGHT / 2)) * 0.15;
        }

        // Right paddle collision
        if (
          x + BALL_SIZE >= GAME_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
          y + BALL_SIZE > rightPaddle.y &&
          y < rightPaddle.y + PADDLE_HEIGHT &&
          x + BALL_SIZE <= GAME_WIDTH - PADDLE_MARGIN + PADDLE_WIDTH
        ) {
          x = GAME_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
          vx = -vx * 1.05;
          vy += (y + BALL_SIZE / 2 - (rightPaddle.y + PADDLE_HEIGHT / 2)) * 0.15;
        }

        // Score
        if (x < 0) {
          setScore((score) => ({ ...score, right: score.right + 1 }));
          resetBall(1);
          return prev; // Don't update ball until reset
        }
        if (x + BALL_SIZE > GAME_WIDTH) {
          setScore((score) => ({ ...score, left: score.left + 1 }));
          resetBall(-1);
          return prev;
        }

        return { x, y, vx, vy };
      });

      // Move right (AI) paddle toward ball
      setRightPaddle((prev) => {
        const desiredY = clamp(ball.y + BALL_SIZE / 2 - PADDLE_HEIGHT / 2, 0, GAME_HEIGHT - PADDLE_HEIGHT);
        // AI speed
        const speed = 4;
        const diff = desiredY - prev.y;
        return {
          y: Math.abs(diff) < speed ? desiredY : prev.y + Math.sign(diff) * speed,
        };
      });

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPaddle.y, rightPaddle.y, running]);

  // Restart game
  const handleRestart = () => {
    setScore({ left: 0, right: 0 });
    setLeftPaddle({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
    setRightPaddle({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
    resetBall(Math.random() > 0.5 ? 1 : -1);
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="mb-4 text-2xl font-bold text-gray-800">Pong Game</div>
      <div className="mb-2 text-lg text-gray-700">
        {score.left} : {score.right}
      </div>
      <div
        ref={containerRef}
        className="relative bg-gray-900 rounded-lg shadow-md"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          cursor: "pointer",
          overflow: "hidden",
        }}
        onMouseMove={handleMouseMove}
        tabIndex={0}
      >
        {/* Left Paddle */}
        <div
          className="absolute bg-blue-500 rounded"
          style={{
            left: PADDLE_MARGIN,
            top: leftPaddle.y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
        />
        {/* Right Paddle */}
        <div
          className="absolute bg-red-500 rounded"
          style={{
            left: GAME_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
            top: rightPaddle.y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
        />
        {/* Ball */}
        <div
          className="absolute bg-yellow-400 rounded-full shadow"
          style={{
            left: ball.x,
            top: ball.y,
            width: BALL_SIZE,
            height: BALL_SIZE,
          }}
        />
        {/* Center line */}
        <div className="absolute left-1/2 top-0 w-1 h-full bg-gray-700 opacity-60" style={{ transform: "translateX(-50%)" }} />
      </div>
      <button
        className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
        onClick={handleRestart}
      >
        Restart
      </button>
      <p className="mt-2 text-sm text-gray-500">Move your mouse up/down over the game to control the blue paddle!</p>
    </div>
  );
};

export default PongGame;