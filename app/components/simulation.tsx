"use client";
import { useEffect, useRef } from "react";
import ControlPanel from "./ControlPanel";
import Matter, {
  Bodies,
  // Common,
  Engine,
  Render,
  Runner,
  World,
} from "matter-js";
import "matter-wrap";
import {
  changeGravityX,
  changeGravityY,
  changeWalled,
} from "../utils/simulationUtils";

const particles: Matter.Body[] = [];

export const createRandomParticle = (
  scene: React.RefObject<HTMLDivElement | null>,
  engine: Matter.Engine,
  count: number
) => {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * scene.current!.clientWidth;
    const y = Math.random() * scene.current!.clientHeight;
    const radius = Math.random() * 10 + 5;
    const sides = Math.floor(Math.random() * 3) + 3;
    const angle = Math.random() * Math.PI * 2;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

    const particle = Bodies.polygon(x, y, sides, radius, {
      angle: angle,
      frictionAir: 0,
      force: {
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002,
      },
      render: {
        fillStyle: color,
      },
      restitution: 0.5,
    });

    particles.push(particle);

    World.add(engine.world, particle);
  }
};

interface SimulationProps {
  numberOfPolygons?: number;
  options: {
    walled: boolean;
  };
  style?: string;
}

const Simulation = ({
  numberOfPolygons = 0,
  options: { walled },
  style,
}: SimulationProps) => {
  Matter.use("matter-wrap");

  const tickness: number = 400;
  const scene = useRef<HTMLDivElement>(null);

  const engine = Engine.create();

  const createWall = (x: number, y: number, width: number, height: number) => {
    return Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
  };

  const ground = useRef<Matter.Body | null>(null);
  const ceiling = useRef<Matter.Body | null>(null);
  const leftWall = useRef<Matter.Body | null>(null);
  const rightWall = useRef<Matter.Body | null>(null);

  useEffect(() => {
    const render = Render.create({
      element: scene.current!,
      engine: engine,
      options: {
        width: scene.current!.clientWidth,
        height: scene.current!.clientHeight,
        background: "transparent",
        wireframes: false,
      },
    });

    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;

    ground.current = createWall(
      scene.current!.clientWidth / 2,
      scene.current!.clientHeight + tickness / 2,
      10000,
      tickness
    );

    ceiling.current = createWall(
      scene.current!.clientWidth / 2,
      -tickness / 2,
      10000,
      tickness
    );

    leftWall.current = createWall(
      -tickness / 2,
      scene.current!.clientHeight / 2,
      tickness,
      10000
    );

    rightWall.current = createWall(
      scene.current!.clientWidth + tickness / 2,
      scene.current!.clientHeight / 2,
      tickness,
      10000
    );

    if (walled) {
      World.add(engine.world, [
        ground.current!,
        ceiling.current!,
        leftWall.current!,
        rightWall.current!,
      ]);
    }

    const handleResize = () => {
      if (!scene.current) return;
      render.canvas.width = scene.current.clientWidth;
      render.canvas.height = scene.current.clientHeight;

      Matter.Body.setPosition(ground.current!, {
        x: scene.current.clientWidth / 2,
        y: scene.current.clientHeight + tickness / 2,
      });

      Matter.Body.setPosition(leftWall.current!, {
        x: -tickness / 2,
        y: scene.current.clientHeight / 2,
      });

      Matter.Body.setPosition(rightWall.current!, {
        x: scene.current.clientWidth + tickness / 2,
        y: scene.current.clientHeight / 2,
      });

      Matter.Body.setPosition(ceiling.current!, {
        x: scene.current.clientWidth / 2,
        y: -tickness / 2,
      });

      particles.forEach((particle) => {
        Matter.Body.set(particle, {
          plugin: {
            wrap: {
              min: {
                x: 0,
                y: 0,
              },
              max: {
                x: scene.current!.clientWidth,
                y: scene.current!.clientHeight,
              },
            },
          },
        });
      });
    };

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    window.addEventListener("resize", handleResize);

    const mouse = Matter.Mouse.create(render.canvas);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    World.add(engine.world, mouseConstraint);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      window.removeEventListener("resize", handleResize);
      Matter.Engine.clear(engine);
    };
  }, [numberOfPolygons, walled, engine]);

  const updateGravityX = (x: number) => {
    changeGravityX(engine, x);
  };
  const updateGravityY = (y: number) => {
    changeGravityY(engine, y);
  };

  const updateWalled = (value: boolean) => {
    changeWalled(
      engine,
      ground.current,
      ceiling.current,
      leftWall.current,
      rightWall.current,
      value
    );
  };

  const updateWrap = (value: boolean) => {
    particles.forEach((particle) => {
      if (value) {
        Matter.Body.set(particle, {
          plugin: {
            wrap: {
              min: {
                x: 0,
                y: 0,
              },
              max: {
                x: scene.current!.clientWidth,
                y: scene.current!.clientHeight,
              },
            },
          },
        });
      } else {
        Matter.Body.set(particle, {
          plugin: {
            wrap: null,
          },
        });
      }
    });
  };

  const createCircle = (radius: number) => {
    const x = Math.random() * scene.current!.clientWidth;
    const y = Math.random() * scene.current!.clientHeight;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

    const circle = Bodies.circle(x, y, radius, {
      frictionAir: 0,
      force: {
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002,
      },
      render: {
        fillStyle: color,
      },
      restitution: 0.5,
    });

    particles.push(circle);
    World.add(engine.world, circle);
  };

  const createRectangle = (width: number, height: number) => {
    const x = Math.random() * scene.current!.clientWidth;
    const y = Math.random() * scene.current!.clientHeight;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

    const rectangle = Bodies.rectangle(x, y, width, height, {
      frictionAir: 0,
      force: {
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002,
      },
      render: {
        fillStyle: color,
      },
      restitution: 0.5,
    });

    particles.push(rectangle);
    World.add(engine.world, rectangle);
  };

  const removeLastParticle = () => {
    if (particles.length > 0) {
      World.remove(engine.world, particles.pop()!);
    }
  };

  return (
    <>
      <div className={`h-screen text-colors-text ${style}`} ref={scene}></div>
      <ControlPanel
        scene={scene}
        engine={engine}
        updateGravityX={updateGravityX}
        updateGravityY={updateGravityY}
        toggleWalls={updateWalled}
        toggleWrap={updateWrap}
        createCircle={createCircle}
        createRectangle={createRectangle}
        removeLastParticle={removeLastParticle}
      />
    </>
  );
};

export default Simulation;
