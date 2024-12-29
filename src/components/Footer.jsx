import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/apiConfig"; // Ensure the apiConfig path is correct

function Footer() {
  const [sections, setSections] = useState([]);

  const fetchSections = async () => {
    try {
      const response = await api.get("section");
      setSections(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load sections for the footer. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const Item = ({ title, links }) => {
    return (
      <Box width="25%">
        <Typography
          sx={{
            borderBottom: "solid 2px #000",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "1px",
            pb: 0.5,
            mb: 1,
          }}
          variant="h6"
        >
          {title}
        </Typography>
        {links.map((link, index) => (
          <Typography
            key={index}
            variant="h6"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "1px",
              m: 0.5,
              ml: 0,
            }}
          >
            <Link
              to={link.path}
              style={{ color: "black", textDecoration: "none" }}
            >
              {link.link}
            </Link>
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        background: "#f1f1f1",
        width: "100%",
      }}
    >
      <Box
        m="auto"
        display="flex"
        alignItems="start"
        justifyContent="center"
        gap="20px"
        sx={{
          padding: "15px 22px",
          maxWidth: "1330px",
        }}
      >
        {/* Render dynamic sections here */}
        <Item
          title="Shop Now"
          links={sections.map((section) => ({
            link: section.name,
            path: `/products?section=${section.id}`,
          }))}
        />
        <Item
          title="Help"
          links={[
            { link: "About", path: "/about" },
            { link: "Order & Shipping", path: "/shipping" },
            { link: "Return Policy", path: "/return-policy" },
            { link: "Submit a Return Request", path: "/submit-return" },
            { link: "Size Guide", path: "/size-guide" },
            { link: "Brand Protection", path: "/brand-protection" },
          ]}
        />
        <Item
          title="Follow Us"
          links={[
            { link: "Instagram", path: "https://www.instagram.com" },
            { link: "Facebook", path: "https://www.facebook.com" },
            { link: "TikTok", path: "https://www.tiktok.com" },
            { link: "Pinterest", path: "https://www.pinterest.com" },
            { link: "YouTube", path: "https://www.youtube.com" },
            { link: "Weibo", path: "https://www.weibo.com" },
            { link: "WeChat", path: "https://www.wechat.com" },
          ]}
        />
      </Box>
    </Box>
  );
}

export default Footer;
