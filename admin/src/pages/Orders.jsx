import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Orders = () => {
  const [orderData, setOrderData] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrderData(response.data.orders)
      } else {
        setOrderData([])
      }
    } catch (error) {
      setOrderData([])
      if (error.response && error.response.status === 404) {
        console.error('Endpoint not found (404). Check your backend URL and route.');
      } else if (error.response && error.response.data) {
        console.error('Error fetching orders:', error.response.data);
      } else {
        console.error('Error fetching orders:', error.message);
      }
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Orders</h1>
        <div className="space-y-6">
          {orderData.map((order, orderIdx) => (
            <div key={order._id || orderIdx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                {/* Order Header */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order._id?.slice(-6) || orderIdx+1}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                      <p className="text-sm text-gray-600">User ID: {order.userId}</p>
                      <p className="text-sm text-gray-600">Name: {order.address?.firstName} {order.address?.lastName}</p>
                      <p className="text-sm text-gray-600">Phone: {order.address?.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.address && typeof order.address === 'object'
                          ? [order.address.street, order.address.city, order.address.state, order.address.zipcode, order.address.country].filter(Boolean).join(', ')
                          : order.address}
                      </p>
                    </div>
                  </div>
                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm gap-4">
                          <div className="flex items-center gap-3">
                            {item.image && item.image[0] && (
                              <img src={item.image[0]} alt={item.name} className="w-14 h-14 object-cover rounded border" />
                            )}
                            <span>{item.name} x {item.quantity} {item.size && <span className="text-xs text-gray-400 ml-2">[{item.size}]</span>}</span>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Order Total */}
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="font-bold text-xl text-blue-600">${order.amount?.toFixed(2)}</span>
                  </div>
                </div>
                {/* Order Actions */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="text-sm text-gray-500">
                    <p>Order Date: {order.date ? new Date(order.date).toLocaleString() : ''}</p>
                    <p>Payment Method: {order.paymentMethod}</p>
                    <p>Payment: {order.payment ? 'Paid' : 'Pending'}</p>
                  </div>
                  {/* Status update dropdown */}
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-medium text-gray-700">Update Status:</label>
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await axios.post(
                            backendUrl + '/api/order/status',
                            { orderId: order._id, status: newStatus },
                            { headers: { token } }
                          );
                          setOrderData((prev) => prev.map((o) => o._id === order._id ? { ...o, status: newStatus } : o));
                        } catch (err) {
                          alert('Failed to update status');
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {orderData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No orders found</div>
            <div className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders