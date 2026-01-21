import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  apiCall: (offset: number) => Promise<any>;
  renderItem?: (item: any) => ReactNode;
};

export default function InfiniteScroll({
  apiCall,
  renderItem = (item: any) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: 10,
        background: "white",
        height: 40,
        color: "black",
      }}
    >
      {item}
    </div>
  ),
  style = {},
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const offsetRef = useRef<number>(0);
  const hasMoreRef = useRef<boolean>(true);

  const fetch = async () => {
    if (isFetching || !hasMoreRef.current) return;
    try {
      setIsFetching(true);
      const res: any[] = await apiCall(offsetRef.current);
      setIsFetching(false);
      if (!res.length) return (hasMoreRef.current = false);
      offsetRef.current++;
      setItems((prev: any[]) => [...prev, ...res]);
    } catch (err) {
      console.log(err);
      hasMoreRef.current = false;
    }
  };

  const isScrollEnd = useCallback(
    (elem: any) =>
      elem.scrollTop + elem.clientHeight >= elem.scrollHeight - 500,
    []
  );

  const onScroll = (evt: any) => {
    if (!isScrollEnd(evt.target)) return;
    console.log("scroll end");
    fetch();
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div
      style={{
        background: "gray",
        height: 400,
        width: 400,
        ...style,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflow: "auto",
      }}
      onScroll={onScroll}
    >
      {items.map((item, index) => (
        <Fragment key={index}>{renderItem(item)}</Fragment>
      ))}
    </div>
  );
}
