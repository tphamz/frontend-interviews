"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ContextProps = {
  images: string[];
  selected: number;
  next: () => void;
  prev: () => void;
  select: (val: number) => void;
};

export type ProviderProps = {
  children: ReactNode;
  data?: string[];
  auto?: boolean;
};

const CarouselContext = createContext<ContextProps | null>(null);

export const CarouselProvider = ({
  data = [],
  auto = false,
  children,
}: ProviderProps) => {
  const [selected, setSelected] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const value = useMemo(
    () => ({
      images: data,
      selected,
      next: () =>
        setSelected((prev) => (data.length + prev + 1) % (data.length || 1)),
      prev: () =>
        setSelected((prev) => (data.length + prev - 1) % (data.length || 1)),
      select: (val: number) =>
        setSelected((data.length + val) % (data.length || 1)),
    }),
    [data, selected]
  );

  useEffect(() => {
    setSelected((prev) => Math.min(prev, data.length - 1));
    if (auto) {
      intervalRef.current = setInterval(() => {
        setSelected((prev) => (data.length + prev + 1) % (data.length || 1));
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [data, auto]);

  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("CarouselProvider is required");
  return context;
};
