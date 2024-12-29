import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/apiConfig";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("EUR"); // Devise par défaut
  const [conversionRates, setConversionRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await api.get("/client/currency");
        setConversionRates(response.data.rates);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des taux de change :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversionRates();
  }, []); // Appel API une seule fois lors du premier montage

  const value = { currency, setCurrency, conversionRates, loading };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCurrency = () => {
  return useContext(CurrencyContext);
};
