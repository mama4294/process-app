import { useContext} from "react";
import { CampaignContext } from "../../contexts/campaignContext";
import Box from "@mui/material/Box";
import DataTable from "./batchesInputTable";


export const BatchesMenu = ({handleClose}) => {
const {batches, handleAdd, handleEdit, handleDelete} = useContext(CampaignContext);

const headers = [
    "Number",
    "Color"
  ];

    return (
      <Box sx={{ height: "100%" }}>
        <Box sx={{ background: "white", p:2, mb: 3, borderRadius: 2 }}>
        <DataTable 
            headers={headers} 
            data={batches} 
            handleEdit={handleEdit} 
            handleAdd={handleAdd} 
            handleDelete={handleDelete}
            handleClose={handleClose}>
        </DataTable>
        </Box>
      </Box>
    );
  };


  // const DisplayLabel = ({label, value}) =>{
  //   return(
  //   <div style={{display: "flex", alignContent: "center", marginBottom: "5px"}}>
  //   <p style={{margin: "0px"}}>{label}</p>
  //   <p style={{margin: "0px", marginLeft: "10px", color:"gray"}}>{value}</p>
  // </div>
  //   )
  // }

  