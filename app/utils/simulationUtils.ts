import Matter from "matter-js";
import { Engine, World } from "matter-js";

const changeGravityX = (engine: Engine, x: number) => {
  engine.world.gravity.x = x / 100;
};

const changeGravityY = (engine: Engine, y: number) => {
  engine.world.gravity.y = y / 100;
};

const changeWalled = (
  engine: Engine,
  ground: Matter.Body | null,
  ceiling: Matter.Body | null,
  leftWall: Matter.Body | null,
  rightWall: Matter.Body | null,
  value: boolean
) => {
  const bodies = [ground, ceiling, leftWall, rightWall].filter(
    Boolean
  ) as Matter.Body[];
  if (value) {
    World.add(engine.world, bodies);
  } else {
    World.remove(engine.world, bodies);
  }
};

export { changeGravityX, changeGravityY, changeWalled };
