import { Box, Typography, Portal, Divider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../utils/apiConfig";
import { SectionFilterContext } from "../hooks/SectionFilterContext";
import { useNavigate } from "react-router-dom";

function Dropdown({ sectionId, anchorEl, onMouseLeave }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { setCategoryFilter, setSubCategoryFilter } =
    useContext(SectionFilterContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/client/filtred`, {
          params: { sectionId },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    if (sectionId) {
      fetchCategories();
    }
  }, [sectionId]);

  // Gestion de clic pour catégorie et sous-catégorie
  const handleCategoryClick = (categoryId) => {
    setCategoryFilter(categoryId); // Met à jour le filtre de catégorie dans le contexte
    navigate("/products", { state: { idSection: sectionId } });
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSubCategoryFilter(subCategoryId); // Met à jour le filtre de sous-catégorie dans le contexte
  };

  if (!anchorEl) return null;

  const { bottom } = anchorEl.getBoundingClientRect();

  return (
    <Portal>
      <div
        onMouseLeave={onMouseLeave}
        style={{
          position: "fixed",
          top: bottom,
          left: "0%",
          zIndex: 1000,
          width: "100vw",
          background: "white",
          padding: "20px 0px",
          boxShadow: "0px 5px 10px #00000064",
        }}
      >
        <Box
          sx={{
            width: "50vw",
            backgroundColor: "white",
            padding: "16px 20px",
            display: "flex",
            gap: "20px",
            overflow: "hidden",
            margin: "0px auto",
          }}
        >
          {/* Section des liens - Catégories */}
          <Box sx={{ flex: 4 }} display="flex" gap="50px">
            {categories.map((category) => (
              <div key={category.id_cat}>
                <div>
                  <Typography
                    borderBottom="solid 1px #000"
                    variant="h5"
                    sx={{
                      fontWeight: "500",
                      pb: 0.3,
                      mb: 1,
                      fontSize: "0.7rem",
                      "&:hover": {
                        cursor: "pointer",
                        color: "#5f5f5f",
                        borderBottomColor: "#5f5f5f",
                        transition: "0.3s",
                      },
                    }}
                    onClick={() => {
                      handleCategoryClick(category.id_cat);
                      handleSubCategoryClick(null);
                    }}
                  >
                    {" "}
                    {category.nom_cat} {/* Nom de la catégorie */}
                  </Typography>
                </div>
                {category.sous_categories.map((subCategory) => (
                  <Typography
                    key={subCategory.id_sous_cat}
                    variant="body2"
                    textTransform="capitalize"
                    onClick={() => {
                      handleSubCategoryClick(subCategory.id_sous_cat);
                      handleCategoryClick(category.id_cat);
                      console.log(subCategory);
                    }}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        color: "#5f5f5f",
                        borderBottomColor: "#5f5f5f",
                        transition: "0.3s",
                      },
                    }}
                  >
                    {subCategory.nom_sous_cat} {/* Nom de la sous-catégorie */}
                  </Typography>
                ))}
              </div>
            ))}
          </Box>

          {/* Divider entre le contenu et les images */}
          <Divider orientation="vertical" flexItem />

          {/* Section des images (si besoin) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              ml: 2,
            }}
          >
            <Box
              component="img"
              src="https://via.placeholder.com/150"
              alt="Collection 1"
              sx={{ width: "150px", borderRadius: "4px" }}
            />
            <Box
              component="img"
              src="https://via.placeholder.com/150"
              alt="Collection 2"
              sx={{ width: "150px", borderRadius: "4px" }}
            />
          </Box>
        </Box>
      </div>
    </Portal>
  );
}

export default Dropdown;
