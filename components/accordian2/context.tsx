import { createContext, useContext, useMemo, useState } from "react";
import { ItemProvider } from "../accordian/context";

type ContextProps = {
  selected: Set<string>;
  onToggle: (val: string) => void;
};

type ProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  multiple?: boolean;
  defaultValue: string;
};

const Context = createContext<ContextProps>({
  selected: new Set(),
  onToggle: (val) => {},
});

export const Accordians = ({
  multiple = false,
  defaultValue,
  style = {},
  children,
  ...rest
}: ProviderProps) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set([defaultValue])
  );

  const value = useMemo<ContextProps>(
    () => ({
      selected,
      onToggle: (val) => {
        const newSelected = new Set(selected);
        if (selected.has(val)) {
          if (!multiple) return;
          newSelected.delete(val);
          return setSelected(newSelected);
        }
        if (!multiple) return setSelected(new Set([val]));
        newSelected.add(val);
        setSelected(newSelected);
      },
    }),
    [selected]
  );

  return (
    <Context.Provider value={value}>
      <div style={{ background: "white", color: "black", ...style }} {...rest}>
        {children}
      </div>
    </Context.Provider>
  );
};

export const useAccordians = () => useContext(Context);

type ItemContextProps = {
  value: string;
};

type ItemProviderProps = React.HTMLAttributes<HTMLDivElement> &
  ItemContextProps;

const ItemContext = createContext<ItemContextProps>({ value: "" });
export const Accordian = ({
  value,
  children,
  style = {},
  ...rest
}: ItemProviderProps) => {
  return (
    <ItemContext.Provider value={{ value }}>
      <div style={{ marginBottom: 1, ...style }} {...rest}>
        {children}
      </div>
    </ItemContext.Provider>
  );
};

export const useItem = () => useContext(ItemContext);
