import pygame
import random
from settings import *

class Ball:
    def __init__(self, sounds):
        self.sounds = sounds
        self.reset()
        self.trail = []
        self.max_trail = 10
        self.last_bounce = 0

    def reset(self):
        self.x = WIDTH // 4
        self.y = HEIGHT // 2
        self.vx = 0
        self.vy = 0
        self.in_play = False
        self.trail = []
        self.last_bounce = 0

    def launch(self):
        self.vx = random.choice([-5, 5])
        self.vy = random.uniform(-6, -4)
        self.in_play = True
        self.last_bounce = pygame.time.get_ticks()

    def is_moving(self):
        return abs(self.vx) > 0.1 or abs(self.vy) > 0.1

    def update(self, paddle1, paddle2):
        if not self.in_play:
            return

        # Add current position to trail
        self.trail.append((self.x, self.y))
        if len(self.trail) > self.max_trail:
            self.trail.pop(0)

        # Update position
        self.x += self.vx
        self.y += self.vy
        self.vy += GRAVITY

        current_time = pygame.time.get_ticks()

        # Ground collision
        if self.y + BALL_RADIUS >= GROUND:
            self.y = GROUND - BALL_RADIUS
            self.vy = -abs(self.vy) * BOUNCE
            self.vx *= 0.95
            if current_time - self.last_bounce > 100:
                self.sounds['bounce'].play()
                self.last_bounce = current_time
            if abs(self.vy) < 1:
                self.vy = 0

        # Ceiling collision
        if self.y - BALL_RADIUS < 0:
            self.y = BALL_RADIUS
            self.vy = abs(self.vy)
            if current_time - self.last_bounce > 100:
                self.sounds['bounce'].play()
                self.last_bounce = current_time

        # Paddle collisions
        for paddle in [paddle1, paddle2]:
            if (paddle.x < self.x < paddle.x + PADDLE_WIDTH and
                paddle.y < self.y < paddle.y + PADDLE_HEIGHT):
                relative_y = (self.y - paddle.y) / PADDLE_HEIGHT * 2 - 1
                self.vx = -self.vx * 1.1
                self.vy = relative_y * 5
                self.sounds['paddle'].play()
                self.last_bounce = current_time

        # Net collision
        if (NET_X - NET_WIDTH//2 < self.x < NET_X + NET_WIDTH//2 and
            self.y + BALL_RADIUS >= GROUND - NET_HEIGHT):
            self.vx = -self.vx * 0.8
            self.x += self.vx
            self.sounds['net'].play()
            self.last_bounce = current_time

        # Side out (scoring)
        if self.x < 0 or self.x > WIDTH:
            self.sounds['score'].play()
            if self.x < 0:
                paddle2.score += 1
            else:
                paddle1.score += 1
            self.reset()

    def draw(self, screen):
        # Draw trail
        for i, pos in enumerate(self.trail):
            alpha = int(255 * (i/len(self.trail)))
            color = (alpha, alpha, alpha)
            pygame.draw.circle(screen, color, (int(pos[0]), int(pos[1])), BALL_RADIUS//2)
        
        # Draw ball
        pygame.draw.circle(screen, WHITE, (int(self.x), int(self.y)), BALL_RADIUS)