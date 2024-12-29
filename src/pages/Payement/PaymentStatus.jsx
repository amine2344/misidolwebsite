import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../utils/apiConfig";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import errorIcon from "../../assets/icons8-error-symbol.svg";
import successIcon from "../../assets/icons8-success.svg";
import loadingIcon from "../../assets/icons8-loading.gif";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

function PaymentStatus() {
  const location = useLocation();
  const [card, setCard] = useState([]);
  const [idOrder, setIdOrder] = useState(null);
  const [email, setEmail] = useState(null);
  const [produitsCommande, setProduitsCommande] = useState([]);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [associationSuccess, setAssociationSuccess] = useState(false);
  const [totalAmountHt, setTotalAmountHt] = useState(0);
  const [tvaRate, setTvaRate] = useState(0);
  const [totalAmountTtc, setTotalAmountTtc] = useState(0);
  const [currency, setCurrency] = useState("");
  const fetchCard = () => {
    const card = localStorage.getItem("cart");
    const parsedCard = JSON.parse(card);
    setCard(parsedCard);

    if (parsedCard) {
      const produits = parsedCard.map((item) => ({
        produitId: item.selectedSize.id,
        quantite: item.quantity,
      }));
      setProduitsCommande(produits);
    }
  };

  const sendEmail = async () => {
    try {
      await api.post("/client/send-email", {
        email: email,
        idOrder: idOrder,
      });
      console.log("E-mail de confirmation envoyé");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
    }
  };

  const createPayment = async () => {
    try {
      const response = await api.post("/create-payment-intent", {
        currency: localStorage.getItem("currency"),
        idOrder: idOrder,
      });

      if (response.data.payment._links.checkout) {
        setPaymentUrl(response.data.payment._links.checkout.href);
        setIsButtonDisabled(false);
      }

      // Mettre à jour les montants et TVA
      setTotalAmountHt(response.data.amountHt);
      setTvaRate(response.data.tvaRate);
      setTotalAmountTtc(response.data.totalAmountTtc);
      setCurrency(response.data.currency);
      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error);
    }
  };

  const associerProduitsCommande = async () => {
    if (idOrder && produitsCommande.length > 0) {
      setIsLoading(true);
      try {
        await api.post("/client/order", {
          commandeId: idOrder,
          produits: produitsCommande,
        });

        localStorage.setItem("cart", JSON.stringify([]));
        setAssociationSuccess(true);
        sendEmail();
        createPayment(); // Créer le paiement après l'association des produits
      } catch (error) {
        console.error("Erreur lors de l'association des produits:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCard();
    if (location.state && location.state.idOrder) {
      setIdOrder(location.state.idOrder);
    }
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  useEffect(() => {
    associerProduitsCommande();
  }, [idOrder, produitsCommande]);

  const handlePaymentClick = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        width: "90%",
        margin: "50px auto",
        padding: "25px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        mb={3}
        textTransform="uppercase"
        fontWeight="bold"
        color="primary"
      >
        Statut de la commande
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={60} />
        </Box>
      ) : associationSuccess ? (
        <Box display="flex" flexDirection="column" sx={{ gap: 2 }}>
          <img
            src={successIcon}
            alt="success"
            width="100px"
            style={{ margin: "0px auto" }}
          />
          <Typography variant="h6" color="success.main">
            Commande ID: {idOrder}
          </Typography>
          <Typography variant="h6" color="success.main">
            Votre commande est prête à être payer
          </Typography>
          <Box display="flex" flexDirection="column" gap="5px">
            <Typography
              variant="h5"
              textAlign="left"
              p="5px 10px"
              sx={{ background: "#f4f4f4" }}
            >
              Montant total (HT) : {totalAmountHt} {currency}
            </Typography>
            <Typography
              variant="h5"
              textAlign="left"
              p="5px 10px"
              sx={{ background: "#f4f4f4" }}
            >
              TVA : {tvaRate} %
            </Typography>
            <Typography
              variant="h5"
              textAlign="left"
              p="5px 10px"
              sx={{ background: "#f4f4f4" }}
            >
              Montant total (TTC) : {totalAmountTtc} {currency}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          sx={{ mt: 10, mb: 10 }}
        >
          <img src={errorIcon} alt="error" width="100px" />
          <Typography color="error" fontWeight="bold">
            Échec de la création de la commande. Veuillez réessayer.
          </Typography>
        </Box>
      )}

      <Button
        onClick={handlePaymentClick}
        disabled={isButtonDisabled}
        variant="contained"
        color="primary"
        sx={{
          mt: 4,
          width: "100%",
          padding: "12px",
          fontSize: "1rem",
          fontWeight: "600",
          letterSpacing: "0.5px",
          textTransform: "none",
          "&:disabled": {
            backgroundColor: "gray",
            cursor: "not-allowed",
          },
        }}
      >
        Procéder au paiement
      </Button>
    </Box>
  );
}

export default PaymentStatus;
