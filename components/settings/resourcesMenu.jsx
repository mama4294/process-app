import { useContext} from "react";
import { ResourceContext } from "../../contexts/resourceContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"
import DataTable from "./resourcesInputTable";


export const ResourcesMenu = ({handleClose}) => {

const {resourceOptions,handleAdd,handleEdit,handleDelete,} = useContext(ResourceContext);
const headers = [
    "Resource",
    "Unit",
    "Color"
  ];
    return (
      <Box sx={{ height: "100%" }}>
        <Box sx={{ background: "white", p:2, mb: 3, borderRadius: 2 }}>
        <DataTable 
            headers={headers} 
            data={resourceOptions} 
            handleEdit={handleEdit} 
            handleAdd={handleAdd} 
            handleDelete={handleDelete}
            handleClose={handleClose}>
        </DataTable>
        </Box>
      </Box>
    );
  };

  