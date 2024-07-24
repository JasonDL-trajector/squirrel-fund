import React from "react";
import { Button } from "./ui/button";
import { HomeIcon } from "./ui/HomeIcon";
import { PieChartIcon } from "./ui/PiechartIcon";
import { SettingsIcon } from "./ui/SettingsIcon";

const Footer = () => {
  return (
    <footer className="bg-card border-t py-4 px-6 flex justify-between items-center">
      <Button variant="ghost" size="icon" className="w-max">
        <HomeIcon className="w-4 h-4 md:w-6 md:h-6" label="Home" />
      </Button>

      <Button variant="ghost" size="icon" className="w-max">
        <PieChartIcon className="w-4 h-4 md:w-6 md:h-6" />
      </Button>

      <Button variant="ghost" size="icon" className="w-max">
        <SettingsIcon className="w-4 h-4 md:w-6 md:h-6" />
      </Button>
    </footer>
  );
};

export default Footer;
