import React, { useEffect, useState } from "react";
import api from "../utils/apiConfig";
import { Box, Typography, CircularProgress } from "@mui/material";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react"; // Importer Swiper et SwiperSlide
import "swiper/swiper-bundle.css"; // Importer les styles de Swiper
import { Autoplay } from "swiper/modules"; // Importer le module Autoplay

function StyleProduct({ productId }) {
  const [style, setStyle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStyle = async () => {
    try {
      const response = await api.get(`/client/style/${productId}`);
      setStyle(response.data);
      setError(null);
    } catch (error) {
      setError("Erreur lors de la récupération du style.");
      if (error.response && error.response.status === 404) {
        alert("Aucun style trouvé");
      }
      console.error("Erreur lors de la récupération du style :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyle();
  }, [productId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!style) {
    return <Typography>Aucun style disponible</Typography>;
  }

  const productNames = style.associatedProducts
    ? style.associatedProducts.map((product) => product.productName)
    : [];

  return (
    <Box
      sx={{ background: "#f0f0f0", p: { xs: 2, sm: 3, md: 5 }, mt: 5, mb: 5 }}
    >
      <Typography variant="body1" sx={{ fontWeight: 900 }} textAlign="center">
        Shop The Look
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Box
          display="flex"
          alignItems="center"
          m={{ xs: "10px 0", md: "25px 5%" }}
          gap={{ xs: "20px", sm: "30px", md: "50px" }}
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="center"
          sx={{ background: "white", p: { xs: 2, sm: 3 }, width: "100%" }}
        >
          {/* Affichage de l'image principale du style si elle existe */}
          {style.mainPhoto && (
            <img
              src={`http://localhost:3000/api/${style.mainPhoto.photoPath}`}
              alt={style.style.description_style}
              style={{
                width: "100%",
                maxWidth: "450px",
                height: "auto",
              }}
            />
          )}

          {/* Carrousel des produits associés */}
          <Box width={{ xs: "100%", md: "50%" }}>
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              pagination={{ clickable: true }}
              autoplay={{
                // Ajoutez cette ligne pour activer l'autoplay
                delay: 3000, // Délai entre les transitions en ms
                disableOnInteraction: false, // Permet de continuer l'autoplay après une interaction
              }}
              modules={[Autoplay]} // Inclure le module Autoplay ici
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
              }}
            >
              {style.associatedProducts &&
              style.associatedProducts.length > 0 ? (
                style.associatedProducts.map((product) => (
                  <SwiperSlide key={product.productId}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))
              ) : (
                <Typography>Aucun produit associé</Typography>
              )}
            </Swiper>
          </Box>
        </Box>
        <Box
          width={{ xs: "100%", md: "max-content" }}
          mt={{ xs: 3, md: 0 }}
          textAlign={{ xs: "left", md: "left" }}
        >
          <Typography
            variant="body1"
            textAlign={{ xs: "center", md: "left" }}
            mb={1}
          >
            Styling
          </Typography>
          <Typography variant="body2">
            {style.style.description_style}
          </Typography>
          <Typography variant="body2">
            Wear this style with the{" "}
            {productNames.length > 0
              ? productNames.slice(0, -1).join(", ") +
                (productNames.length > 1 ? " and " : "") +
                productNames[productNames.length - 1]
              : ""}{" "}
            by ZIMMERMAN.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default StyleProduct;
