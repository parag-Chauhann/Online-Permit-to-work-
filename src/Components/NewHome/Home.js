import React from "react";
// import Navbar from "../NewHome/Pages/Navbar";
import "./Home.css";
import Banner from "./Pages/Banner";
import Services from "./Pages/Services";
import Prices from "./Pages/Prices";
import TrandingSlider from "./Pages/TrendingSlider";
import Newsletter from "./Pages/Newsletter";
import Footer from "./Pages/Footer/Footer";



const Home = () => {
    return (
        <>
            <Banner />
            <Services />
            <Prices />
            <TrandingSlider />
            <Newsletter />
            <Footer />
        </>
    )
}

export default Home;