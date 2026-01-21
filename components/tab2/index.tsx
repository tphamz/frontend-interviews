import { ReactNode } from "react";
import { Provider, useTab } from "./context";

export const TabList = Provider;

export const TabHeaders = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    }}
  >
    {children}
  </div>
);

export const TabHeader = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  const { selected, setSelected } = useTab();
  return (
    <button
      type="button"
      style={{
        minHeight: 30,
        background: "transparent",
        color: "black",
        opacity: selected === value ? 1 : 0.6,
        fontWeight: selected === value ? 600 : 500,
        transition: "all 0.3s ease-in-out",
        borderBottom:
          "solid 2px " + (selected === value ? "black" : "transparent"),
      }}
      onClick={() => selected !== value && setSelected(value)}
    >
      {children}
    </button>
  );
};

export const TabBody = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  const { selected } = useTab();
  if (selected !== value) return <></>;
  return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
};
