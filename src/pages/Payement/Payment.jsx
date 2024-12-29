import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../../utils/apiConfig";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "", // Nom de l'état enregistré ici
    postalCode: "",
    country: "", // ISO code du pays
    phone: "",
    phoneExtension: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const commandeData = {
      clientName: formData.fullName,
      clientEmail: formData.email,
      deliveryAddress: formData.address,
      country: formData.country, // ISO code du pays
      state: formData.state, // Nom de l'état
      city: formData.city,
      postalCode: formData.postalCode,
      phoneNumber: formData.phoneExtension + formData.phone,
      statut: "pending",
      clientInfo: JSON.stringify({
        city: formData.city,
        state: formData.state, // Nom de l'état
        postalCode: formData.postalCode,
        country: formData.country, // ISO code du pays
        phone: formData.phoneExtension + formData.phone,
      }),
    };
    try {
      const response = await api.post("/commande", commandeData);
      console.log(response.data.message);
      setFormData({
        fullName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        phoneExtension: "",
      });

      navigate("/checkout-status", {
        state: {
          idOrder: response.data.commande.id,
          email: commandeData.clientEmail,
          telephone: JSON.parse(commandeData.clientInfo).phone,
        },
      });
    } catch (error) {
      setError("Erreur lors de la création de la commande");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await api.get("/countries");
      const countriesList = response.data.map((country) => ({
        name: country.name,
        isoCode: country.isoCode,
        flag: country.flag,
        phoneCode: country.phonecode,
      }));
      setCountries(countriesList);
    } catch (error) {
      console.error("Erreur lors de la récupération des pays :", error);
    }
  };

  const fetchStates = async () => {
    if (formData.country) {
      try {
        const response = await api.get(`/stateByCountry`, {
          params: { isoCodeCountry: formData.country.toString() },
        });
        const statesList = response.data.map((state) => ({
          name: state.name,
          isoCode: state.isoCode,
        }));
        setStates(statesList);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des états/régions :",
          error
        );
      }
    }
  };

  const fetchCities = async () => {
    if (formData.country && formData.state) {
      try {
        const state = states.find((s) => s.name === formData.state);
        const response = await api.get(`/cityByState`, {
          params: {
            countryCode: formData.country.toString(),
            stateCode: state ? state.isoCode : "", // Utiliser l'ISO code de l'état pour la requête
          },
        });
        const citiesList = response.data.map((city) => ({
          name: city.name,
        }));
        setCities(citiesList);
      } catch (error) {
        console.error("Erreur lors de la récupération des villes :", error);
      }
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchStates();
  }, [formData.country]);

  useEffect(() => {
    fetchCities();
  }, [formData.country, formData.state]);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 4,
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
        mt: "50px",
        mb: "50px",
      }}
    >
      <Typography variant="h5" mb={2}>
        Payment Information
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "16.5px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  fontSize: "16px",
                }}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countries.map((country, index) => (
                  <option key={index} value={country.isoCode}>
                    {country.name} {country.flag}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "16.5px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  fontSize: "16px",
                }}
              >
                <option value="" disabled>
                  Select a state
                </option>
                {states.map((state, index) => (
                  <option key={index} value={state.name}>
                    {" "}
                    {/* Ici, nous utilisons le nom de l'état */}
                    {state.name}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "16.5px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  fontSize: "16px",
                }}
              >
                <option value="" disabled>
                  Select a city
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <FormControl fullWidth required>
                  <select
                    name="phoneExtension"
                    value={formData.phoneExtension}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "16.5px 14px",
                      borderRadius: "4px",
                      border: "1px solid rgba(0, 0, 0, 0.23)",
                      fontSize: "16px",
                    }}
                  >
                    <option value="" disabled>
                      Ext.
                    </option>
                    {countries.map((country, index) => (
                      <option key={index} value={country.phoneCode}>
                        {country.flag} ( {country.phoneCode} )
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? "Loading..." : "Submit Payment"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Payment;
