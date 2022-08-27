import Head from 'next/head'
import EquipmentOccupancyChart from "../components/equipment/equipmentOccupancy";
import ResourcePage from "../components/resources/resourcePage";
import ActionBar from "../components/actionBar";
import Navbar from "../components/navbar";
import { useContext, useState } from "react";
import { EquipmentContext } from "../contexts/equipmentContext";

export default function Home() {
  const { openFormNew } = useContext(EquipmentContext);
  const [view, setView] = useState("Chart");

  return (
    <>
      <Head>
      <title>Resource Visualizer</title>
      <meta name="Resource Visualizer" content="An engineering tool for visualizing processes" />       
      <link rel="icon" href="/favicon.ico" />
  </Head>
      <Navbar />
      <ActionBar handleNew={openFormNew} view={view} setView={setView} />
      {view === "Chart" && <EquipmentOccupancyChart />}
      {view === "Resources" && <ResourcePage />}
    </>
  );
}
