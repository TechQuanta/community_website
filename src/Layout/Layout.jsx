import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/NavBar/Navigation";
import Footer from "../components/Footer/Footer";
import { HeroHighlight } from "../components/ui/hero-highlight"; 

const Layout = () => {
    return (
    <div className="flex min-h-screen w-full min-w-0 flex-col">
      <Header />
      
      <main className="min-h-screen w-full min-w-0 flex-grow">
        <HeroHighlight>
          <Outlet /> {/* This content will now be pinned */}
        </HeroHighlight>
      </main>
      
      <Footer />
    </div>
    );
};

export default Layout;
