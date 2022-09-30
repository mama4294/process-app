import Head from "next/head";
import EquipmentOccupancyChart from "../components/equipment/equipmentOccupancy";
import ResourcePage from "../components/resources/resourcePage";
import ActionBar from "../components/actionBar";
import Navbar from "../components/navbar";
import { useContext, useState, useEffect } from "react";
import { TitleContext } from "../contexts/titleContext";
import { viewSelectorOptions } from "../components/actionBar";
import { SummaryPage } from "../components/summary/summary";

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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1876d1" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <meta name="title" content="Process Visualizer" />
        <meta
          name="description"
          content="A tool for process engineers to visualize complex batch processes."
        />
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="https://example.com/"/> */}
        <meta property="og:title" content="Process Visualizer" />
        <meta
          property="og:description"
          content="A tool for process engineers to visualize complex batch processes."
        />
        <meta property="og:image" content="/processVisExample.png" />
        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:url" content="https://example.com/"/> */}
        <meta property="twitter:title" content="Process Visualizer" />
        <meta
          property="twitter:description"
          content="A tool for process engineers to visualize complex batch processes."
        />
        <meta property="twitter:image" content="/processVisExample.png" />
      </Head>
      <Navbar />
      <ActionBar view={view} setView={setView} />
      <div style={{ marginTop: "120px" }}>
        {view === viewSelectorOptions.equipment && <EquipmentOccupancyChart />}
        {view === viewSelectorOptions.resources && <ResourcePage />}
        {view === viewSelectorOptions.summary && <SummaryPage />}
      </div>
    </>
  );
}
