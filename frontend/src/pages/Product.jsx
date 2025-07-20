import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const {productId}=useParams();
  const {products, currency, addToCart}=useContext(ShopContext);
  const[productData,setProductData]=useState(false);
  const [image, setImage]= useState('')
  const [size,setSize]=useState('')
  const [colour,setColour]=useState('')

  const fetchProductData =async ()=>{
    products.map((item)=>{
      if (item._id===productId) {
        setProductData(item)
        setImage(item.image[0])
        console.log(item);
        return null;
      }
    })
  }
  useEffect(()=>{
    fetchProductData();
  },[productId,products])
  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* product images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item,index)=>(
              <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* product info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <ProductCode products={products} productData={productData} />
          <div className='flex flex-col gap-4 my-8'>
            <div className='flex gap-2'>
              {productData.sizes.map((item,index)=>(
                <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item===size ? 'border-orange-500' :''}`} key={index}>{item}</button>
              ))}
            </div>
            {/* Show warning if size is required but not selected */}
            {productData.sizes.length > 0 && !size && (
              <p className='text-red-500 text-sm'>Please select a size</p>
            )}
            {/* Colour selection */}
            {productData.colours && productData.colours.length > 0 && (
              <div className='flex gap-2 mt-2'>
                {productData.colours.map((c, idx) => (
                  <button onClick={()=>setColour(c)} className={`border py-2 px-4 bg-gray-100 ${c===colour ? 'border-purple-500' :''}`} key={idx}>{c}</button>
                ))}
              </div>
            )}
            {/* Show warning if colour is required but not selected */}
            {productData.colours && productData.colours.length > 0 && !colour && (
              <p className='text-red-500 text-sm'>Please select a colour</p>
            )}
          </div>
          <button 
            onClick={()=>{
              if ((productData.sizes.length > 0 && !size) || (productData.colours && productData.colours.length > 0 && !colour)) return;
              addToCart(productData._id, size, colour);
            }} 
            className={`px-8 py-3 text-sm ${(productData.sizes.length > 0 && !size) || (productData.colours && productData.colours.length > 0 && !colour) ? 'bg-gray-400 cursor-not-allowed' :'bg-black text-white active:bg-gray-700'}`}
            disabled={(productData.sizes.length > 0 && !size) || (productData.colours && productData.colours.length > 0 && !colour)}
          >
            ADD TO CART
          </button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Easy return and exchange within 14 days</p>
            <p>Authentic and traditional</p>
          </div>
        </div>
      </div>
      {/* description and review section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews(122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gry-500'>
          <p>Discover the elegance of tradition with our custom ethnic wear and handcrafted jewelry. Each piece is thoughtfully designed and meticulously made, celebrating timeless craftsmanship and cultural heritage.</p>
          <p>Perfect for every occasion, our bespoke creations blend authenticity with modern grace to make you stand out effortlessly.</p>
        </div>
      </div>
      {/* display related products */}
      <RelatedProducts subCategory={productData.subCategory}/>
    </div>
  ) : <div className='opacity-0'></div>
}

// Helper component for product code
function ProductCode({ products, productData }) {
  // Determine prefix
  let prefix = '';
  if (productData.category === 'Women' && productData.subCategory === 'Saree') prefix = 'SH';
  else if (productData.category === 'Women' && productData.subCategory === 'Blouse') prefix = 'BL';
  else if (productData.category === 'Men' && productData.subCategory === 'Kurta') prefix = 'MK';
  else if (productData.category === 'Men' && productData.subCategory === 'Dhotis') prefix = 'MD';
  else if (productData.category === 'Jewellery' && productData.subCategory === 'Necklace') prefix = 'JN';
  else if (productData.category === 'Jewellery' && productData.subCategory === 'Earrings') prefix = 'JE';
  else if (productData.category === 'Jewellery' && productData.subCategory === 'Bangles') prefix = 'JB';

  // Find all products in the same subCategory
  const subcatProducts = products.filter(
    p => p.category === productData.category && p.subCategory === productData.subCategory
  );
  // Find the index of the current product in that subcategory
  const index = subcatProducts.findIndex(p => p._id === productData._id);
  // Code is prefix + 3-digit number (starting from 1)
  const code = prefix ? `${prefix}${String(index + 1).padStart(3, '0')}` : '';

  if (!code) return null;
  return (
    <div className="mt-2 text-sm text-gray-700 font-semibold">
      Code: {code}
    </div>
  );
}

export default Product