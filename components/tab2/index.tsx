import { useLayoutEffect, useRef, useState } from "react";
import { Tabs, useTabs } from "./context";

type HeaderProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: string;
};

type ContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export { Tabs, useTabs };

export const TabHeaders = ({
  style = {},
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const { selected } = useTabs();

  // useLayoutEffect prevents the underline from "jumping" on the first render
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find the active tab button within the container
    const activeTab = container.querySelector(
      `[data-value="${selected}"]`
    ) as HTMLElement;

    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        display: "flex",
        flexDirection: "row",
        gap: 20,
        position: "relative", // Needed for absolute underline
        paddingBottom: 2, // Space for the underline
      }}
      {...rest}
    >
      {children}

      {/* The Sliding Underline */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 2,
          backgroundColor: "black",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: indicatorStyle.width,
          transform: `translateX(${indicatorStyle.left}px)`,
        }}
      />
    </div>
  );
};

export const TabHeader = ({ value, style, children, ...rest }: HeaderProps) => {
  const { selected, onSelect } = useTabs();
  const isSelected = selected === value;

  return (
    <button
      // Use data-attribute so the parent can find the active tab
      data-value={value}
      onClick={() => onSelect(value)}
      style={{
        background: "none",
        border: "none",
        padding: "10px 0",
        cursor: "pointer",
        transition: "color 0.3s",
        fontWeight: isSelected ? 700 : 500,
        color: isSelected ? "black" : "gray",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
export const TabContent = ({
  value,
  style,
  children,
  ...rest
}: ContentProps) => {
  const { selected } = useTabs();
  if (value !== selected) return <></>;
  return (
    <div style={{ ...style }} {...rest}>
      {children}
    </div>
  );
};
