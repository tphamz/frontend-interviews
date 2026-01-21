import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SlideContextProps = {
  selected: number;
  setSelected: (val: number) => void;
  next: () => void;
  prev: () => void;
  images: string[];
};

export type ProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  data: string[];
  autoSlide?: boolean;
  children?: ReactNode;
};
const SlideContext = createContext<SlideContextProps | null>(null);

export const Provider = ({
  data,
  autoSlide = false,
  children,
}: ProviderProps) => {
  const [selected, setSelected] = useState(0);
  const intervalRef = useRef<any>(null);
  const value = useMemo(
    () => ({
      images: data,
      selected,
      setSelected: (val: number) => setSelected(val),
      next: () =>
        setSelected(
          (prev: number) => (prev + 1 + data.length) % (data.length || 1)
        ),
      prev: () =>
        setSelected(
          (prev: number) => (prev - 1 + data.length) % (data.length || 1)
        ),
    }),
    [data, selected]
  );

  useEffect(() => {
    setSelected((prev: number) => Math.min(prev, data.length - 1));
    if (autoSlide) {
      intervalRef.current = setInterval(() => {
        setSelected(
          (prev: number) => (prev + 1 + data.length) % (data.length || 1)
        );
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [data]);

  return (
    <SlideContext.Provider value={value}>{children}</SlideContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(SlideContext);
  if (!context) throw new Error("Provided is required");
  return context;
};
