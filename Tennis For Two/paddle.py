# paddle.py

import pygame
from settings import *

class Paddle:
    def __init__(self, x):
        self.x = x
        self.y = GROUND - PADDLE_HEIGHT // 2
        self.speed = 5
        self.score = 0

    def move(self, up):
        if up and self.y - self.speed > 0:
            self.y -= self.speed
        elif not up and self.y + self.speed + PADDLE_HEIGHT < GROUND:
            self.y += self.speed

    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, (self.x, self.y, PADDLE_WIDTH, PADDLE_HEIGHT))