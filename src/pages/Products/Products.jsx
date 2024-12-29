import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import api from "../../utils/apiConfig";
import SidebarFilter from "../../components/SidebarFilter";
import ProductCard from "../../components/ProductCard"; // Import the ProductCard component
import { useLocation } from "react-router-dom";
import { SectionFilterContext } from "../../hooks/SectionFilterContext";

const Products = () => {
  const location = useLocation();
  const state = location.state;
  const { sectionFilter, categoryFilter, subCategoryFilter } =
    useContext(SectionFilterContext);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    materials: [],
    section: state ? [state.idSection] : [],
  });
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (filterParams) => {
    try {
      const response = await api.get("/client/produits", {
        params: {
          category: categoryFilter,
          subcategory: subCategoryFilter,
          priceMax: filterParams.priceRange ? filterParams.priceRange[1] : null,
          size: filterParams.sizes.length > 0 ? filterParams.sizes : null,
          color: filterParams.colors.length > 0 ? filterParams.colors : null,
          material:
            filterParams.materials.length > 0 ? filterParams.materials : null,
          section: sectionFilter, // Use sectionFilter from context
        },
      });
      setProducts(response.data);
      console.log("products ", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, sectionFilter, categoryFilter, subCategoryFilter]);

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

  return (
    <Box
      sx={{
        display: "flex",
        textAlign: "center",
        padding: "50px 0px",
        position: "relative",
      }}
    >
      <SidebarFilter filters={filters} setFilters={setFilters} />

      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Typography
          variant="h1"
          sx={{ textAlign: "center", margin: "25px 0px 50px 0px" }}
          display="block"
        >
          Our Products
        </Typography>

        {products.length > 0 ? (
          <Box
            display="flex"
            justifyContent="space-evenly"
            flexWrap="wrap"
            rowGap="25px"
          >
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} /> // Using the ProductCard component
            ))}
          </Box>
        ) : (
          <Typography>No products found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Products;
