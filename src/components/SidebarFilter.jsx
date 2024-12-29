import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import api from "../utils/apiConfig";

const SidebarFilter = ({ filters, setFilters }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await api.get("/taille");
        setSizes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tailles :", error);
      }
    };
    const fetchColors = async () => {
      try {
        const response = await api.get("/couleur");
        setColors(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des couleurs :", error);
      }
    };
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/materiel");
        setMaterials(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des matériaux :", error);
      }
    };

    fetchSizes();
    fetchColors();
    fetchMaterials();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newValue,
    }));
  };

  const handleSizeChange = (sizeId) => {
    setFilters((prevFilters) => {
      const newSizes = prevFilters.sizes.includes(sizeId)
        ? prevFilters.sizes.filter((id) => id !== sizeId)
        : [...prevFilters.sizes, sizeId];
      return { ...prevFilters, sizes: newSizes };
    });
  };

  const handleColorChange = (colorId) => {
    setFilters((prevFilters) => {
      const newColors = prevFilters.colors.includes(colorId)
        ? prevFilters.colors.filter((id) => id !== colorId)
        : [...prevFilters.colors, colorId];
      return { ...prevFilters, colors: newColors };
    });
  };

  const handleMaterialChange = (materialId) => {
    setFilters((prevFilters) => {
      const newMaterials = prevFilters.materials
        ? prevFilters.materials.includes(materialId)
          ? prevFilters.materials.filter((id) => id !== materialId)
          : [...prevFilters.materials, materialId]
        : [materialId];
      return { ...prevFilters, materials: newMaterials };
    });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      sizes: [],
      colors: [],
      materials: [],
    });
  };

  const filterContent = (
    <Box
      sx={{
        width: 250,
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6">Filters</Typography>

      <Box sx={{ marginTop: 3 }}>
        <Typography>Price</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          sx={{ marginTop: 2 }}
        />
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Typography>Sizes</Typography>
        {sizes.map((size) => (
          <FormControlLabel
            key={size.id}
            control={
              <Checkbox
                checked={filters.sizes.includes(size.id)}
                onChange={() => handleSizeChange(size.id)}
              />
            }
            label={size.valeur}
          />
        ))}
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Typography>Colors</Typography>
        <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
          {colors.map((color) => (
            <Box
              key={color.id}
              onClick={() => handleColorChange(color.id)}
              sx={{
                width: 30,
                height: 30,
                background: color.photo
                  ? `url(http://localhost:3000/api/${color.photo}) center/cover`
                  : color.hexa,
                borderRadius: "50%",
                cursor: "pointer",
                boxShadow: `0px 0px 10px ${
                  filters.colors.includes(color.id) && "#00000088"
                }`,
                transition: ".2s ease",
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}>
        <Typography>Materials</Typography>
        {materials.map((material) => (
          <FormControlLabel
            key={material.id}
            control={
              <Checkbox
                checked={filters.materials?.includes(material.id) || false}
                onChange={() => handleMaterialChange(material.id)}
              />
            }
            label={material.name}
          />
        ))}
      </Box>

      <Button variant="outlined" onClick={clearFilters} sx={{ marginTop: 3 }}>
        Reset filters
      </Button>
    </Box>
  );

  return (
    <>
      {isSmallScreen ? (
        <>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ position: "absolute", top: 20, left: 20 }}
          >
            <FilterListIcon />
          </IconButton>

          <Drawer
            anchor="left"
            open={openDrawer}
            onClose={handleDrawerToggle}
            PaperProps={{
              sx: { width: 300, overflowY: "auto" },
            }}
          >
            {filterContent}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            width: 300,
            borderRight: "solid 1px #63636349",
            height: "auto",
            overflowY: "none",
            padding: 2,
          }}
        >
          {filterContent}
        </Box>
      )}
    </>
  );
};

export default SidebarFilter;
