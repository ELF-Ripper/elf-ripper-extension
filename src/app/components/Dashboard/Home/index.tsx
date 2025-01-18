import React from "react";
import Cards from "./cards";
import BuildAnalyzer from "../../Build-Analyzer";

export function Home() {
  return (
    <div>
      <main className="flex-1 p-6 py-4">
        <Cards />

        <br />

        <h3 className="text-lg font-medium leading-snug tracking-normal ml-3">Build Analyzer</h3>
        <BuildAnalyzer />
      </main>
    </div>
  );
}

export default Home;
