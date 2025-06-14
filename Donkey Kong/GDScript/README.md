# Donkey Kong (1981) Arcade Clone - Godot (GDScript)

## Features
- **Player Controller:** Mario moves/jumps/climbs (KinematicBody2D).
- **Level Design:** Platforms/ladders as in original 25m stage (TileMap).
- **Enemy AI:** Donkey Kong throws barrels that roll, bounce, and hit the player.
- **Physics:** Barrels roll with gravity, bounce at edges, descend ladders.
- **Ladder System:** Player climbs when overlapping ladders (Area2D).
- **Score & Lives:** Track score for items/rescue, lives for hits.
- **Sprite Animation:** AnimatedSprite2D for Mario (run, jump, climb).

## How to Use
- Place `Player.gd` on a KinematicBody2D node with child AnimatedSprite2D and LadderDetector (Area2D).
- Place `Barrel.gd` on a RigidBody2D scene.
- Place `DonkeyKong.gd` on Donkey Kong node, set `barrel_scene`.
- Set up TileMap with "platform", "ladder", and "platform_edge" tiles (with collision shapes).
- Add HUD and GameManager nodes/scripts as shown.

## Controls
- Arrow keys: Move/Climb
- Space/Enter: Jump

## Notes
- Add items (score pickups) and Pauline as Area2D.
- Set up all signals and groupings as in scripts.
- Extend with sound, more polish as needed.

## To show file directory tree
Get-ChildItem -Recurse | ForEach-Object {
    $indent = '    ' * ($_.FullName.Split('\').Count - $PWD.Path.Split('\').Count)
    if ($_.PSIsContainer) { "$indent📁 $($_.Name)" }
    else { "$indent📄 $($_.Name)" }
}