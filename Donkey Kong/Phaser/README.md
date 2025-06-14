```markdown
# Donkey Kong (1981) Arcade Clone - Phaser

## Features

- **Player Controller**
  - Move left/right, jump, and climb ladders
  - Keyboard controls via Phaser's input

- **Level Design**
  - Platforms and ladders placed via tilemap
  - Arcade Physics for collisions

- **Enemy AI**
  - Donkey Kong throws barrels
  - Barrels roll, bounce, and drop down ladders

- **Physics & Collision**
  - Barrels obey gravity and reverse at edges
  - All collisions use Arcade Physics

- **Ladder System**
  - Player can climb when overlapping ladder
  - Climbing disables gravity, uses vertical velocity

- **Score & Lives**
  - Collect items and rescue Pauline for points
  - Lose lives on barrel collision

- **Sprite Animation**
  - Mario animated with Phaser's frame-based system

## How To Use

- Requires Phaser 3.
- Place a Tiled JSON map named `25m.json` and the referenced sprites in `assets/`.
- Run with a local server.

## Controls

- Arrow keys: Move/jump/climb

## Extending

- Add more items, improve DK logic, polish visuals as needed.
```

## Start Server
python -m http.server 8080

http://localhost:8080/