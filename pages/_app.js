import "../styles/globals.css";
import { EquipmentProvider } from "../contexts/equipmentContext";

function MyApp({ Component, pageProps }) {
  return (
    <EquipmentProvider>
      <Component {...pageProps} />
    </EquipmentProvider>
  );
}

export default MyApp;
