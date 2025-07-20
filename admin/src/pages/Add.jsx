import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backendUrl = "https://orient-backend.vercel.app";

const CATEGORY_OPTIONS = [
  { value: 'Men', label: 'Men', subcategories: ['Kurta', 'Dhotis'] },
  { value: 'Women', label: 'Women', subcategories: ['Saree', 'Blouse'] },
  { value: 'Jewellery', label: 'Jewellery', subcategories: ['Necklace', 'Earrings', 'Bangles'] },
];

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];

const COLOUR_OPTIONS = [
  'purple',
  'black',
  'blue',
  'white',
  'purple + white',
  'white + black',
  'purple + green + white',
];

const Add = ({ token, setToken }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    image: [],
    category: '',
    subCategory: '',
    sizes: [],
    colours: [],
    bestseller: false,
    date: Date.now(),
    code: ''
  });

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'bestseller') {
      setProductDetails({ ...productDetails, bestseller: checked });
    } else if (name === 'sizes') {
      let newSizes = [...productDetails.sizes];
      if (checked) {
        newSizes.push(value);
      } else {
        newSizes = newSizes.filter(s => s !== value);
      }
      setProductDetails({ ...productDetails, sizes: newSizes });
    } else if (name === 'colours') {
      let newColours = [...productDetails.colours];
      if (checked) {
        newColours.push(value);
      } else {
        newColours = newColours.filter(c => c !== value);
      }
      setProductDetails({ ...productDetails, colours: newColours });
    } else {
      setProductDetails({ ...productDetails, [name]: value });
      if (name === 'category') {
        setProductDetails((prev) => ({ ...prev, subCategory: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productDetails.name);
    formData.append('description', productDetails.description);
    formData.append('price', productDetails.price);
    formData.append('category', productDetails.category);
    formData.append('subCategory', productDetails.subCategory);
    formData.append('bestseller', productDetails.bestseller ? "true" : "false"); // send as string
    formData.append('date', Date.now());
    formData.append('code', productDetails.code);
    formData.append('sizes', JSON.stringify(productDetails.sizes));
    formData.append('colours', JSON.stringify(productDetails.colours));
    images.forEach((img, idx) => {
      if (img) {
        formData.append(`image${idx + 1}`, img);
      }
    });

    try {
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token, // or Authorization: `Bearer ${token}` if your backend expects it
          },
        }
      );
      console.log(response.data); // See backend response
      // Success handling: reset form and images
      setImages([null, null, null, null]);
      setProductDetails({
        name: '',
        description: '',
        price: '',
        image: [],
        category: '',
        subCategory: '',
        sizes: [],
        colours: [],
        bestseller: false,
        date: Date.now(),
        code: ''
      });
      toast.success("Product added successfully!");
    } catch (error) {
      if (error.response) {
        console.log(error.response.data); // See backend error
        toast.error(error.response.data.message || "Failed to add product");
      } else {
        console.log(error.message);
        toast.error("Failed to add product");
      }
    }
  };

  const subcategoryOptions =
    CATEGORY_OPTIONS.find(opt => opt.value === productDetails.category)?.subcategories || [];

  return (
    <>
      <form className="flex flex-col w-full items-start gap-3" onSubmit={handleSubmit}>
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <label key={i} htmlFor={`image${i}`}>
                <img
                  className="w-20"
                  src={images[i] ? URL.createObjectURL(images[i]) : assets.upload_area}
                  alt=""
                />
                <input
                  type="file"
                  id={`image${i}`}
                  hidden
                  onChange={e => handleImageChange(i, e.target.files[0])}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-4 w-full max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
            <input
              onChange={changeHandler}
              value={productDetails.name}
              type="text"
              name="name"
              placeholder="Type here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              onChange={changeHandler}
              value={productDetails.description}
              name="description"
              placeholder="Type here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              onChange={changeHandler}
              value={productDetails.price}
              type="number"
              name="price"
              placeholder="Type here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              onChange={changeHandler}
              value={productDetails.category}
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
            <select
              onChange={changeHandler}
              value={productDetails.subCategory}
              name="subCategory"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!!productDetails.category}
              disabled={!productDetails.category}
            >
              <option value="">{productDetails.category ? 'Select Subcategory' : 'Select Category First'}</option>
              {subcategoryOptions.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (optional)</label>
            <div className="flex gap-4 flex-wrap">
              {SIZE_OPTIONS.map(size => (
                <label key={size} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    checked={productDetails.sizes.includes(size)}
                    onChange={changeHandler}
                    className="h-6 w-6 text-blue-600 border-gray-300 rounded"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colours (optional)</label>
            <div className="flex gap-4 flex-wrap">
              {COLOUR_OPTIONS.map(colour => (
                <label key={colour} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="colours"
                    value={colour}
                    checked={productDetails.colours.includes(colour)}
                    onChange={changeHandler}
                    className="h-6 w-6 text-blue-600 border-gray-300 rounded"
                  />
                  <span>{colour}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestseller"
              checked={productDetails.bestseller}
              onChange={changeHandler}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="block text-sm font-medium text-gray-700">Bestseller</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Code</label>
            <input
              onChange={changeHandler}
              value={productDetails.code}
              type="text"
              name="code"
              placeholder="Type here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="mt-6 w-full max-w-xl">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            ADD PRODUCT
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default Add;