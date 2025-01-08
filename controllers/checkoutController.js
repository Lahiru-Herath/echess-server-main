import Stripe from "stripe";
import Player from "../models/Player.js";

const stripe = new Stripe(
    "sk_test_51QeFTYJXGNMeaANxrrMxSRe8TtY9TUvWnly4iXpvI2IIrWWusoPW8yAzgBNs0tpPK2kzz8Ht4spqCRvP0m3vAaJg00q0zbYtiE"
);

export const stripeWebhook = async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // console.log("Raw Body: ", req.body);
    // console.log("Signature: ", sig);

    let event;

    try {
        // Ensure the raw body is passed as a Buffer
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        // console.log("Event: ", event);
    } catch (err) {
        console.error("Webhook signature verification failed: ", err.message);
        return res.status(400).json({ message: `Webhook error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const { userId, tournamentId } = session.metadata;

        try {
            const player = await Player.findOne({ userId });
            if (!player) return res.status(404).json({ message: "Player not found" });

            const tournamentRegistration = player.tournamentRegistrations.find(
                (reg) => reg.tournamentId.toString() === tournamentId
            );

            if (!tournamentRegistration) return res.status(404).json({ message: "Tournament not found" });

            tournamentRegistration.paymentStatus = "COMPLETED";
            await player.save();

            console.log(`Payment status updated for user ${userId}`);
            return res.status(200).json({ message: "Payment status updated successfully" });
        } catch (error) {
            console.error("Error updating payment status: ", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        console.warn(`Unhandled event type: ${event.type}`);
        res.status(400).end();
    }
};

export const createCheckoutSession = async (req, res, next) => {
    const tournamentName = req.body.tournamentName;
    const registrationFee = req.body.registrationFee;
    const userId = req.body.userId;
    const tournamentId = req.body.tournamentId;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "lkr",
                        product_data: {
                            name: `Registration for ${tournamentName}`,
                        },
                        unit_amount: Math.round(registrationFee * 100),
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId,
                tournamentId,
            },
            success_url: `${process.env.CLIENT_ORIGIN}/payment-success`,
            cancel_url: `${process.env.CLIENT_ORIGIN}/payment-cancel`,
        });

        res.status(200).json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
        next(e);
    }
};
