import React, { useState, useEffect } from 'react'

const Orders = () => {
  const [orderData, setOrderData] = useState([])

  const fetchOrders = async () => {
    await fetch('http://localhost:4000/api/orders')
      .then((res) => res.json())
      .then((data) => { setOrderData(data) })
      .catch((error) => {
        console.log("Error fetching orders:", error)
        // Mock data for demonstration
        setOrderData([
          {
            id: 1,
            customerName: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            address: "123 Main St, City, State 12345",
            items: [
              { name: "Product 1", quantity: 2, price: 29.99 },
              { name: "Product 2", quantity: 1, price: 49.99 }
            ],
            total: 109.97,
            status: "pending",
            date: "2024-01-15"
          },
          {
            id: 2,
            customerName: "Jane Smith",
            email: "jane@example.com",
            phone: "+1987654321",
            address: "456 Oak Ave, Town, State 54321",
            items: [
              { name: "Product 3", quantity: 1, price: 79.99 }
            ],
            total: 79.99,
            status: "shipped",
            date: "2024-01-14"
          }
        ])
      })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      fetchOrders()
    } catch (error) {
      console.log("Error updating order:", error)
    }
  }

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
          {orderData.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                {/* Order Header */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">{order.address}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="font-bold text-xl text-blue-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500">
                    <p>Order Date: {order.date}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Update Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
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