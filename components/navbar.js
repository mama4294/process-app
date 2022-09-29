import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SettingsIcon from "@mui/icons-material/Settings";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import LoadingButton from "@mui/lab/LoadingButton";
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
import { Alert } from "@mui/material";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

const Navbar = () => {
  const { equipment, setEquipment, saveEquipment, resetEquipment } =
    useContext(EquipmentContext);
  const { batches, setBatches, saveBatches, resetBatches, defaultBatch } =
    useContext(CampaignContext);
  const {
    resourceOptions,
    setResourceOptions,
    saveResources,
    resetResources,
    defaultResouces,
  } = useContext(ResourceContext);
  const { projectTitle, setProjectTitle, saveTitle, resetTitle, defaultTitle } =
    useContext(TitleContext);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const setProject = (data) => {
    setEquipment(data.equipment);
    setBatches(data.batches);
    setResourceOptions(data.resourceOptions);
    setProjectTitle(data.projectTitle);
    storeDataInLocalStorage(data);
  };

  const storeDataInLocalStorage = (data) => {
    return new Promise((resolve, reject) => {
      console.log("Storing in local storage");
      saveTitle(data.projectTitle);
      saveEquipment(data.equipment);
      saveBatches(data.batches);
      saveResources(data.resourceOptions);
      resolve();
    });
  };

  const loadingIimer = () => {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      saveSuccessTimer();
    }, 1000);
  };

  const saveSuccessTimer = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1000);
  };

  const save = async (callback) => {
    const runCallback = () => {
      storeDataInLocalStorage(saveObj);
      typeof callback === "function" && callback();
    };

    const saveObj = { projectTitle, equipment, batches, resourceOptions };

    await saveAsJSON(saveObj, window.handle)
      .then((result) => {
        if (result.message) {
          console.error(result.message);
        } else {
          loadingIimer();
        }
      })
      .then(runCallback);
  };

  const saveAs = async () => {
    const saveObj = { projectTitle, equipment, batches, resourceOptions };
    await saveAsJSON(saveObj, null);
  };

  const newProject = () => {
    resetBatches();
    resetEquipment();
    resetResources();
    resetTitle();
    localStorage.clear();
    window.location.reload();
    const data = {
      projectTitle: defaultTitle,
      equipment: [],
      batches: [defaultBatch],
      resourceOptions: defaultResouces,
    };
    storeDataInLocalStorage(data);
  };

  const handleChangeTitle = (e) => {
    setProjectTitle(e.target.value);
  };

  const openFile = () => {
    loadFromJSON()
      .then((data) => {
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

  const saveButtonIcon = ({ loading, success }) => {
    if (loading) return <CircularProgress color="inherit" size={24} />;
    if (success) return <CheckIcon />;
    return;
  };

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: "none" }}>
        <Toolbar>
          <MenuDropdown
            save={save}
            saveAs={saveAs}
            openFile={openFile}
            newProject={newProject}
          />
          <TextInput
            className={styles.projectTitle}
            value={projectTitle}
            onChange={handleChangeTitle}
            type="text"
            placeholder="Project Title"
          />

          <Button
            onClick={save}
            variant="outlined"
            color="inherit"
            sx={
              saveSuccess && {
                bgcolor: "rgb(76, 175, 80)",
                "&:hover": { bgcolor: "rgb(56, 142, 60)" },
              }
            }
            startIcon={saveButtonIcon({
              loading: saveLoading,
              success: saveSuccess,
            })}
          >
            {saveLoading ? "Saving" : saveSuccess ? "Saved" : "Save"}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

const MenuDropdown = ({ save, saveAs, openFile, newProject }) => {
  //Dropdown placement
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    save();
    handleClose();
  };

  const handleSaveAs = () => {
    saveAs();
    handleClose();
  };

  const handleNewProject = () => {
    newProject();
    handleClose();
  };

  const handleOpenFile = () => {
    openFile();
    handleClose();
  };

  //confirmation modal
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    type: null,
  });
  const handleOpenConfirmation = (type) =>
    setConfirmationModal({ open: true, type: type });
  const handleCloseConfirmation = () =>
    setConfirmationModal({ open: false, type: null });

  return (
    <div>
      <ConfirmationModal
        modal={confirmationModal}
        handleClose={handleCloseConfirmation}
        handleOpenFile={handleOpenFile}
        handleSave={handleSave}
        handleNewProject={handleNewProject}
        save={save}
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
        <MenuItem onClick={() => handleOpenConfirmation("new")}>
          <ListItemIcon>
            <LaunchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New Project</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenConfirmation("open")}>
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
      </Menu>
    </div>
  );
};

const ConfirmationModal = ({
  modal,
  handleClose,
  handleOpenFile,
  handleSave,
  handleNewProject,
  save,
}) => {
  const handleConfirmation = async (saveSelected) => {
    const handleNextStep = () => {
      if (modal.type === "new") {
        handleNewProject();
      } else if (modal.type === "open") {
        handleOpenFile();
      } else {
        console.error("Modal action not recognized");
      }
    };

    if (saveSelected) {
      await save(handleNextStep);
    } else {
      handleNextStep();
    }

    handleClose();
  };

  return (
    <div>
      <Modal
        open={modal.open}
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
              <Button onClick={() => handleConfirmation(false)}>No</Button>
              <Button
                onClick={() => handleConfirmation(true)}
                variant="contained"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
