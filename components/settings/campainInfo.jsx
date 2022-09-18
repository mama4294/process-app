import { useContext} from "react";
import { CampaignContext } from "../../contexts/campaignContext";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { minToFreindlyTime } from "../../utils/helperFunctions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"

export const CapmaignInfo = () =>{
    const {batches} = useContext(CampaignContext);
    const {calcCycleTime} = useContext(EquipmentContext);

    const bottleneck = calcCycleTime();
    const batchTime = minToFreindlyTime(bottleneck.duration)
    const totalTime = minToFreindlyTime(bottleneck.duration*batches.length);
    return(
        <Box sx={{ background: "white", p:2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Campaign Information
        </Typography>
        <Box sx={{p:2}}>
          <DisplayLabel label={"Total Time:"} value={totalTime}/>
          <DisplayLabel label={"Batch Time:"} value={batchTime}/>
          <DisplayLabel label={"Bottleneck:"} value={bottleneck.title}/>
        </Box>
      </Box>
    )
}