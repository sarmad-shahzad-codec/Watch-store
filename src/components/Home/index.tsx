import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import WhyChooseGloria from "../Common/WhyChooseGloria";
import TimelessElegance from "./TimelessElegance";
import Testimonials from "./Testimonials";
import ProductFaq from "../Common/ProductFaq";

const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <WhyChooseGloria />
      <TimelessElegance />
      <Testimonials />
      <ProductFaq />
    </main>
  );
};

export default Home;
