import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value?: Date;
  onChange?: (val: Date) => void;
  min?: Date;
  max?: Date;
};

const getDays = (date: Date) => {
  const tmp = new Date(date);
  tmp.setMonth(tmp.getMonth() + 1);
  tmp.setDate(0);
  return Array.from({ length: tmp.getDate() }).map(
    (_, index) => new Date(tmp.setDate(index + 1))
  );
};

const dateNoHours = (date: Date) => {
  const ndate = new Date(date);
  ndate.setHours(0, 0, 0, 0);
  return ndate;
};
const getCurrentMonth = (date: Date) => {
  const currentMonth = new Date(date);
  currentMonth.setDate(1);
  return dateNoHours(currentMonth);
};

const DAYS = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
export default function DatePicker({
  value,
  onChange = (val: Date) => {},
  min,
  max,
}: Props) {
  const [selected, setSelected] = useState(value ? dateNoHours(value) : null);
  const [currentMonth, setCurrentMonth] = useState(
    getCurrentMonth(value || new Date())
  );
  const todayRef = useRef<Date>(dateNoHours(new Date()));
  const days = useMemo(() => getDays(currentMonth), [currentMonth]);
  const handleSelect = (val: Date) => {
    onChange(val);
    if (!value) setSelected(val);
  };

  const onCurrentMonthChange = (offset: number) => (evt: any) => {
    const nMonth = new Date(currentMonth);
    nMonth.setMonth(nMonth.getMonth() + offset);
    setCurrentMonth(nMonth);
  };

  const isDisabled = useCallback(
    (val: Date) => {
      return (
        (min && dateNoHours(min).getTime() > val.getTime()) ||
        (max && dateNoHours(max).getTime() < val.getTime())
      );
    },
    [min, max]
  );

  useEffect(() => {
    if (value) {
      setSelected(dateNoHours(value));
      setCurrentMonth(getCurrentMonth(value || new Date()));
    }
  }, [value]);

  return (
    <div
      style={{
        width: 400,
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        padding: 20,
        alignItems: "center",
        boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
      }}
    >
      <div
        style={{
          display: "grid",
          minHeight: 300,
          gridTemplateColumns: "auto auto auto auto auto auto auto",
          gap: 5,
        }}
      >
        {DAYS.map((item: string) => (
          <label key={item}>{item}</label>
        ))}
        {Array.from({ length: days[0].getDay() }).map((_, index) => (
          <div key={index} style={{ width: 20, height: 20 }} />
        ))}
        {days.map((val) => (
          <button
            onClick={() => handleSelect(val)}
            disabled={isDisabled(val)}
            type="button"
            key={val.getDate()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              transition: "all 0.3s",
              border:
                "1px solid " +
                (todayRef.current.getTime() === val.getTime()
                  ? "green"
                  : "transparent"),
              color:
                selected && selected.getTime() === val.getTime()
                  ? "white"
                  : isDisabled(val)
                  ? "darkgray"
                  : "black",
              background:
                selected && selected.getTime() === val.getTime()
                  ? "blue"
                  : isDisabled(val)
                  ? "lightgray"
                  : "transparent",
            }}
          >
            {val.getDate()}
          </button>
        ))}
      </div>
      <div
        style={{
          width: "100%",
          height: 40,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          onClick={onCurrentMonthChange(-1)}
          style={{ fontSize: 25, color: "black", background: "transparent" }}
        >
          {"<"}
        </button>
        <div>
          {currentMonth.getMonth() + 1 + "/" + currentMonth.getFullYear()}
        </div>
        <button
          type="button"
          onClick={onCurrentMonthChange(1)}
          style={{ fontSize: 25, color: "black", background: "transparent" }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
