import { createTheme } from "@mui/material/styles";

// Fonction pour créer des tokens de couleur
const tokens = {
  primary: {
    main: "#A0522D", // Une teinte marron douce
  },
  secondary: {
    main: "#F0E68C", // Une couleur jaune pâle
  },
  background: {
    default: "#FFFFFF", // Fond blanc
  },
  text: {
    primary: "#333333", // Couleur du texte
    secondary: "#555555", // Texte secondaire plus clair
  },
};

// Paramètres du thème
const themeSettings = () => {
  return {
    palette: {
      primary: tokens.primary,
      secondary: tokens.secondary,
      background: {
        default: tokens.background.default,
        paper: "#F9F9F9", // Papier légèrement grisé
      },
      text: {
        primary: tokens.text.primary,
        secondary: tokens.text.secondary,
      },
    },
    typography: {
      fontFamily: ["proxima-nova", "Helvetica", "Arial", "sans-serif"].join(
        ","
      ), // Typographie élégante
      fontSize: 14,
      h1: {
        fontFamily: ["nova", "Georgia", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["nova", "Georgia", "sans-serif"].join(","),
        fontSize: 35,
      },
      h3: {
        fontFamily: ["nova", "Georgia", "sans-serif"].join(","),
        fontSize: 28,
      },

      h4: {
        fontFamily: ["nova", "Georgia", "sans-serif"].join(","),
        fontSize: 22,
      },

      h5: {
        fontFamily: ["nova", "Georgia", "sans-serif"].join(","),
        fontSize: 14,
      },
      h6: {
        fontFamily: ["proxima-nova", "Helvetica", "Arial", "sans-serif"].join(
          ","
        ),
        fontSize: 12,
      },
      // Ajoutez d'autres styles typographiques si nécessaire
    },
  };
};

// Créer le thème
const theme = createTheme(themeSettings());

export default theme;
