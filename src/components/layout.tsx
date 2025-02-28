"use client";

import React, { ReactNode } from "react";
import Footer from "./Footer";
import LeftSide from "./LeftSide";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex">
        <LeftSide />
        <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
