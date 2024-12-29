import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Divider } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import api from "../utils/apiConfig";

const ShoppingCart = ({ show }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "EUR"
  ); // Default payment currency
  const [conversionRates, setConversionRates] = useState({});
  const [loading, setLoading] = useState(true);

  // Function to fetch conversion rates
  const fetchConversionRates = async () => {
    try {
      const response = await api.get("/client/currency");
      setConversionRates(response.data.rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of cart data and conversion rates
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    fetchConversionRates();
  }, []);

  const updateCartItem = (productId, colorId, sizeId, newQuantity) => {
    const updatedCart = cart
      .map((item) => {
        if (
          item.productId === productId &&
          item.selectedColor.colorId === colorId &&
          item.selectedSize.sizeId === sizeId
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeCartItem = (productId, colorId, sizeId) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.selectedColor.colorId === colorId &&
          item.selectedSize.sizeId === sizeId
        )
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2).toLocaleString("en-EN");
  };

  const totalPriceInEuro = cart.reduce((total, item) => {
    return total + item.productPrice * item.quantity;
  }, 0);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    // Save selected currency to localStorage
    localStorage.setItem("currency", event.target.value);
  };

  return (
    <Box
      p={3}
      position="absolute"
      sx={{
        background: "#fff",
        zIndex: 9999,
        width: "max-content",
        boxShadow: "0px 0px 10px #00000054",
        top: "7.5%",
        right: "2.5%",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        My Cart
      </Typography>
      <Divider />

      {loading ? (
        <Typography sx={{ textAlign: "center", pt: 1 }}>Loading...</Typography>
      ) : cart.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <Box
            display="flex"
            flexDirection="column"
            maxHeight="400px"
            overflow="scroll"
            gap="20px"
            p={2}
            pr={3}
          >
            {cart.map((item, index) => (
              <Box key={index} display="flex" flexDirection="column" mb={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box
                    width="100px"
                    height="125px"
                    sx={{
                      borderRadius: "8px",
                      marginRight: 2,
                      boxShadow: "0px 0px 5px #0000005a",
                    }}
                  >
                    <img
                      src={`http://localhost:3000/api/${item.selectedColor.colorPhotos[0].photoPath}`}
                      alt={item.productName}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>

                  <Box flexGrow={1}>
                    <Typography variant="h6">{item.productName}</Typography>
                    <Typography variant="body1">
                      Color: {item.selectedColor.colorName}
                    </Typography>
                    <Typography variant="body1">
                      Size: {item.selectedSize.sizeName}
                    </Typography>
                    <Typography variant="body1">
                      Price: {formatPrice(item.productPrice)} EUR
                    </Typography>
                    <Typography variant="body2" color="gray">
                      Quantity Added to Cart:
                    </Typography>

                    <Box display="flex" alignItems="center" gap="10px">
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateCartItem(
                            item.productId,
                            item.selectedColor.colorId,
                            item.selectedSize.sizeId,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity === 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateCartItem(
                            item.productId,
                            item.selectedColor.colorId,
                            item.selectedSize.sizeId,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.stockQuantity}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          removeCartItem(
                            item.productId,
                            item.selectedColor.colorId,
                            item.selectedSize.sizeId
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              Total Price: {formatPrice(totalPriceInEuro)} EUR
            </Typography>

            <select
              value={currency}
              onChange={handleCurrencyChange}
              variant="outlined"
              style={{
                padding: "5px 10px",
                border: "none",
                borderRadius: "0px",
                width: "100px",
              }}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
              <option value="UAH">UAH</option>
            </select>
          </Box>
        </>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => {
          navigate("/shoppingCard");
          show();
        }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default ShoppingCart;
