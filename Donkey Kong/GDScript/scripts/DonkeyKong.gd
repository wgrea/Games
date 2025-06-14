extends Node2D

export var barrel_scene: PackedScene
export var throw_interval := 2.0

var throw_timer := 0.0

func _process(delta):
    throw_timer -= delta
    if throw_timer <= 0:
        throw_barrel()
        throw_timer = throw_interval

func throw_barrel():
    var barrel = barrel_scene.instantiate()
    barrel.position = $BarrelSpawn.position
    get_parent().add_child(barrel)