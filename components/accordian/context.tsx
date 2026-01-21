import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ContextProp = {
  multiple?: boolean;
  selected: Set<string>;
  onTrigger: (val: string) => void;
};

type ItemContextProp = {
  value: string;
};

type ProviderProp = React.HTMLAttributes<HTMLDivElement> & {
  multiple?: boolean;
  defaultValue: string | string[];
  children: ReactNode;
};

type ItemProviderProp = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  children: ReactNode;
};

const Context = createContext<ContextProp | null>(null);

const ItemContext = createContext<ItemContextProp | null>(null);

export const Provider = ({
  multiple,
  children,
  defaultValue,
  style = {},
}: ProviderProp) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(typeof defaultValue === "string" ? [defaultValue] : defaultValue)
  );
  const valuesRef = useRef<Set<string>>(new Set());

  const propValue = useMemo(
    () => ({
      selected,
      multiple,
      onTrigger: (val: string) => {
        let newSelected = new Set(selected);
        if (selected.has(val)) {
          newSelected.delete(val);
          return setSelected(newSelected);
        }
        if (multiple) newSelected.add(val);
        else newSelected = new Set([val]);
        setSelected(newSelected);
      },
    }),
    [selected, multiple]
  );

  return (
    <Context.Provider value={propValue}>
      <div style={{ width: "100%", height: "100%", ...style }}>{children}</div>
    </Context.Provider>
  );
};

export const useAccordians = () => {
  const context = useContext(Context);
  if (!context) throw new Error("Provider is required");
  return context;
};

export const ItemProvider = ({
  value,
  children,
  style = {},
}: ItemProviderProp) => {
  return (
    <ItemContext.Provider value={{ value }}>
      <div
        style={{ ...style, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
};

export const useItem = () => {
  const context = useContext(ItemContext);
  if (!context) throw new Error("Provider is required");
  return context;
};
