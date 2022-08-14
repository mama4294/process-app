import { useContext} from "react";
import { CampaignContext } from "../../contexts/campaignContext";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { minToFreindlyTime } from "../../utils/helperFunctions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"
import DataTable from "../datatable";
import TextInput from "../inputs/textInput" 
import { margin } from "@mui/system";


export const BatchesMenu = () => {
const {batches, handleAdd, handleEdit, handleDelete} = useContext(CampaignContext);
const {
  calcCycleTime,
} = useContext(EquipmentContext);


const bottleneck = calcCycleTime();
const batchTime = minToFreindlyTime(bottleneck.duration)
const totalTime = minToFreindlyTime(bottleneck.duration*batches.length);

const headers = [
    "Number",
    "Color"
  ];

    return (
      <Box sx={{ height: "100%" }}>
        <Box sx={{ background: "white", p:2, mt: 3, borderRadius: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Campaign Information
        </Typography>
        <Box sx={{p:2}}>
        <DisplayLabel label={"Total Time:"} value={totalTime}/>
        <DisplayLabel label={"Batch Time:"} value={batchTime}/>
        <DisplayLabel label={"Bottleneck:"} value={bottleneck.title}/>
        </Box>

        </Box>
        <Box sx={{ background: "white", p:2, mt: 3, borderRadius: 2 }}>
        <DataTable 
            headers={headers} 
            data={batches} 
            handleEdit={handleEdit} 
            handleAdd={handleAdd} 
            handleDelete={handleDelete}>
        </DataTable>
        </Box>
      </Box>
    );
  };


  const DisplayLabel = ({label, value}) =>{
    return(
    <div style={{display: "flex", alignContent: "center", marginBottom: "5px"}}>
    <p style={{margin: "0px"}}>{label}</p>
    <p style={{margin: "0px", marginLeft: "10px", color:"gray"}}>{value}</p>
  </div>
    )
  }

  