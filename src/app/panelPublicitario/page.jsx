"use client";

import { AboutPage } from "./AboutPage";
import FeaturesPanel from "@/app/panelPublicitario/features";
import PricePage from "./price";
import Header from "./header";
export default function pagina() {
  return (
    <div className=" bg-slate-950">
      <Header />
      <AboutPage />
      <FeaturesPanel />
      <PricePage />
    </div>
  );
}
