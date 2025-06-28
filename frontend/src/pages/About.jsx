import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>Orient Fashion is a celebration of India's timeless cultural heritage, rooted in the rich traditions of handloom weaving, temple-inspired motifs, and age-old craftsmanship. From the intricate zari work of Kanchipuram to the graceful drapes of Madurai cotton, our collections pay homage to the artistry and elegance that define the region's textile legacy. Every piece reflects the soulful connection between tradition and identity, honoring the skills passed down through generations of weavers and artisans.</p>
                    <p>At Orient Fashion, we strive to preserve and elevate these traditions by blending classical South Indian aesthetics with contemporary design sensibilities. Our garments are not just made — they are crafted with reverence, meant to be worn with pride and passed on with purpose. Through each creation, we invite you to experience the richness of our roots, where culture is not just remembered, but lived every day in fabric, form, and feeling.</p>
                </div>
            </div>
            {/* Why Choose Us Section */}
            <div className='text-xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>
            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance:</b>
                    <p>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Convenience:</b>
                    <p>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Exceptional Support:</b>
                    <p>Our dedicated support team is always here to assist you, ensuring a smooth and satisfying experience.</p>
                </div>
            </div>
        </div>
    )
}

export default About