import Simulation from "./simulation";

const Main = () => {
  return (
    <div className="bg-stone-800">
      <Simulation options={{ walled: true }} numberOfPolygons={150} />
    </div>
  );
};

export default Main;
