import * as React from "react";
import { Button } from "@/components/ui/button"; // Ensure this Button component is properly defined and imported.

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-4 z-50 mx-4 border border-white/20 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/20 rounded-3xl shadow-lg">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold text-xl ml-4 sm:ml-16 text-white">SnapResume</span>
          </a>
          <div className="flex items-center gap-4 sm:gap-8 mr-4 sm:mr-16">
            <div className="hidden md:flex items-center gap-6">
              <a className="text-sm font-medium transition-colors hover:text-gray-300" href="/portfolio">
                Portfolio
              </a>
              <a className="text-sm font-medium transition-colors hover:text-gray-300" href="/resume">
                Resume
              </a>
              <a className="text-sm font-medium transition-colors hover:text-gray-300" href="/cover-letter">
                Cover Letter
              </a>
            </div>
            <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
