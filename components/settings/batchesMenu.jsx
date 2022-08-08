import { useContext} from "react";
import { CampaignContext } from "../../contexts/campaignContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"
import DataTable from "../datatable";


export const BatchesMenu = () => {

const {batches, handleAdd, handleEdit, handleDelete} = useContext(CampaignContext);
const headers = [
    "Number",
    "Color"
  ];

    return (
      <Box sx={{ height: "100%" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Campaign
        </Typography>
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

  