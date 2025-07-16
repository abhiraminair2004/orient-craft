import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + '/api/order/verifyStripe',
        { orderId, success, userId: token ? JSON.parse(atob(token.split('.')[1])).id : undefined },
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems({});
        toast.success('Payment successful! Thank you for your purchase.');
        navigate('/orders');
      } else {
        toast.error('Payment failed or was cancelled.');
        navigate('/cart');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred during payment verification.');
    }
  };

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Payment {success === 'true' ? 'Successful' : 'Failed'}</h2>
      <p className="text-lg">{success === 'true' ? 'Thank you for your purchase!' : 'Your payment could not be processed.'}</p>
    </div>
  );
};

export default Verify;
