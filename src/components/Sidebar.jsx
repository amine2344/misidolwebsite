// src/components/Sidebar.js
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const Sidebar = ({ open, onClose, filters, onFilterChange }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <ListItem>
          <ListItemText primary="Filtres" />
        </ListItem>
        {filters.map((filter) => (
          <ListItem key={filter.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filter.checked}
                  onChange={() => onFilterChange(filter.id)}
                />
              }
              label={filter.label}
            />
          </ListItem>
        ))}
        {/* Ajoutez d'autres filtres selon vos besoins */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
