import { useEffect, useRef } from "react";
import { ItemProvider, Provider, useAccordians, useItem } from "./context";

export const Accordians = Provider;

export const Accordian = ItemProvider;

export const AccordianHeader = ({
  children,
  style,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { selected, onTrigger } = useAccordians();
  const { value } = useItem();

  return (
    <div
      style={{
        minHeight: "40px",
        background: "white",
        padding: 10,
        color: "black",
        ...style,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <>{children}</>
      <button
        style={{
          fontSize: 24,
          fontWeight: 600,
          background: "transparent",
          width: 40,
          height: 40,
        }}
        type="button"
        onClick={() => onTrigger(value)}
      >
        {selected.has(value) ? "-" : "+"}
      </button>
    </div>
  );
};

export const AccordianBody = ({
  children,
  style,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { selected } = useAccordians();
  const { value } = useItem();
  const isSelected = selected.has(value);
  return (
    <div
      style={{
        background: "light-gray",
        padding: isSelected ? 10 : 0,
        ...style,
        maxHeight: isSelected ? "100%" : 0,
        opacity: isSelected ? 1 : 0,
        transition: "all 0.2s",
      }}
    >
      {children}
    </div>
  );
};
