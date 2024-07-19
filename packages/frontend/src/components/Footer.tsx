import React from 'react'
import { Button } from "./ui/button"
import { HomeIcon } from "./ui/HomeIcon"
import { PieChartIcon } from "./ui/PiechartIcon"
import { SettingsIcon } from "./ui/SettingsIcon"

const Footer = () => {
  return (
    <footer className="bg-card border-t py-4 px-6 flex justify-between items-center mx-40">
      <Button variant="ghost" size="icon" className="w-max px-5">
        <HomeIcon className="w-6 h-6" label="Home" />
      </Button>

    
        <Button variant="ghost" size="icon" className="w-max px-5">
          <PieChartIcon className="w-6 h-6" />
        </Button>
    

      <Button variant="ghost" size="icon" className="w-max px-5">
        <SettingsIcon className="w-6 h-6" />
      </Button>
    </footer>
    
  )
}

export default Footer