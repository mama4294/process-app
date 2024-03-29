import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import { blueGrey } from "@mui/material/colors";
import { useWindowWide } from "../../hooks/windowWidth";
import { BatchesMenu } from "./batchesMenu";
import { ResourcesMenu } from "./resourcesMenu";

const Settings = ({ open, handleClose }) => {
  const menuItems = [
    { id: 0, title: "Batches", icon: "ClearAllIcon" },
    { id: 1, title: "Resources", icon: "BloodtypeIcon" },
    { id: 2, title: "Profile", icon: "PersonIcon" },
  ];
  const [selectedMenu, setSelectedMenu] = useState(menuItems[0].title);

  const windowWidth = useWindowWide();
  const drawerWidth =
    windowWidth < 700 ? windowWidth * 0.95 : windowWidth * 0.8;
  const sideBarWidth = windowWidth * 0.2;
  return (
    <div>
      <Drawer
        anchor="left"
        PaperProps={{
          sx: {
            width: drawerWidth,
          },
        }}
        open={open}
        onClose={handleClose}
        // transitionDuration={10000}
      >
        <Box sx={{ display: "flex", height: "100%" }}>
          <AppBar
            position="fixed"
            sx={{ zIndex: 1201, width: drawerWidth, left: 0 }}
          >
            <Toolbar>
              <>
                <IconButton onClick={handleClose}>
                  <CloseIcon sx={{ color: blueGrey[50] }} />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Settings
                </Typography>
              </>
            </Toolbar>
          </AppBar>
          <Sidebar
            menuItems={menuItems}
            width={sideBarWidth}
            setSelectedMenu={setSelectedMenu}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              background: "#DDDDDD",
              overflow: "hidden",
              marginTop: "64px",
            }}
          >
            {selectedMenu === "Batches" && <BatchesMenu />}
            {selectedMenu === "Resources" && <ResourcesMenu />}
            {selectedMenu === "Profile" && <ProfileMenu />}
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

const Sidebar = ({ menuItems, width, setSelectedMenu }) => {
  const handleChange = (title) => {
    setSelectedMenu(title);
  };

  const getIcon = (icon) => {
    switch (icon) {
      case "PersonIcon":
        return <PersonIcon />;
      case "ClearAllIcon":
        return <ClearAllIcon />;
      case "BloodtypeIcon":
        return <BloodtypeIcon />;
      default:
        return <MailIcon />;
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: width,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton onClick={() => handleChange(item.title)}>
                <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

const ProfileMenu = () => {
  const inputFile = useRef(null);

  const loadFile = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  function readImage(file) {
    // Check if the file is an image.
    if (file.type && !file.type.startsWith("json/")) {
      console.log("File is not a JSON", file.type, file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      img.src = event.target.result;
    });
    reader.readAsDataURL(file);
  }

  return (
    <>
      <h6>Profile</h6>
      <input
        type="file"
        id="file"
        accept=".json"
        ref={inputFile}
        style={{ display: "none" }}
      />
      <button onClick={loadFile}>Load</button>
    </>
  );
};

export default Settings;
