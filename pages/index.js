import Head from "next/head";
import EquipmentOccupancyChart from "../components/equipment/equipmentOccupancy";
import ResourcePage from "../components/resources/resourcePage";
import ActionBar from "../components/actionBar";
import Navbar from "../components/navbar";
import { useContext, useState, useEffect } from "react";
import { TitleContext } from "../contexts/titleContext";
import { viewSelectorOptions } from "../components/actionBar";

export default function Home() {
  const { projectTitle } = useContext(TitleContext);
  const [view, setView] = useState(viewSelectorOptions.equipment);

  useEffect(() => {
    console.log("view", view);
  }, [view]);

  return (
    <>
      <Head>
        <title>{projectTitle}</title>
        <meta
          name="Resource Visualizer"
          content="An engineering tool for visualizing batch equipment, operations, and resources"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <ActionBar view={view} setView={setView} />
      <div style={{ marginTop: "120px" }}>
        {view === viewSelectorOptions.equipment && <EquipmentOccupancyChart />}
        {view === viewSelectorOptions.resources && <ResourcePage />}
      </div>
    </>
  );
}
