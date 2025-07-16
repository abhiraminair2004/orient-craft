// Placing orders using Stripe Method
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const { origin } = req.headers;
    const delivery_fee = 50; // You can adjust or get from req.body if needed
    const currency = 'aud'; // Use 'aud' for Australian dollars

    // 1. Prepare Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    // Add delivery fee as a separate line item
    line_items.push({
      price_data: {
        currency,
        product_data: { name: 'Delivery Charges' },
        unit_amount: delivery_fee * 100,
      },
      quantity: 1,
    });

    // 2. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true` +
        `&address=${encodeURIComponent(JSON.stringify(address))}` +
        `&amount=${amount}` +
        `&items=${encodeURIComponent(JSON.stringify(items))}`,
      cancel_url: `${origin}/verify?success=false`,
      line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Verify Stripe
const verifyStripe = async (req, res) => {
  try {
    const { success, userId, address, amount, items } = req.body;
    if (success === "true") {
      // Create the order only after successful payment
      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: 'Stripe',
        payment: true,
        date: Date.now()
      };
      const newOrder = new orderModel(orderData);
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export { placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe }
