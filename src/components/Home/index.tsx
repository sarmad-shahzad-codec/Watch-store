import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import BestSeller from "./BestSeller";
import WhyChooseGloria from "../Common/WhyChooseGloria";
import TimelessElegance from "./TimelessElegance";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Categories />
      <NewArrival />
      <BestSeller />
      <WhyChooseGloria />
      <TimelessElegance />
      <Testimonials />
    </main>
  );
};

export default Home;
