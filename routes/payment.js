const express = require("express");
const formidableMiddleware = require("express-formidable");
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);
const app = express();
const router = express.Router();
app.use(formidableMiddleware());

/* Votre clé privée doit être indiquée ici */
const stripe = createStripe();

// on réceptionne le token
router.post("/payment", async (req, res) => {
  try {
    const stripeToken = req.fields.stripeToken;
    // on envoie le token a Stripe avec le montant
    const response = await stripe.charges.create({
      amount: req.fields.amount * 100,
      currency: "eur",
      description: `Paiement vinted pour : ${req.fields.title}`,
      source: stripeToken,
    });
    // Le paiement a fonctionné
    // On peut mettre à jour la base de données
    // On renvoie une réponse au client pour afficher un message de statut
    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
