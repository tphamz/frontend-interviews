import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  apiCall: (params: any) => Promise<any[]>;
  renderItem?: (item: any) => ReactNode;
  itemHeight?: number;
  buffer?: number;
};

export default function VirtualScroll({
  apiCall,
  itemHeight = 40,
  buffer = 5,
  style = {},
  renderItem = (item: any) => (
    <div
      style={{
        padding: 5,
        height: 40,
        width: "100%",
        border: "solid 1px lightgray",
        color: "black",
      }}
    >
      {item}
    </div>
  ),
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [scrollTop, setScrollTop] = useState(0);

  const loadingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);
  const lastItemRef = useRef<any>(null);

  const totalHeight = items.length * itemHeight;
  const containerHeight = (style.height as number) || 400;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex =
    Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    ) + buffer;

  const renderedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [startIndex, endIndex, items]
  );

  const fetch = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    let res = [];
    try {
      console.log(lastItemRef.current);
      res = await apiCall(lastItemRef.current);
    } catch (err) {}
    loadingRef.current = false;
    if (!res.length) hasMoreRef.current = false;
    lastItemRef.current = res.at(-1);
    setItems((current) => [...current, ...res]);
  }, [apiCall]);

  const onScroll = (evt: any) => {
    const { scrollTop, scrollHeight, clientHeight } = evt.target;
    setScrollTop(scrollTop);
    if (scrollTop + clientHeight >= scrollHeight - 200) fetch();
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div
      onScroll={onScroll}
      style={{
        height: 400,
        width: 400,
        ...style,
        position: "relative",
        overflow: "auto",
      }}
    >
      <div style={{ height: totalHeight, width: "100%" }}></div>
      <div
        style={{
          width: "100%",
          top: 0,
          left: 0,
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          transform: `translateY(${startIndex * itemHeight}px)`,
        }}
      >
        {renderedItems.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
