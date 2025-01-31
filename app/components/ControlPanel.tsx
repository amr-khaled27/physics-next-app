"use client";
import { useState } from "react";
import CreateShape from "./CreateShape";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { createRandomParticle } from "./simulation";

type ControlPanelProps = {
  scene: React.RefObject<HTMLDivElement | null>;
  engine: Matter.Engine;
  updateGravityX: (x: number) => void;
  updateGravityY: (y: number) => void;
  toggleWalls: (value: boolean) => void;
  toggleWrap: (value: boolean) => void;
  createCircle: (radius: number) => void;
  createRectangle: (width: number, height: number) => void;
  removeLastParticle: () => void;
};

const ControlPanel = ({
  scene,
  engine,
  updateGravityX,
  updateGravityY,
  toggleWalls,
  toggleWrap,
  createCircle,
  createRectangle,
  removeLastParticle,
}: ControlPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={
          `w-full h-full fixed top-0 left-0 duration-300 ` +
          (isOpen ? "bg-black/50 backdrop-blur-sm" : "bg-transparent -z-10")
        }
      ></div>
      <div
        className={
          `bg-slate-500 absolute left-0 top-0 min-h-screen w-[300px] duration-300 p-4 text-white ` +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <button
          title={isOpen ? "Close panel" : "Open panel"}
          onClick={clickHandler}
          className="w-12 h-12 centered text-white rounded-xl hover:bg-slate-700 duration-300 bg-slate-400 -right-14 absolute top-1/2 -translate-y-1/2"
        >
          {isOpen ? (
            <FontAwesomeIcon icon={faAngleLeft} />
          ) : (
            <FontAwesomeIcon icon={faAngleRight} />
          )}
        </button>

        <div className="flex flex-col gap-4">
          <button
            className="bg-slate-600 p-4 rounded-xl w-full hover:bg-slate-400 transition-colors duration-300 active:scale-95"
            onClick={() => createRandomParticle(scene, engine)}
          >
            create random particle
          </button>

          <div className="flex flex-col">
            <p className="text-center">Set Gravity</p>
          </div>
          <div className="flex gap-4">
            <p>X:</p>
            <input
              type="range"
              min="-50"
              max="50"
              defaultValue="0"
              onChange={(e) => {
                updateGravityX(parseInt(e.target.value));
              }}
              className="range"
            />
          </div>
          <div className="flex gap-4">
            <p>Y:</p>
            <input
              type="range"
              min="-50"
              max="50"
              defaultValue="0"
              onChange={(e) => {
                updateGravityY(parseInt(e.target.value));
              }}
              className="range"
            />
          </div>
        </div>

        <label className="label cursor-pointer mt-4">
          <span className="label-text text-white">Walled</span>
          <input
            onChange={(e) => {
              toggleWalls(e.target.checked);
            }}
            type="checkbox"
            className="toggle toggle-success"
            defaultChecked
          />
        </label>

        <label className="label cursor-pointer">
          <span className="label-text text-white">Wrap</span>
          <input
            onChange={(e) => {
              toggleWrap(e.target.checked);
            }}
            type="checkbox"
            className="toggle toggle-success"
          />
        </label>

        <div className="flex flex-col mt-4">
          <p className="text-center">Create Custom Shape</p>
          <CreateShape
            createCircle={createCircle}
            createRectangle={createRectangle}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-red-600 w-12 h-12 rounded-xl centered hover:bg-red-400 transition-colors duration-300 active:scale-95 mt-4"
            onClick={() => {
              removeLastParticle();
            }}
          >
            <FontAwesomeIcon icon={faUndo} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
