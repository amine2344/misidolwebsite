import { Box, Typography, Container } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
function Home() {
  return (
    <Box>
      <img
        src="https://www.zimmermann.com/media/wysiwyg/ZIM_F24_CAMPAIGN_1363DF242_HI-RES_1_6.jpg"
        width="100%"
        alt=""
        style={{
          height: "100%",
        }}
      />
      <Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="start"
          gap="10px"
          p="5px 50px 0px 50px"
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "800",
              letterSpacing: "1px",
              textDecoration: "underline",
            }}
          >
            <Link style={{ color: "black" }}> NEW ARRIVALS</Link>
          </Typography>
          <p>|</p>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "800",
              letterSpacing: "1px",
              textDecoration: "underline",
            }}
          >
            <Link style={{ color: "black" }}> EXPLORE THE COLLECTION</Link>
          </Typography>
        </Box>

        {/* Section des produits */}
        <Container
          sx={{
            padding: "100px 0px 125px 0px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "30px", // Ajoute un espace entre les éléments
              paddingBottom: "40px",
            }}
          >
            {[
              {
                imgSrc:
                  "https://www.zimmermann.com/media/catalog/product/1/_/1.1363df242.mit.mint_1_1.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=755&width=581&canvas=581:755",
                title: "Eden Sequin Mini Dress",
              },
              {
                imgSrc:
                  "https://www.zimmermann.com/media/catalog/product/1/_/1.0746xf24.peh.peach.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=755&width=581&canvas=581:755",
                title: "Zimmermann Jay Oversize",
              },
              {
                imgSrc:
                  "https://www.zimmermann.com/media/catalog/product/1/_/1.1143xf24.mit.mint_1.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=755&width=581&canvas=581:755",
                title: "Sequin Embroidered Pouch",
              },
              {
                imgSrc:
                  "https://www.zimmermann.com/media/catalog/product/1/_/1.1490df242.madjad.madame-jade.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=755&width=581&canvas=581:755",
                title: "Eden Billow Mini Dress",
              },
            ].map((product, index) => (
              <Box
                key={index}
                sx={{
                  width: {
                    xs: "100%", // Pour les petits écrans (mobile)
                    sm: "48%", // Pour les tablettes
                    md: "23%", // Pour les écrans de taille moyenne et plus
                  },
                  textAlign: "center",
                }}
              >
                <img
                  src={product.imgSrc}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px", // Ajoute un léger arrondi
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: "10px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {product.title}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "800",
              letterSpacing: "1px",
              textDecoration: "none",
            }}
          >
            <Link
              style={{
                color: "black",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              EXPLORE THE COLLECTION
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
