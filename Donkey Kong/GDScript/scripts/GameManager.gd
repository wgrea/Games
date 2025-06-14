extends Node

onready var player := $Player

func _ready():
    player.connect("score_changed", self, "_on_score_changed")
    player.connect("lives_changed", self, "_on_lives_changed")

func _on_score_changed(new_score):
    $HUD.update_score(new_score)

func _on_lives_changed(new_lives):
    $HUD.update_lives(new_lives)
    if new_lives <= 0:
        get_tree().change_scene("res://GameOver.tscn")

func on_item_collected(points):
    player.add_score(points)

func on_save_pauline():
    player.add_score(5000)
    # End level logic