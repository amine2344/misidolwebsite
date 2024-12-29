import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Box,
} from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import api from "../../utils/apiConfig";
import StyleProduct from "../../components/StyleProduct";

const Product = () => {
  const theme = useTheme();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const productId = location.state?.productId;

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/client/produit/${productId}`);
      setProduct(response.data);
      console.log("produit", response.data);
      const allPhotos = response.data.colors.flatMap(
        (color) => color.colorPhotos
      );
      setPhotos(allPhotos);
      setLoading(false);

      if (response.data.colors.length > 0) {
        const defaultColor = response.data.colors[0];
        setSelectedColor(defaultColor.colorId);
        setFilteredPhotos(defaultColor.colorPhotos || []);
        setAvailableSizes(
          defaultColor.sizes.filter((size) => size.quantity > 0) || []
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch product");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setError("No product selected");
      setLoading(false);
    }
  }, [productId]);

  const handleNextImage = () => {
    if (filteredPhotos.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % filteredPhotos.length
      );
    }
  };

  const handlePrevImage = () => {
    if (filteredPhotos.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? filteredPhotos.length - 1 : prevIndex - 1
      );
    }
  };

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId);
    const selectedColorData =
      product.colors.find((color) => color.colorId === colorId) || {};
    setFilteredPhotos(selectedColorData.colorPhotos || []);
    const sizesWithStock =
      selectedColorData.sizes.filter((size) => size.quantity > 0) || [];
    setAvailableSizes(sizesWithStock);
    setSelectedSize(null); // Réinitialiser la taille sélectionnée
    setCurrentImageIndex(0);
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSize(sizeId);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select a color and size.");
      return;
    }

    const selectedProduct = {
      productId: product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      selectedColor: product.colors.find(
        (color) => color.colorId === selectedColor
      ),
      selectedSize: availableSizes.find((size) => size.sizeId === selectedSize),
      quantity: 1,
      stockQuantity: availableSizes.find((size) => size.sizeId === selectedSize)
        .quantity, // Stock disponible
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) =>
        item.productId === selectedProduct.productId &&
        item.selectedColor.colorId === selectedProduct.selectedColor.colorId &&
        item.selectedSize.sizeId === selectedProduct.selectedSize.sizeId
    );

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += 1; // Augmente la quantité du produit existant
      cart[existingProductIndex].stockQuantity -= 1; // Diminue le stock disponible
    } else {
      cart.push(selectedProduct); // Ajoute un nouveau produit
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          padding: "50px 0px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const availableColors = product.colors.filter((color) =>
    color.sizes.some((size) => size.quantity > 0)
  );

  const isColorAvailable = availableSizes.length > 0; // Vérifie si la couleur sélectionnée a des tailles disponibles

  return (
    <Box>
      <Box m="25px 5%">
        <Grid container spacing={4} sx={{ padding: theme.spacing(2) }}>
          {/* Images section */}
          <Grid item xs={12} md={6}>
            {filteredPhotos.length > 0 ? (
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: "absolute",
                    left: { xs: "-10px", sm: "-20px" },
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: theme.palette.action.hover,
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "450px", md: "500px" },
                    height: { xs: "350px", sm: "600px", md: "700px" },
                    backgroundColor: theme.palette.grey[300],
                    backgroundImage: `url(http://localhost:3000/api/${filteredPhotos[currentImageIndex]?.photoPath})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                />
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: "absolute",
                    right: { xs: "-10px", sm: "-20px" },
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: theme.palette.action.hover,
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No photos available for this product.
              </Typography>
            )}
          </Grid>

          {/* Product details section */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textTransform: "capitalize" }}
            >
              {product.productName}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ color: theme.palette.success.main }}
            >
              {`${product.productPrice} €`}
            </Typography>

            {product.productDescription &&
              product.productDescription != null && (
                <Typography variant="body1" sx={{}} gutterBottom>
                  {product.productDescription}
                </Typography>
              )}
            <Divider sx={{ marginY: theme.spacing(2) }} />

            {availableColors.length <= 0 ? (
              <Typography>NOT AVAILABLE</Typography>
            ) : (
              <>
                {/* Color selection */}
                <Typography
                  variant="h6"
                  fontWeight="900"
                  letterSpacing="1px"
                  gutterBottom
                >
                  ONLY AVAILABLE IN :
                </Typography>
                <Grid container spacing={1}>
                  {availableColors.map((color) => {
                    const sizesForColor = color.sizes.filter(
                      (size) => size.quantity > 0
                    );
                    return (
                      <Grid item key={color.colorId}>
                        <Button
                          variant={
                            selectedColor === color.colorId
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => {
                            handleColorChange(color.colorId);
                          }}
                          sx={{
                            minWidth: 0,
                            width: "30px",
                            height: "30px",
                            background:
                              color.colorPhotoPath !== null
                                ? `url(http://localhost:3000/api/${color.colorPhotoPath}) center/cover no-repeat`
                                : `${color.colorHex}`,
                            color: "#fff",
                            marginRight: theme.spacing(1),
                            marginBottom: theme.spacing(1),
                            borderColor: color.colorHex,
                            borderRadius: "50%",
                            position: "relative",
                            "&:hover": {
                              borderColor: color.colorHex,
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Size selection */}
                <Typography
                  variant="h6"
                  fontWeight="900"
                  letterSpacing="1px"
                  gutterBottom
                >
                  SIZE :
                </Typography>
                <Grid container spacing={1}>
                  {availableSizes.length > 0 ? (
                    availableSizes.map((size) => (
                      <Grid item key={size.sizeId}>
                        <Button
                          variant={
                            selectedSize === size.sizeId
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleSizeChange(size.sizeId)}
                        >
                          {size.sizeName}
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Typography>
                      No sizes available for selected color.
                    </Typography>
                  )}
                </Grid>

                {product.materials.length > 0 && (
                  <>
                    <Divider sx={{ marginY: theme.spacing(2) }} />
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        fontWeight="900"
                        letterSpacing="1px"
                        gutterBottom
                      >
                        MATERIALS
                      </Typography>
                      <ul>
                        {product.materials.map((material) => {
                          return (
                            <li
                              style={{
                                listStyleType: "square",
                              }}
                            >
                              {material.materialName}
                            </li>
                          );
                        })}
                      </ul>
                    </Grid>
                  </>
                )}
                {/* Add to cart button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  sx={{ marginTop: theme.spacing(2), width: "100%" }}
                  disabled={!isColorAvailable}
                >
                  Add to Cart
                </Button>
              </>
            )}
          </Grid>
        </Grid>
        <StyleProduct productId={productId} />
      </Box>
    </Box>
  );
};

export default Product;
