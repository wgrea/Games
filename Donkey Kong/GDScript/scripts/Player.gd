extends KinematicBody2D

# Player movement parameters
export var speed := 120
export var jump_force := -260
export var gravity := 600
export var ladder_speed := 90
export var max_lives := 3

var velocity := Vector2.ZERO
var on_ladder := false
var climbing := false
var lives := max_lives
var score := 0

onready var anim := $AnimatedSprite2D
onready var ladder_detector := $LadderDetector

func _physics_process(delta):
    var input_vec = Vector2.ZERO
    input_vec.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
    on_ladder = ladder_detector.is_on_ladder()

    if on_ladder and abs(Input.get_action_strength("ui_up") - Input.get_action_strength("ui_down")) > 0:
        climbing = true
    elif not on_ladder or (on_ladder and Input.is_action_just_released("ui_up") and Input.is_action_just_released("ui_down")):
        climbing = false

    if climbing:
        velocity.y = (Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")) * ladder_speed
        velocity.x = 0
        anim.play("climb")
    else:
        velocity.y += gravity * delta
        velocity.x = input_vec.x * speed
        if is_on_floor():
            if Input.is_action_just_pressed("ui_accept"):
                velocity.y = jump_force
                anim.play("jump")
            elif input_vec.x != 0:
                anim.play("run")
            else:
                anim.play("idle")
        else:
            if not climbing:
                anim.play("jump")

    velocity = move_and_slide(velocity, Vector2.UP)
    if velocity.x != 0:
        anim.flip_h = velocity.x < 0

func die():
    lives -= 1
    # Respawn logic here (reset position, etc.)
    if lives <= 0:
        get_tree().change_scene("res://GameOver.tscn")

func add_score(points):
    score += points