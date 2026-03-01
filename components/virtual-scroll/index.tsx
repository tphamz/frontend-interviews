import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
type Props = React.HTMLAttributes<HTMLDivElement> & {
  itemHeight?: number;
  renderItem?: (item: any) => ReactNode;
  apiCall: (params: any) => Promise<any[]>;
  buffer: number;
};

export default function VirtualScroll({
  apiCall,
  renderItem = (item) => (
    <div
      style={{
        height: 40,
        padding: 4,
        border: "1px solid lightgray",
        color: "black",
      }}
    >
      {item}
    </div>
  ),
  style = {},
  itemHeight = 40,
  buffer = 5,
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [scrollTop, setScrollTop] = useState(0);
  const loadingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);
  const lastItemRef = useRef<any>(null);

  const containerHeight = (style.height as number) || 400;
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex =
    Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    ) + buffer;

  const translateY = startIndex * itemHeight;
  const renderedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const fetch = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    let res = [];
    loadingRef.current = true;
    try {
      res = await apiCall(lastItemRef.current);
    } catch (err) {
      console.error(err);
    }
    loadingRef.current = false;
    lastItemRef.current = res.at(-1);
    if (!res.length) return (hasMoreRef.current = false);
    setItems((current) => [...current, ...res]);
  }, [apiCall]);

  const onScroll = (evt: any) => {
    const { scrollTop, clientHeight, scrollHeight } = evt.target;
    setScrollTop(scrollTop);
    if (scrollTop + clientHeight >= scrollHeight - 200) fetch();
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div
      style={{
        height: 400,
        width: 400,
        ...style,
        position: "relative",
        overflow: "auto",
      }}
      onScroll={onScroll}
    >
      <div style={{ height: totalHeight, width: "100%" }}></div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: 0,
          left: 0,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderedItems.map((item: any, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
