extends Area2D

var on_ladder := false

func is_on_ladder() -> bool:
    return on_ladder

func _on_LadderDetector_body_entered(body):
    if body.is_in_group("ladder"):
        on_ladder = true

func _on_LadderDetector_body_exited(body):
    if body.is_in_group("ladder"):
        on_ladder = false