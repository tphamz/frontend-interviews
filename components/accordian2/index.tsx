import React from "react";
import { Accordians, Accordian, useAccordians, useItem } from "./context";

export { Accordians, Accordian };

export const AccordianHeader = ({
  style = {},
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { selected, onToggle } = useAccordians();
  const { value } = useItem();
  return (
    <div
      style={{
        background: "lightgray",
        padding: 10,
        height: 40,
        ...style,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      {...rest}
    >
      <>{children}</>
      <button
        style={{ width: 40, height: 40, fontSize: 24, background: "none" }}
        onClick={() => onToggle(value)}
      >
        {selected.has(value) ? "-" : "+"}
      </button>
    </div>
  );
};

export const AccordianBody = ({
  style = {},
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { selected } = useAccordians();
  const { value } = useItem();
  return (
    <div
      style={{
        padding: selected.has(value) ? 10 : 0,
        ...style,
        maxHeight: selected.has(value) ? "100%" : 0,
        height: "100%",
        opacity: selected.has(value) ? 1 : 0,
        transition: "all 0.2s",
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
