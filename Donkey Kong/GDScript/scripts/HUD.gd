extends CanvasLayer

onready var score_label := $ScoreLabel
onready var lives_label := $LivesLabel

func update_score(score):
    score_label.text = "SCORE: %d" % score

func update_lives(lives):
    lives_label.text = "LIVES: %d" % lives