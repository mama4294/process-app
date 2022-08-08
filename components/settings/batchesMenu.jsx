import { useContext} from "react";
import { CampaignContext } from "../../contexts/campaignContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"
import DataTable from "../datatable";


export const BatchesMenu = () => {

const {batches, selection, handleAdd, handleToggle, handleToggleAll, handleEdit, handleDelete} = useContext(CampaignContext);
const headers = [
    "Batch Number",
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
            selection={selection} 
            handleEdit={handleEdit} 
            handleToggle={handleToggle} 
            handleToggleAll={handleToggleAll} 
            handleAdd={handleAdd} 
            handleDelete={handleDelete}>
        </DataTable>
        </Box>
      </Box>
    );
  };

  