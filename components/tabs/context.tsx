"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TabContextProps = {
  selectedTab: string | null;
  setSelectedTab: Dispatch<SetStateAction<string | null>>;
};

const TabContext = createContext<TabContextProps | null>(null);

export type TabProviderProps = {
  defaultValue?: string | null;
  selected?: string | null;
  children: ReactNode;
};

export const TabProvider = ({
  defaultValue = null,
  selected = null,
  children,
}: TabProviderProps) => {
  const [selectedTab, setSelectedTab] = useState<null | string>(defaultValue);

  const value = useMemo(
    () => ({
      selectedTab,
      setSelectedTab,
    }),
    [selectedTab]
  );

  useEffect(() => {
    if (selected) setSelectedTab(selected);
  }, [selected]);

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error("TabProvider is required");
  return context;
};
