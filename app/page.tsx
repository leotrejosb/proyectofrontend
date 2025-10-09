import Image from "next/image";
import { HeroSection } from "../components/home/hero-section";
import { NewsSection } from "../components/home/news-section";
import { EventsSection } from "../components/home/events-section";



export default function Home() {
  return (
    <div>
      <HeroSection/>
      <NewsSection/>
      <EventsSection/>
    </div>
  );
}
