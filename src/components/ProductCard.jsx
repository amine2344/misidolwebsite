import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNavigate } from "react-router-dom"; // Import pour redirection

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  console.log("product", product);
  const handleViewProduct = () => {
    navigate("/product", { state: { productId: product.productId } }); // Passe l'ID du produit via l'état
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "max-content",
        gap: "10px",
        transition: "0.3s ease-in-out",
      }}
    >
      <Box
        minWidth="150px"
        minHeight="300px"
        width="300px"
        height="450px"
        sx={{
          backgroundImage: product.photos?.cover
            ? `url(http://localhost:3000/api/${product.photos.cover})`
            : "url(https://tolosana.univ-toulouse.fr/sites/tolosana.univ-toulouse.fr/themes/tolosana/images/no-image.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&:hover": {
            backgroundImage: product.photos?.coverHover
              ? `url(http://localhost:3000/api/${product.photos.coverHover})`
              : "url(https://tolosana.univ-toulouse.fr/sites/tolosana.univ-toulouse.fr/themes/tolosana/images/no-image.jpg)",
          },
        }}
        id={`product-image-${product.productId}`}
      ></Box>
      <Box display="flex" alignItems="end" justifyContent="space-between">
        <Box>
          <Tooltip title={product.productName}>
            <Typography
              variant="h5"
              mb={1}
              sx={{
                cursor: "pointer",
                textTransform: "capitalize",
                textAlign: "left",
              }}
            >
              {product.productName}
            </Typography>
          </Tooltip>
          {product.stockQuantity <= 0 ? (
            <Tooltip title="Unvailable" placement="bottom">
              <Box
                sx={{
                  background: "#a0512dd8",
                  p: "2.5px 25px",
                  "&:hover": {
                    background: "#af572ee4",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    cursor: "default",
                    color: "#fff",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Unvailable
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            <Tooltip title={`${product.productPrice} €`}>
              <Typography variant="body1" sx={{ cursor: "pointer" }}>
                {product.productPrice} €
              </Typography>
            </Tooltip>
          )}
        </Box>
        <Tooltip title="Add to cart" placement="right">
          <IconButton onClick={handleViewProduct}>
            <ShoppingBagOutlinedIcon sx={{ width: "20px" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ProductCard;
