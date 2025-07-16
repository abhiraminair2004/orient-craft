// Place order (default method)
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;
        // Default to COD if paymentMethod is not provided
        const method = paymentMethod || "COD";
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: method,
            payment: method === "COD" ? false : true, // For COD, payment is false; for prepaid, set to true (can adjust as needed)
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: `Order Placed with ${method}` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const delivery_fee = 50; // You can adjust or get from req.body if needed
    const currency = 'aud'; // Use 'aud' for Australian dollars

    // 1. Create order in DB (payment: false until verified)
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now()
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // 2. Prepare Stripe line items
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

    // 3. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
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
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe }
