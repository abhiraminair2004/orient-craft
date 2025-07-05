import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const {products, search, showSearch}= useContext(ShopContext);
  const [showFilter,setShowFilter]=useState(false);
  const [filterProducts,setFilterProducts]=useState([]);
  const[category,setCategory]=useState([]);
  const[subcategory,setSubcategory]=useState([]);
  const[sortType,setSortType]=useState('relevant');

  const toggleCategory=(e)=>{
    if(category.includes(e.target.value)){
      setCategory(prev=>prev.filter(item =>item!==e.target.value))
      // Clear subcategories when main category is unchecked
      setSubcategory(prev=>prev.filter(item=>!getSubcategoriesForCategory(e.target.value).includes(item)))
    }
    else{
      setCategory(prev=> [...prev,e.target.value])
    }
  }

  const toggleSubcategory=(e)=>{
    if(subcategory.includes(e.target.value)){
      setSubcategory(prev=>prev.filter(item =>item!==e.target.value))
    }
    else{
      setSubcategory(prev=> [...prev,e.target.value])
    }
  }

  const getSubcategoriesForCategory = (category) => {
    switch(category) {
      case 'Men':
        return ['Kurta', 'Dhotis'];
      case 'Women':
        return ['Saree', 'Blouse'];
      case 'Jewellery':
        return ['Necklace', 'Earrings', 'Bangles'];
      default:
        return [];
    }
  }

  const applyFilter=()=>{
    let productCopy=products.slice();
    if (showSearch && search) {
      productCopy=productCopy.filter(item=> item.name.toLowerCase().includes(search.toLowerCase()))     
    }
    if(category.length>0){
      productCopy=productCopy.filter(item=>category.includes(item.category))
    }
    if(subcategory.length>0){
      productCopy=productCopy.filter(item=>subcategory.includes(item.subcategory))
    }
    setFilterProducts(productCopy)
  }

  const sortProduct=()=>{
    let fpCopy=filterProducts.slice();
    switch(sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price-b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)))
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(()=>{
    applyFilter();
  },[category, subcategory, search, showSearch])
  useEffect(()=>{
    sortProduct();
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* filter options */}
      <div onClick={()=>setShowFilter(!showFilter)} className='min-w-60'>
        <p className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img  className={`h-3 sm:hidden ${showFilter?'rotate-90':''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* category filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {/* Men Category */}
            <div>
              <p className='flex gap-2'>
                <input type="checkbox" className='w-3' value={'Men'} onChange={toggleCategory}/>Men
              </p>
              {category.includes('Men') && (
                <div className='ml-4 mt-2 flex flex-col gap-2'>
                  <p className='flex gap-2'>
                    <input type="checkbox" className='w-3' value={'Kurta'} onChange={toggleSubcategory}/>Kurta
                  </p>
                  <p className='flex gap-2'>
                    <input type="checkbox" className='w-3' value={'Dhotis'} onChange={toggleSubcategory}/>Dhotis
                  </p>
                </div>
              )}
            </div>
            {/* Women Category */}
            <div>
              <p className='flex gap-2'>
                <input type="checkbox" className='w-3' value={'Women'} onChange={toggleCategory}/>Women
              </p>
              {category.includes('Women') && (
                <div className='ml-4 mt-2 flex flex-col gap-2'>
                  <p className='flex gap-2'>
                    <input type="checkbox" className='w-3' value={'Saree'} onChange={toggleSubcategory}/>Saree
                  </p>
                  <p className='flex gap-2'>
                    <input type="checkbox" className='w-3' value={'Blouse'} onChange={toggleSubcategory}/>Blouse
                  </p>
                </div>
              )}
            </div>
            {/* Jewellery Category */}
            <div>
              <p className='flex gap-2'>
                <input type="checkbox" className='w-3' value={'Jewellery'} onChange={toggleCategory}/>Jewellery
              </p>
              {category.includes('Jewellery') && (
                <div className='ml-4 mt-2 flex flex-col gap-2'>
                  <p className='flex gap-2'>
                    <input type="checkbox" className='w-3' value={'Necklace'} onChange={toggleSubcategory}/>Necklace
                  </p>
                  <p className='flex gap-2'>
                    <input type="checkbox" className='w-3' value={'Earrings'} onChange={toggleSubcategory}/>Earrings
                  </p>
                  <p className='flex gap-2'>
                    <input type="checkbox" className='w-3' value={'Bangles'} onChange={toggleSubcategory}/>Bangles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>        
      </div>
      {/* right side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'}/>
          {/* product sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2 bg-[#FEFDED]'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* map products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item,index)=>(
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Collection