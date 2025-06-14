# Attach to your TileMap node. Make sure tile layers for "platform", "ladder", "platform_edge" exist.
extends TileMap

func _ready():
    set_collision_layer(1)
    set_collision_mask(1)