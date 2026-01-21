"use client";
// import { Carousel } from "@/components/carousel";
import Carousel from "@/components/carousel2";
import InfiniteScroll from "@/components/infinite-scroll2";
import { TabBody, TabHeader, TabHeaders, TabList } from "@/components/tabs";
import {
  TabBody as TabBody2,
  TabHeader as TabHeader2,
  TabHeaders as TabHeaders2,
  TabList as TabList2,
} from "@/components/tab2";

// import InfiniteScroll from "@/components/infinite-scroll";
import { useState } from "react";
import {
  Accordian,
  AccordianBody,
  AccordianHeader,
  Accordians,
} from "@/components/accordian";
import DatePicker from "@/components/date-picker";

export default function Home() {
  const currentDate = new Date();
  const minDate = new Date(currentDate);
  minDate.setMonth(0);
  const maxDate = new Date(currentDate);
  maxDate.setMonth(currentDate.getMonth() + 12);
  const [images, setImages] = useState([
    "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
    "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/040/990/006/small/ai-generated-cheetah-cub-sitting-in-the-grass-and-looking-at-the-camera-photo.jpg",
    "https://www.cutoutimage.com/wp-content/uploads/2022/02/blackandwhite-image-scaled.webp",
    "https://buffer.com/resources/content/images/2025/03/social-media-image-sizes.png",
  ]);

  const apiCall = (offset: number) => {
    return new Promise((resolve, _) => {
      if (offset === 10) resolve([]);
      return resolve(
        Array.from({ length: 100 }, (_, index) => 100 * offset + index)
      );
    });
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans p-20">
      <TabList defaultValue={"tab"}>
        <TabHeaders>
          <TabHeader value={"tab"}>Tabs</TabHeader>
          <TabHeader value={"carousel"}>Carousel</TabHeader>
          <TabHeader value={"infiniteScroll"}>Infinite Scroll</TabHeader>
          <TabHeader value={"accordians"}>Accordians</TabHeader>
          <TabHeader value={"datepicker"}>Date Picker</TabHeader>
        </TabHeaders>

        <TabBody value={"tab"}>
          <TabList2 defaultValue="1">
            <TabHeaders2>
              <TabHeader2 value="1">Tab1</TabHeader2>
              <TabHeader2 value="2">Tab2</TabHeader2>
            </TabHeaders2>
            <TabBody2 value={"1"}>Here is tab 1</TabBody2>
            <TabBody2 value={"2"}>Here is tab 2</TabBody2>
          </TabList2>
        </TabBody>
        <TabBody value={"carousel"}>
          <Carousel data={images} autoSlide={true} />
        </TabBody>

        <TabBody value={"infiniteScroll"}>
          <InfiniteScroll apiCall={apiCall} />
        </TabBody>

        <TabBody value={"accordians"}>
          <Accordians defaultValue={"1"} multiple>
            <Accordian value="1">
              <AccordianHeader>Header 1</AccordianHeader>
              <AccordianBody>Body 1</AccordianBody>
            </Accordian>
            <Accordian value="2">
              <AccordianHeader>Header 2</AccordianHeader>
              <AccordianBody>Body 2</AccordianBody>
            </Accordian>
            <Accordian value="3">
              <AccordianHeader>Header 3</AccordianHeader>
              <AccordianBody>Body 3</AccordianBody>
            </Accordian>
          </Accordians>
        </TabBody>

        <TabBody value={"datepicker"}>
          <DatePicker min={minDate} max={maxDate} />
        </TabBody>
      </TabList>
    </div>
  );
}
