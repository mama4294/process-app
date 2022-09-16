import IconButton from "@mui/material/IconButton";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FunctionsIcon from "@mui/icons-material/Functions";
import BarChartIcon from "@mui/icons-material/BarChart";

const ActionMenu = ({
  open,
  anchorEl,
  handleClick,
  handleClose,
  showTotals,
  handleToggleTotals,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuList>
          {showTotals ? (
            <MenuItem onClick={handleToggleTotals}>
              <ListItemIcon>
                <BarChartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Show Individual Operations</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem onClick={handleToggleTotals}>
              <ListItemIcon>
                <FunctionsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Show Summation</ListItemText>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </div>
  );
};

export default ActionMenu;
