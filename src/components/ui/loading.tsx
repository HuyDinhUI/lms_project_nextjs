import { ScaleLoader } from "react-spinners";

export const Scale = () => {
  return (
    <ScaleLoader
      color="blue"
      cssOverride={{
        display: "block",
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%;-50%)",
      }}
      aria-setsize={10}
    />
  );
};
