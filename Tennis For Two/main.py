import pygame
import sys
from settings import *
from paddle import Paddle
from ball import Ball
from utils import *

class DummySound:
    def play(self): pass

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Tennis for Two (1958)")
    clock = pygame.time.Clock()
    
    # Create dummy sound objects
    sounds = {
        'paddle': DummySound(),
        'net': DummySound(),
        'score': DummySound(),
        'bounce': DummySound()
    }
    
    paddle1 = Paddle(50)
    paddle2 = Paddle(WIDTH - 50 - PADDLE_WIDTH)
    ball = Ball(sounds)

    running = True
    while running:
        clock.tick(FPS)
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and (not ball.in_play or not ball.is_moving()):
                    ball.launch()
                if event.key == pygame.K_r:
                    paddle1.score = 0
                    paddle2.score = 0
                    ball.reset()

        keys = pygame.key.get_pressed()
        if keys[pygame.K_w]: paddle1.move(True)
        if keys[pygame.K_s]: paddle1.move(False)
        if keys[pygame.K_UP]: paddle2.move(True)
        if keys[pygame.K_DOWN]: paddle2.move(False)
        
        ball.update(paddle1, paddle2)

        draw_court(screen)
        paddle1.draw(screen)
        paddle2.draw(screen)
        ball.draw(screen)
        draw_scores(screen, paddle1, paddle2)
        draw_start_message(screen, ball)
        
        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()