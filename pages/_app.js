import "../styles/globals.css";
import { EquipmentProvider } from "../contexts/equipmentContext";
import { CampaignProvider } from "../contexts/campaignContext";
import { ResourceProvider } from "../contexts/resourceContext";

function MyApp({ Component, pageProps }) {
  return (
    <CampaignProvider>
      <EquipmentProvider>
        <ResourceProvider>
          <Component {...pageProps} />
        </ResourceProvider>
      </EquipmentProvider>
    </CampaignProvider>
  );
}

export default MyApp;
