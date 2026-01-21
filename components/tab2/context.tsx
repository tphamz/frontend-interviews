import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ContextProp = {
  selected: string;
  setSelected: (val: string) => void;
};

type ProviderProp = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  defaultValue: string;
  value?: string;
};

const tabContext = createContext<ContextProp | null>(null);

export const Provider = ({
  defaultValue,
  value,
  style = {},
  children,
}: ProviderProp) => {
  const [selected, setSelected] = useState<string>(defaultValue);

  const providerValue = useMemo(
    () => ({
      selected,
      setSelected: (val: string) => setSelected(val),
    }),
    [selected]
  );
  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  return (
    <tabContext.Provider value={providerValue}>
      <div style={{ width: "100%", height: "100%", ...style }}>{children}</div>
    </tabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(tabContext);
  if (!context) throw new Error("Provider is required");
  return context;
};
