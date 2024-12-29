import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../../utils/apiConfig";

function Collections() {
  const [collections, setCollections] = useState([]);

  const fetchCollections = async () => {
    try {
      const response = await api.get("/client/collections");
      setCollections(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(response);
    }
  };

  useEffect(() => {
    fetchCollections();
    return () => {};
  }, []);

  return (
    <Box
      sx={{
        p: {
          xs: "30px 25px", // Taille pour les petits écrans
          sm: "50px 40px",
          md: "50px 50px",
          lg: "75px 100px", // Taille pour les écrans plus grands
        },
      }}
    >
      <Typography
        variant="h2"
        textAlign="center"
        gutterBottom
        sx={{
          fontSize: {
            xs: "1rem", // Taille pour les petits écrans
            sm: "2rem",
            md: "2.5rem",
            lg: "3rem", // Taille pour les écrans plus grands
          },
          mb: 4,
        }}
      >
        Discover our Collections
      </Typography>

      <Grid container spacing={5} justifyContent="center">
        {collections.map((collection) => (
          <Grid item xs={12} sm={12} md={12} lg={12} key={collection.id}>
            <Box>
              {/* Image ajustée avec height et objectFit */}
              <Box
                component="img"
                src={"http://localhost:3000/api/" + collection.photo}
                alt={collection.nom}
                sx={{
                  width: "100%",
                  height: {
                    xs: "150px", // Petite hauteur pour les petits écrans
                    sm: "200px", // Moyenne hauteur pour les écrans moyens
                    md: "300px", // Grande hauteur pour les écrans larges
                    lg: "350px",
                  },
                  objectFit: "cover",
                }}
              />
              {/* Nom de la collection en dessous à gauche */}
              <Typography
                variant="h6"
                fontWeight="900"
                textTransform="uppercase"
                letterSpacing="1px"
                mt={1}
                textAlign="left"
                display="inline-block"
                sx={{
                  fontSize: {
                    xs: "0.55rem", // Taille pour les petits écrans
                    sm: "0.6rem",
                    md: "0.68rem",
                    lg: "0.7rem", // Taille pour les écrans plus grands
                  },
                  "&:hover": {
                    borderBottom: "solid 1px",
                    cursor: "pointer",
                  },
                }}
              >
                {collection.nom}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Collections;
