"use client";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { TabProvider, TabProviderProps, useTab } from "./context";

export const TabList = ({
  defaultValue,
  selected,
  children,
}: TabProviderProps) => (
  <div style={{ width: "100%", height: "100%" }}>
    <TabProvider defaultValue={defaultValue} selected={selected}>
      {children}
    </TabProvider>
  </div>
);

export type TabProps = {
  value: string;
  children: ReactNode;
};

export const TabHeaders = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

    const container = containerRef.current;
    if (!container) return;

    const tabs = Array.from(
      container.querySelectorAll('[role="tab"]')
    ) as HTMLElement[];

    const index = tabs.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;

    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length; // Loop to start
    } else {
      nextIndex = (index - 1 + tabs.length) % tabs.length; // Loop to end
    }
    tabs[nextIndex].focus();
  };
  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      role="tablist"
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        marginBottom: 10,
        gap: 20,
      }}
    >
      {children}
    </div>
  );
};
export const TabHeader = ({ value, children }: TabProps) => {
  const { selectedTab, setSelectedTab } = useTab();
  const isSelected = useMemo(() => selectedTab === value, [selectedTab]);
  return (
    <button
      role="tab"
      aria-controls={"tab-body-" + value}
      aria-selected={isSelected}
      id={"tab-header-" + value}
      tabIndex={isSelected ? 0 : -1}
      style={{
        background: "none",
        border: "none",
        minHeight: 20,
        padding: "5px 2px",
        cursor: "pointer",
        borderBottom: `1.5px solid ${isSelected ? "black" : "transparent"}`,
        color: isSelected ? "black" : "gray",
        fontWeight: isSelected ? 600 : 500,
        transition: "border-bottom ease-in-out 0.3s",
      }}
      onClick={() => setSelectedTab(value)}
    >
      {children}
    </button>
  );
};

export const TabBody = ({ value, children }: TabProps) => {
  const { selectedTab, setSelectedTab } = useTab();
  if (value !== selectedTab) return <></>;
  return (
    <div
      style={{ width: "100%", height: "100%" }}
      role="tabpanel"
      id={"tab-body-" + value}
      aria-labelledby={`tab-header-${value}`}
    >
      {children}
    </div>
  );
};
