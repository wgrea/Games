extends RigidBody2D

export var roll_speed := 80
export var gravity := 500
export var bounce_impulse := 140

var moving_left := true

onready var anim := $AnimatedSprite2D

func _ready():
    set_fixed_process(true)

func _integrate_forces(state):
    var v = state.linear_velocity
    v.y += gravity * state.step
    if moving_left:
        v.x = -roll_speed
    else:
        v.x = roll_speed
    state.linear_velocity = v

func _on_Barrel_body_entered(body):
    if body.is_in_group("platform_edge"):
        moving_left = not moving_left
        $AnimatedSprite2D.flip_h = not $AnimatedSprite2D.flip_h
    elif body.is_in_group("player"):
        body.die()
        queue_free()
    elif body.is_in_group("ladder"):
        # 25% chance of descending ladder
        if randi() % 4 == 0:
            position.x = body.position.x
            moving_left = false
            set_axis_velocity(Vector2(0, bounce_impulse))