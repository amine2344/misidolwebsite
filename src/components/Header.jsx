import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/apiConfig";
import ShoppingCart from "./ShoppingCart";
import Dropdown from "./Dropdown";
import { SectionFilterContext } from "../hooks/SectionFilterContext";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMiddleScreen = useMediaQuery(theme.breakpoints.down("lg")); // Check for large screens
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // Check for large screens
  const isScreenAbove600px = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [sections, setSections] = useState([]);
  const [hoveredSectionId, setHoveredSectionId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { setSectionFilter } = useContext(SectionFilterContext);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleScroll = () => {
    setIsFixed(window.scrollY > 0);
  };

  const handleShowCart = () => {
    setShowCart(!showCart);
  };

  const fetchSections = async () => {
    try {
      const response = await api.get("section");
      setSections(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load sections. Please try again later.");
    }
  };

  const handleMouseEnter = (event, sectionId) => {
    setHoveredSectionId(sectionId);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setHoveredSectionId(null);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (location.pathname === "/") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [location]);

  useEffect(() => {
    fetchSections();
  }, []);

  const list = () => (
    <List>
      {sections.map((section) => (
        <ListItem
          button
          key={section.id}
          component={Link}
          to={{
            pathname: "/products",
            state: { idSection: section.id },
          }}
          onClick={() => {
            setSectionFilter(section.id);
          }} // Update filter
        >
          {section.name}
        </ListItem>
      ))}
    </List>
  );

  const getCartItems = () => {
    const items = localStorage.getItem("cart");
    return items ? JSON.parse(items) : [];
  };

  const handleToolbarMouseLeave = (event) => {
    // Vérifiez si le curseur n'est ni sur le `Dropdown` ni sur la `Toolbar`
    if (
      !anchorEl ||
      (!event.relatedTarget?.closest(".dropdown") &&
        !event.relatedTarget?.closest(".toolbar"))
    ) {
      setHoveredSectionId(null);
      setAnchorEl(null);
    }
  };

  // Gestion du survol dans le Dropdown
  const handleDropdownMouseLeave = () => {
    setHoveredSectionId(null);
    setAnchorEl(null);
  };

  return (
    <Box
      position={isFixed && location.pathname === "/" ? "fixed" : "static"}
      width="100vw"
      sx={{
        zIndex: 1300,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        overflow: "hidden",
        background: "white",
      }}
    >
      <Box
        p={"15px"}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection={{ xs: "column", sm: "row" }} // Responsive Flex Direction
      >
        {isScreenAbove600px && (
          <Box display="flex" gap={2}>
            <IconButton>
              <LocationOnOutlinedIcon
                sx={{ color: "#9d9d9d85", fontSize: "22px" }}
              />
            </IconButton>
            <IconButton>
              <LocalPhoneOutlinedIcon
                sx={{ color: "#9d9d9d85", fontSize: "22px" }}
              />
            </IconButton>
            <IconButton>
              <MailOutlineOutlinedIcon
                sx={{ color: "#9d9d9d85", fontSize: "22px" }}
              />
            </IconButton>
          </Box>
        )}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "100",
            textAlign: "center",
            letterSpacing: "-2px",
            cursor: "pointer",
            "&:hover": { color: "#2b2b2bb7", transition: "0.2s" },
          }}
          onClick={() => navigate("/")}
        >
          MISS IDOL
        </Typography>
        {isScreenAbove600px && (
          <Box display="flex" gap={2}>
            <IconButton>
              <SearchOutlinedIcon
                sx={{ color: "#9d9d9d85", fontSize: "22px" }}
              />
            </IconButton>
            <IconButton onClick={handleShowCart}>
              <ShoppingBagOutlinedIcon
                sx={{
                  color: "#9d9d9d85",
                  fontSize: "22px",
                  position: "relative",
                }}
              />
            </IconButton>
          </Box>
        )}
      </Box>

      <AppBar position="sticky" sx={{ background: "#fff", boxShadow: "none" }}>
        <Toolbar
          onMouseLeave={handleToolbarMouseLeave} // Ajoutez l'événement ici
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            margin: 0,
            padding: 0,
            background: !isScreenAbove600px
              ? "url(https://img.freepik.com/photos-gratuite/vagues-abstraites-dans-tons-points-bleus_23-2148231750.jpg?t=st=1730266567~exp=1730270167~hmac=c33f7f170f4dc356a86bf1cf0df0e3d2dbf0631ba7dc0862b1e9e1a41e201eca&w=826) center/cover no-repeat"
              : "white",
            filter:
              "grayscale(75%) sepia(18%)" /* Convertit l'image en noir et blanc */,
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{
                color: "black",
                margin: "50px auto",
                transition: "transform 0.3s ease", // Transition fluide
                transform: drawerOpen ? "rotate(90deg)" : "rotate(0deg)", // Tourne de 90° si `rotated` est true
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {(isLargeScreen || isMiddleScreen) && (
            <Box
              display={isMobile ? "none" : "flex"}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
              flexGrow={1}
              width="100%"
            >
              {sections.map((section) => (
                <Button
                  key={section.id}
                  sx={{
                    color: "#000",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    whiteSpace: "nowrap",
                    display: "flex",
                    gap: "10px",
                  }}
                  component={Link}
                  to={{
                    pathname: "/products",
                    state: { idSection: section.id },
                  }}
                  onClick={() => {
                    setSectionFilter(section.id);
                  }} // Update filter
                  onMouseEnter={(e) => handleMouseEnter(e, section.id)}
                >
                  <Typography variant="h6">{section.name} </Typography>
                  <Typography>|</Typography>
                </Button>
              ))}
              <Button
                sx={{
                  color: "#000",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                }}
                component={Link}
                to="/collections"
                onMouseEnter={() => handleMouseLeave()}
              >
                Collections
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {!isLargeScreen && (
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      )}

      {showCart && (
        <ShoppingCart cartItems={getCartItems()} show={handleShowCart} />
      )}

      {/* Render Dropdown only on large screens */}
      {isLargeScreen && hoveredSectionId && anchorEl && (
        <Dropdown
          sectionId={hoveredSectionId}
          anchorEl={anchorEl}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </Box>
  );
};

export default Header;
