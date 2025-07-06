import productModel from '../models/productModel.js'
import {v2 as cloudinary} from "cloudinary"
// function for adding product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller, code } = req.body;

    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({ success: false, message: "Missing required parameter - file" });
    }

    const image1 = req.files.image1 ? req.files.image1[0] : null;
    const image2 = req.files.image2 ? req.files.image2[0] : null;
    const image3 = req.files.image3 ? req.files.image3[0] : null;
    const image4 = req.files.image4 ? req.files.image4[0] : null;

    const images = [image1, image2, image3, image4].filter((item) => item !== null);
    
    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );
    
    const productData = {
      name, 
      description,
      price: Number(price),
      image: imageUrl,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
      code
    }
    
    console.log(productData)
    const product = new productModel(productData);
    await product.save()
    
    res.json({ success: true, message: "Product added successfully", imageUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products })   
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
export{listProducts,addProduct,removeProduct,singleProduct}
