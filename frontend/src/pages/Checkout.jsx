import React from "react";
import CheckoutForm from "../components/CheckoutForm";
import "../index.css";
import { Helmet } from "react-helmet-async";
import { Contact } from "lucide-react";
import ContactSection from "../components/ContactSection";
import TrustSection from "../components/TrustSection";

const Checkout = ({ cartItems }) => {
  return (
  <>
    <Helmet>
      <title>Pokladna | Veronica Abstracts</title>
      <meta name="description" content="Dokončete svůj nákup abstraktního umění Veroniky." />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href="https://veronicaabstracts.com/checkout" />

      <meta property="og:title" content="Pokladna | Veronica Abstracts" />
      <meta property="og:description" content="Zadejte své údaje a dokončete objednávku." />
      <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
      <meta property="og:url" content="https://veronicaabstracts.com/checkout" />
      <meta property="og:type" content="website" />

      <meta name="twitter:title" content="Pokladna | Veronica Abstracts" />
      <meta name="twitter:description" content="Zadejte údaje a odešlete objednávku." />
      <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
    <CheckoutForm cartItems={cartItems} />

    <ContactSection />
    <TrustSection />
  </>
  );
};

export default Checkout;