"use client";
import { useState } from "react";

type CreateShapeProps = {
  createCircle: (radius: number) => void;
  createRectangle: (width: number, height: number) => void;
};

const CreateShape = ({ createCircle, createRectangle }: CreateShapeProps) => {
  const [shape, setShape] = useState<string>("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);

        const shapeData: { [key: string]: number } = {};

        formData.forEach((value, key) => {
          shapeData[key] = Number(value);
        });

        if (shape === "circle" && shapeData.radius > 0) {
          console.log("Creating circle with radius:", shapeData.radius);
          createCircle(shapeData.radius);
        } else if (
          shape === "rectangle" &&
          shapeData.width > 0 &&
          shapeData.height > 0
        ) {
          console.log(
            "Creating rectangle with width and height:",
            shapeData.width,
            shapeData.height
          );
          createRectangle(shapeData.width, shapeData.height);
        } else if (
          shape === "triangle" &&
          shapeData["tSide1"] > 0 &&
          shapeData["tSide2"] > 0 &&
          shapeData["tSide3"] > 0
        ) {
          const isValidTriangle = (a: number, b: number, c: number) => {
            return a + b > c && a + c > b && b + c > a;
          };
          if (
            isValidTriangle(
              shapeData["tSide1"],
              shapeData["tSide2"],
              shapeData["tSide3"]
            )
          ) {
            console.log(
              "Creating valid triangle with sides:",
              shapeData["tSide1"],
              shapeData["tSide2"],
              shapeData["tSide3"]
            );
          } else {
            console.error("Invalid triangle sides");
          }
        } else {
          console.error("Invalid shape data");
        }
      }}
    >
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="shape"
            value="circle"
            onClick={() => setShape("circle")}
            className="radio"
          />
          <span>Circle</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="shape"
            value="rectangle"
            onClick={() => setShape("rectangle")}
            className="radio"
          />
          <span>Rectangle</span>
        </label>

        {(shape === "circle" && (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <span>Radius:</span>
              <input type="number" name="radius" className="input w-full" />
            </label>
          </div>
        )) ||
          (shape === "rectangle" && (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <span className="w-11">Width:</span>
                <input type="number" name="width" className="input w-full" />
              </label>
              <label className="flex items-center gap-2">
                <span className="w-11">Height:</span>
                <input type="number" name="height" className="input w-full" />
              </label>
            </div>
          ))}
      </div>

      <button
        type="submit"
        className="bg-slate-600 p-4 mt-4 rounded-xl w-full hover:bg-slate-400 transition-colors duration-300 active:scale-95"
      >
        Create Shape
      </button>
    </form>
  );
};

export default CreateShape;
