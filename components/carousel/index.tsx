"use client";

import { useEffect, useMemo, useRef } from "react";
import { CarouselProvider, ProviderProps, useCarousel } from "./context";

type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  data: string[];
  auto: boolean;
};

export const Carousel = ({ style = {}, data, auto }: CarouselProps) => {
  return (
    <CarouselProvider data={data} auto={auto}>
      <div
        style={{
          width: 400,
          height: 300,
          ...style,
          position: "relative",
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <CarouselContent />
        </div>

        <ArrowButtons />
        <Dots />
      </div>
    </CarouselProvider>
  );
};

const ArrowButtons = () => {
  const { prev, next } = useCarousel();
  return (
    <>
      <button
        style={{
          position: "absolute",
          top: "45%",
          left: 5,
          background: "black",
          opacity: "0.7",
          fontSize: 24,
          width: 40,
          height: 40,
          borderRadius: "50%",
          color: "white",
        }}
        type="button"
        onClick={() => prev()}
      >
        {"<"}
      </button>
      <button
        style={{
          position: "absolute",
          top: "45%",
          right: 5,
          background: "black",
          opacity: "0.7",
          fontSize: 24,
          width: 40,
          height: 40,
          borderRadius: "50%",
          color: "white",
        }}
        type="button"
        onClick={() => next()}
      >
        {">"}
      </button>
    </>
  );
};
const Dots = () => {
  const { images, select, selected } = useCarousel();
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 10,
        bottom: -30,
        left: 0,
        width: "100%",
        height: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      {images.map((_, index) => (
        <button
          key={index}
          style={{
            border: "none",
            borderRadius: "50%",
            width: 10,
            height: 10,
            background: selected === index ? "blue" : "gray",
            cursor: "pointer",
          }}
          type="button"
          onClick={() => select(index)}
        ></button>
      ))}
    </div>
  );
};

const CarouselContent = () => {
  const { images, selected } = useCarousel();

  return (
    <div
      style={{
        width: `100%`,
        height: "100%",
        display: "flex",
        flexDirection: "row",
        transform: `translateX(calc(-${100 * selected}%))`,
        transition: "transform 0.5s ease-in-out",
      }}
    >
      {images.map((item, index) => (
        <CarouselSlide
          isSelected={images[selected] === item}
          src={item}
          key={item}
        />
      ))}
    </div>
  );
};
const CarouselSlide = ({
  src,
  isSelected,
}: {
  src: string;
  isSelected: boolean;
}) => {
  return (
    <img
      style={{
        flexShrink: 0,
        left: 0,
        top: 0,
        objectFit: "cover",
        width: "100%",
        height: "100%",
        transform: `scale(${isSelected ? 1 : 0.8})`,
        transition: "all ease-in-out 0.3s",
      }}
      src={src}
      alt="Carousel slide"
    />
  );
};
