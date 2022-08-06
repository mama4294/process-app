import React, { useState } from "react";
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
import MailIcon from "@mui/icons-material/Mail";
import { blueGrey } from "@mui/material/colors";
import { useWindowWide } from "../hooks/windowWidth";

const Settings = ({ open, handleClose }) => {
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
        variant="temporary"
      >
        <Box sx={{ display: "flex" }}>
          <AppBar position="static" sx={{ zIndex: 1201 }}>
            <Toolbar>
              <>
                <IconButton onClick={handleClose}>
                  <CloseIcon sx={{ color: blueGrey[50] }} />
                </IconButton>
                <h1>Settings</h1>
              </>
            </Toolbar>
          </AppBar>
          <Sidebar width={sideBarWidth} />
        </Box>
      </Drawer>
    </div>
  );
};

const Sidebar = ({ width }) => {
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
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Settings;
