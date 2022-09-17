import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Settings from "./settings/settings";
import TextInput from "../components/inputs/textInput";
import styles from "../styles/components.module.css";
import SaveIcon from "@mui/icons-material/Save";
import LaunchIcon from "@mui/icons-material/Launch";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { EquipmentContext } from "../contexts/equipmentContext";
import { CampaignContext } from "../contexts/campaignContext";
import { ResourceContext } from "../contexts/resourceContext";
import { TitleContext } from "../contexts/titleContext";
import { loadFromJSON, saveAsJSON } from "../utils/fileSystem";

const Navbar = () => {
  const { equipment, setEquipment, saveEquipment } =
    useContext(EquipmentContext);
  const { batches, setBatches, saveBatches } = useContext(CampaignContext);
  const { resourceOptions, setResourceOptions, saveResources } =
    useContext(ResourceContext);
  const { projectTitle, setProjectTitle, saveTitle } = useContext(TitleContext);
  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  console.log("Resource Options", resourceOptions);

  const setProject = (data) => {
    setEquipment(data.equipment);
    setBatches(data.batches);
    setResourceOptions(data.resourceOptions);
    setProjectTitle(data.projectTitle);
    storeDataInLocalStorage(data);
  };

  const storeDataInLocalStorage = (data) => {
    saveTitle(data.projectTitle);
    saveEquipment(data.equipment);
    saveBatches(data.batches);
    saveResources(data.resourceOptions);
  };

  const handleSave = () => {
    const saveObj = { projectTitle, equipment, batches, resourceOptions };
    saveAsJSON(saveObj, window.handle)
      .then(() => storeDataInLocalStorage(saveObj))
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSaveAs = () => {
    const saveObj = { projectTitle, equipment, batches, resourceOptions };
    saveAsJSON(saveObj, null).catch((error) => {
      console.error(error);
    });
  };

  const handleChangeTitle = (e) => {
    setProjectTitle(e.target.value);
  };

  const handleOpenFile = () => {
    loadFromJSON()
      .then((data) => {
        console.log(data);
        setProject(data);
      })
      .catch((error) => {
        // if user cancels, ignore the error
        if (error.name === "AbortError") {
          return;
        } else {
          console.error(error);
        }
      });
  };

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: "none" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOpenSettings}
          >
            <MenuIcon />
          </IconButton>
          <MenuDropdown
            handleSave={handleSave}
            handleSaveAs={handleSaveAs}
            handleOpenFile={handleOpenFile}
          />
          <TextInput
            className={styles.projectTitle}
            value={projectTitle}
            onChange={handleChangeTitle}
            type="text"
            placeholder="Project Title"
          />
          <Button color="inherit" onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Settings open={openSettings} handleClose={handleCloseSettings} />
    </>
  );
};

const MenuDropdown = ({ handleSave, handleSaveAs, handleOpenFile }) => {
  //Dropdown placement
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //confirmation modal
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const handleOpenConfirmation = () => setConfirmationOpen(true);
  const handleCloseConfirmation = () => setConfirmationOpen(false);

  const handleNothing = (event) => {
    alert("function not made yet");
  };

  return (
    <div>
      <ConfirmationModal
        open={confirmationOpen}
        handleClose={handleCloseConfirmation}
        handleOpenFile={handleOpenFile}
      />
      <Tooltip title="Menu">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          id="menuDropdown-button"
          aria-controls={open ? "menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="outlined"
          disableElevation
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleNothing}>
          <ListItemIcon>
            <LaunchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New Project</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenConfirmation}>
          <ListItemIcon>
            <FileOpenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSave}>
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSaveAs}>
          <ListItemIcon>
            <SaveAsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save As..</ListItemText>
        </MenuItem>
        <MenuItem>
          <FileUpload />
        </MenuItem>
      </Menu>
    </div>
  );
};

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    alert("Submit");
    // const formData = new FormData();
    // formData.append('File', selectedFile);

    // fetch(
    // 	'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
    // 	{
    // 		method: 'POST',
    // 		body: formData,
    // 	}
    // )
    // 	.then((response) => response.json())
    // 	.then((result) => {
    // 		console.log('Success:', result);
    // 	})
    // 	.catch((error) => {
    // 		console.error('Error:', error);
    // 	});
  };

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ open, handleClose, handleOpenFile }) => {
  const handleNoSave = () => {
    handleOpenFile();
    handleClose();
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmation modal"
        aria-describedby="confirmation modal"
      >
        <div
          style={{
            background: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "background.paper",
            padding: "16px",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              textAlign: "center",
              maxWidth: "62%",
              alignSelf: "center",
              marginBottom: "20px",
              color: "gray",
            }}
          >
            Do you want to save changes to your current project?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <div style={{ flexShrink: "0" }}>
              <Button onClick={handleNoSave}>No</Button>
              <Button variant="contained">Yes</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
