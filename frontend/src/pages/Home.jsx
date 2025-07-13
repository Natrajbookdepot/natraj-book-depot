import React from "react";
import HeroSlider from "../components/HeroSlider";   // <-- only this import!

const Home = () => {
  return (
    <div>
      <HeroSlider />    {/* <-- dynamic, backend-driven hero section */}
      {/* ...baaki homepage sections yahan add kar sakte ho */}
    </div>
  );
};

export default Home;
