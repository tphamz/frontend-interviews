import { Provider, ProviderProps, useCarousel } from "./context";

export default function Carousel(props: ProviderProps) {
  return (
    <Provider {...props}>
      <div
        style={{
          width: 600,
          height: 400,
          ...(props.style || {}),
          position: "relative",
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <CarouselContent />
        </div>
        <Actions />
        <Dots />
      </div>
    </Provider>
  );
}

const CarouselContent = () => {
  const { images, selected } = useCarousel();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        transform: `translateX(calc(-${selected * 100}%))`,
        transition: `transform ease-in-out 0.3s`,
      }}
    >
      {images.map((item, index) => (
        <Slide key={item} url={item} isSelected={selected === index} />
      ))}
    </div>
  );
};

const Slide = ({ url, isSelected }: { url: string; isSelected: boolean }) => {
  return (
    <img
      src={url}
      alt="Slide image"
      style={{
        flexShrink: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${isSelected ? 1 : 0.75})`,
        transition: "transform 0.5s ease-in-out",
      }}
    />
  );
};

const Actions = () => {
  const { prev, next } = useCarousel();
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          width: 40,
          height: "100%",
          left: 0,
          top: 0,
        }}
      >
        <button
          onClick={() => prev()}
          style={{
            background: "black",
            opacity: 0.75,
            color: "white",
            width: 40,
            height: 40,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          {"<"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          width: 40,
          height: "100%",
          top: 0,
          right: 0,
        }}
      >
        <button
          onClick={() => next()}
          style={{
            background: "black",
            opacity: 0.75,
            color: "white",
            width: 40,
            height: 40,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          {">"}
        </button>
      </div>
    </>
  );
};

const Dots = () => {
  const { images, setSelected, selected } = useCarousel();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        position: "absolute",
        left: 0,
        bottom: -20,
        gap: 5,
      }}
    >
      {images.map((image, index) => (
        <button
          onClick={() => setSelected(index)}
          type="button"
          key={image}
          style={{
            background: index === selected ? "darkgray" : "lightgray",
            borderRadius: "50%",
            width: 10,
            height: 10,
          }}
        />
      ))}
    </div>
  );
};
