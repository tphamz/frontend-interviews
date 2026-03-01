import React, { createContext, useContext, useMemo, useState } from "react";

type ProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue: string;
  onChange?: (val: string) => void;
};

type ContextProps = {
  selected: string;
  onSelect: (val: string) => void;
};

const TabsContext = createContext<ContextProps>({
  selected: "",
  onSelect: (v: string) => {},
});

export const Tabs = ({
  defaultValue,
  onChange = (val) => {},
  style = {},
  children,
  ...rest
}: ProviderProps) => {
  const [selected, setSelected] = useState(defaultValue);
  const value = useMemo<ContextProps>(
    () => ({
      selected,
      onSelect: (val: string) => {
        setSelected(val);
        onChange(val);
      },
    }),
    [selected]
  );

  return (
    <TabsContext.Provider value={value}>
      <div
        style={{
          width: "100%",
          height: "100%",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const useTabs = () => React.useContext(TabsContext);
