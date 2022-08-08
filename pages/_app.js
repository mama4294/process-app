import "../styles/globals.css";
import { EquipmentProvider } from "../contexts/equipmentContext";
import { CampaignProvider } from "../contexts/campaignContext";

function MyApp({ Component, pageProps }) {
  return (
    <CampaignProvider>
      <EquipmentProvider>
        <Component {...pageProps} />
      </EquipmentProvider>
    </CampaignProvider>
  );
}

export default MyApp;
