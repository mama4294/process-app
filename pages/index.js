import Head from "next/head";
import EquipmentOccupancyChart from "../components/equipment/equipmentOccupancy";
import ResourcePage from "../components/resources/resourcePage";
import ActionBar from "../components/actionBar";
import Navbar from "../components/navbar";
import { useContext, useState } from "react";
import { EquipmentContext } from "../contexts/equipmentContext";
import { TitleContext } from "../contexts/titleContext";

export default function Home() {
  const { openFormNew } = useContext(EquipmentContext);
  const { projectTitle } = useContext(TitleContext);
  const [view, setView] = useState("Chart");

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
      <ActionBar handleNew={openFormNew} view={view} setView={setView} />
      <div style={{ marginTop: "120px" }}>
        {view === "Chart" && <EquipmentOccupancyChart />}
        {view === "Resources" && <ResourcePage />}
      </div>
    </>
  );
}
