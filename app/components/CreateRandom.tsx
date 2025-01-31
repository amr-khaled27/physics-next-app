"use client";
import { useState } from "react";
import { createRandomParticle } from "./simulation";

type CreateRandomProps = {
  scene: React.RefObject<HTMLDivElement | null>;
  engine: Matter.Engine;
};

const CreateRandom = ({ scene, engine }: CreateRandomProps) => {
  const [count, setCount] = useState<number>(10);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const rangeInput = form.querySelector(
          'input[type="range"]'
        ) as HTMLInputElement;
        const count = parseInt(rangeInput.value);

        createRandomParticle(scene, engine, count);
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="range"
        min="1"
        max="100"
        defaultValue="10"
        onChange={(e) => {
          setCount(parseInt(e.target.value));
        }}
        className="range"
      />
      <p className="text-center">Number of Particles: {count}</p>
      <button
        type="submit"
        className="bg-slate-600 p-4 mt-4 rounded-xl w-full hover:bg-slate-400 transition-colors duration-300 active:scale-95"
      >
        Create Random Partiles
      </button>
    </form>
  );
};

export default CreateRandom;
