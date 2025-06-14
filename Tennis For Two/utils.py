# utils.py

import pygame
from settings import *

def draw_court(screen):
    screen.fill(BLACK)
    pygame.draw.rect(screen, GREEN, (0, GROUND, WIDTH, HEIGHT - GROUND))
    pygame.draw.rect(screen, WHITE, (NET_X - NET_WIDTH//2, GROUND - NET_HEIGHT, NET_WIDTH, NET_HEIGHT))

def draw_scores(screen, paddle1, paddle2):
    font = pygame.font.SysFont('Arial', 30)
    score1 = font.render(str(paddle1.score), True, WHITE)
    score2 = font.render(str(paddle2.score), True, WHITE)
    screen.blit(score1, (WIDTH//4, 20))
    screen.blit(score2, (3*WIDTH//4, 20))

def draw_start_message(screen, ball):
    if not ball.in_play or (ball.in_play and not ball.is_moving()):
        font = pygame.font.SysFont('Arial', 24)
        msg = font.render("Press SPACE to serve", True, WHITE)
        screen.blit(msg, (WIDTH//2 - msg.get_width()//2, HEIGHT//2))