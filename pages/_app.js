import "../styles/globals.css";
import { EquipmentProvider } from "../contexts/equipmentContext";
import { CampaignProvider } from "../contexts/campaignContext";
import { ResourceProvider } from "../contexts/resourceContext";
import { TitleProvider } from "../contexts/titleContext";

function MyApp({ Component, pageProps }) {
  return (
    <TitleProvider>
      <CampaignProvider>
        <EquipmentProvider>
          <ResourceProvider>
            <Component {...pageProps} />
          </ResourceProvider>
        </EquipmentProvider>
      </CampaignProvider>
    </TitleProvider>
  );
}

export default MyApp;
