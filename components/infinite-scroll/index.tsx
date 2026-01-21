import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
const BUFFER = 500;
type Props = React.HTMLAttributes<HTMLDivElement> & {
  apiCall: (offset: number) => Promise<any>;
  renderItem?: (item: any) => ReactNode;
};

const isScrollEnd = (elem: any) => {
  return elem.scrollTop + elem.clientHeight >= elem.scrollHeight - 500;
};

export default function InfiniteScroll({
  apiCall,
  renderItem = (val) => (
    <div
      style={{
        height: 40,
        width: "100%",
        padding: 10,
        color: "black",
        background: "White",
      }}
    >
      {val}
    </div>
  ),
  ...rest
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetch] = useState(false);
  const offsetRef = useRef<number>(0);
  const hasMoreRef = useRef<boolean>(true);

  const handleScroll = (evt: any) => {
    if (!isScrollEnd(evt.target) || !hasMoreRef.current || isFetching) return;
    fetch();
  };

  const fetch = useCallback(async () => {
    setIsFetch(true);
    const res = await apiCall(offsetRef.current).catch((err) => []);
    setIsFetch(false);
    if (!res.length) return (hasMoreRef.current = false);
    if (res) setItems((prev) => [...prev, ...res]);
    offsetRef.current++;
  }, [apiCall, isFetching]);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div
      id="infinite-scroll-container"
      onScroll={handleScroll}
      style={{
        background: "lightgray",
        width: 500,
        height: 500,
        ...(rest.style || {}),
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
