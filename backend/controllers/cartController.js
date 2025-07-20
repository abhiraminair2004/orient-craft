import userModel from '../models/userModel.js';

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, colour } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        const key = (size || '') + '|' + (colour || '');
        if (cartData[itemId]) {
            if (cartData[itemId][key]) {
                cartData[itemId][key] += 1;
            } else {
                cartData[itemId][key] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][key] = 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, colour, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        const key = (size || '') + '|' + (colour || '');
        cartData[itemId][key] = quantity;
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart }
