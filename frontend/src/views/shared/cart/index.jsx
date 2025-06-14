import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb"; // Import Rupiah icon
import AOS from 'aos';
import { Link } from "react-router-dom";
import 'aos/dist/aos.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, baseURL } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [stockError, setStockError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState({
    method: 'regular',
    cost: 10000 // Default shipping cost
  });
  const [deleteError, setDeleteError] = useState(null);

  const shippingOptions = [
    { id: 'regular', name: 'Regular Delivery', cost: 10000 },
    { id: 'express', name: 'Express Delivery', cost: 20000 },
    { id: 'same_day', name: 'Same Day Delivery', cost: 35000 }
  ];

  // Minimum order amount constant
  const MIN_ORDER_AMOUNT = 500000;

  // Calculate selected items total
  const selectedItemsTotal = cartItems
    .filter(item => selectedItems.includes(item.cart_id))
    .reduce((sum, item) => sum + item.sub_total, 0);

  // Check if below minimum order
  const isBelowMinimumOrder = selectedItemsTotal < MIN_ORDER_AMOUNT;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await baseURL.get('/api/cart');
        if (response.data.status === 'success') {
          const formattedCartItems = response.data.data.map(item => ({
            cart_id: item.cart_id,
            product_id: item.product_id,
            product_name: item.product_name || 'Product Name',
            img_url: item.img_url || '/default-product.png',
            variant_name: item.variant_name || null,
            sku_name: item.sku_name || null,
            quantity: item.quantity,
            stock: item.product_stock,
            price: parseFloat(item.price),
            sub_total: parseFloat(item.sub_total),
            status: item.status
          }));

          setCartItems(formattedCartItems);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user, baseURL]);

  // Utility Functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
      .replace(/IDR/g, 'Rp')
      .replace(/\s+/g, '')  // Remove all spaces for consistency
      .trim();
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.sub_total, 0);
  };

  const calculateCartSummary = () => {
    return {
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cartItems.reduce((sum, item) => sum + item.sub_total, 0),
      shipping: 0, // Free shipping
      total: cartItems.reduce((sum, item) => sum + item.sub_total, 0)
    };
  };

  // Cart Update Handlers
  const updateQuantity = async (cartId, change) => {
    try {
      const item = cartItems.find(item => item.cart_id === cartId);
      if (!item) return;

      const newQuantity = item.quantity + change;

      // Validate stock
      if (newQuantity > item.stock) {
        setStockError(`Only ${item.stock} units available`);
        return;
      }

      if (newQuantity < 1) return;

      setStockError(null); // Clear error when valid

      const response = await baseURL.patch(`/api/cart/${cartId}`, {
        quantity: newQuantity
      });

      if (response.data.status === 'success') {
        setCartItems(cartItems.map(item =>
          item.cart_id === cartId
            ? { ...item, quantity: newQuantity, sub_total: newQuantity * item.price }
            : item
        ));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setStockError('Failed to update quantity');
    }
  };

  // Delete Handlers
  const handleDelete = (cartId) => {
    setItemToDelete(cartId);
    setIsDeleting(true);
    setDeleteError(null); // Reset error when opening modal
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteError(null);
      // Visual feedback that deletion is in progress
      const cartItemElement = document.getElementById(`cart-item-${itemToDelete}`);
      if (cartItemElement) {
        cartItemElement.classList.add('opacity-50');
      }

      console.log(`Attempting to delete cart item ID: ${itemToDelete}`);

      // Get the authentication token from localStorage if available
      const token = localStorage.getItem('token') || '';

      // Try multiple approaches to delete the item
      let isDeleted = false;
      let errorDetails = '';

      // Approach 1: Standard DELETE request
      try {
        const response = await fetch(`/api/cart/${itemToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();
        console.log("Approach 1 response:", data);

        if (response.ok && (data.status === 'success' || data.status === 200)) {
          isDeleted = true;
        } else {
          errorDetails += "Method 1 failed. ";
        }
      } catch (err) {
        console.error("Approach 1 error:", err);
        errorDetails += "Method 1 error. ";
      }

      // If first approach failed, try Approach 2: Using axios directly
      if (!isDeleted) {
        try {
          const response = await baseURL.delete(`/api/cart/${itemToDelete}`);
          console.log("Approach 2 response:", response.data);

          if (response.status === 200 || response.data.status === 'success') {
            isDeleted = true;
          } else {
            errorDetails += "Method 2 failed. ";
          }
        } catch (err) {
          console.error("Approach 2 error:", err);
          errorDetails += "Method 2 error. ";
        }
      }

      // If both approaches failed, try Approach 3: Using POST method with delete parameter
      if (!isDeleted) {
        try {
          const response = await baseURL.post('/api/cart/remove', {
            cart_id: itemToDelete
          });
          console.log("Approach 3 response:", response.data);

          if (response.status === 200 || response.data.status === 'success') {
            isDeleted = true;
          } else {
            errorDetails += "Method 3 failed. ";
          }
        } catch (err) {
          console.error("Approach 3 error:", err);
          errorDetails += "Method 3 error. ";
        }
      }

      // If deletion was successful through any method
      if (isDeleted) {
        // Update the UI
        setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
        setCartItems(prev => prev.filter(item => item.cart_id !== itemToDelete));
        console.log('Item successfully removed from cart');
        setIsDeleting(false);
        setItemToDelete(null);
      } else {
        // All attempts failed
        setDeleteError(`Failed to remove item. ${errorDetails} Please try again or refresh the page.`);

        // Restore visual state
        if (cartItemElement) {
          cartItemElement.classList.remove('opacity-50');
        }

        // Provide force remove option
        if (window.confirm("Server responded with errors. Would you like to force remove this item from your view? (Note: This will only remove it from your current view, not from the database)")) {
          setCartItems(prev => prev.filter(item => item.cart_id !== itemToDelete));
          setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
          setIsDeleting(false);
          setItemToDelete(null);
        }
      }
    } catch (error) {
      console.error('Unhandled error during delete operation:', error);
      setDeleteError(`An unexpected error occurred: ${error.message}`);

      // Force remove option for user convenience
      if (window.confirm("An error occurred. Would you like to remove this item from your view anyway?")) {
        setCartItems(prev => prev.filter(item => item.cart_id !== itemToDelete));
        setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
        setIsDeleting(false);
        setItemToDelete(null);
      }
    }
  };

  // Checkout Handler
  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(item =>
      selectedItems.includes(item.cart_id)
    );

    const checkoutData = {
      items: selectedCartItems,
      summary: {
        subtotal: selectedCartItems.reduce((sum, item) => sum + item.sub_total, 0),
        shipping: selectedShipping.cost,
        total: selectedCartItems.reduce((sum, item) => sum + item.sub_total, 0) +
          selectedShipping.cost
      },
      shipping: selectedShipping
    };

    // Navigate with state
    navigate(`/${user?.role}/checkout-page`, {
      state: { checkoutData }
    });
  };


  // Toggle Selection Handler
  const toggleSelection = (cartId) => {
    setSelectedItems(prev =>
      prev.includes(cartId)
        ? prev.filter(id => id !== cartId)
        : [...prev, cartId]
    );
  };

  // Add new toggle function at component level
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.cart_id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-navy-800 rounded-2xl p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-navy-700 rounded-xl" />
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-navy-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-navy-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6" data-aos="fade-up">
          <FiShoppingCart className="w-20 h-20 mx-auto text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet.
            Browse our products and find something you like.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-brand-500 text-white 
                     rounded-xl hover:bg-brand-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50/95 via-white/98 to-gray-50/95 
                  dark:from-navy-900 dark:via-navy-800 dark:to-navy-900">
      {/* Fixed Header with larger size */}
      <div className="sticky top-0 mb-7 z-40">
        <div className="relative bg-white/95 dark:bg-navy-800/95 backdrop-blur-xl 
                      shadow-lg border-b-2 border-brand-500/20 dark:border-brand-400/20">
          {/* Top Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-brand-500 dark:bg-brand-400" />

          <div className="max-w-7xl mx-auto">
            <div className="py-7 px-6">
              <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center space-x-6">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
                                dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Shopping Cart
                  </h1>
                  <button
                    onClick={toggleSelectAll}
                    className="px-4 py-1.5 bg-brand-50 dark:bg-brand-500/10 
                              rounded-full flex items-center gap-2 group
                              hover:bg-brand-100 dark:hover:bg-brand-500/20 
                              transition-colors duration-200"
                  >
                    <div className={`w-2 h-2 rounded-full transition-colors duration-200
                                  ${selectedItems.length === cartItems.length
                        ? 'bg-brand-500'
                        : 'bg-gray-400 dark:bg-gray-600'}`}
                    />
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                      {selectedItems.length === cartItems.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </span>
                  </button>
                  <div className="px-4 py-1.5 bg-brand-50 dark:bg-brand-500/10 
                                rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                      {selectedItems.length} of {cartItems.length} Selected
                    </span>
                  </div>
                </div>

                {/* Right Side Stats */}
                <div className="flex items-center divide-x divide-gray-200 dark:divide-navy-700">
                  <div className="px-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full
                                bg-brand-50 dark:bg-brand-500/10">
                      <FiShoppingCart className="h-4 w-4 text-brand-500" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {cartItems.length}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full
                                bg-brand-50 dark:bg-brand-500/10">
                      <TbCurrencyRupee className="h-4 w-4 text-brand-500" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Selected Total</p>
                      <p className="text-sm font-semibold text-brand-500">
                        {formatPrice(
                          cartItems
                            .filter(item => selectedItems.includes(item.cart_id))
                            .reduce((sum, item) => sum + item.sub_total, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order Summary Card */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="lg:sticky lg:top-24 mb-6 lg:mb-0">
              <div className="bg-white/95 dark:bg-navy-800/95 rounded-2xl overflow-hidden 
                            shadow-sm hover:shadow-lg border border-gray-200/50 dark:border-navy-700/50
                            transition-all duration-300"
                data-aos="fade-left">
                {/* Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-500/50 dark:bg-brand-400/60" />

                {/* Header */}
                <div className="p-6 border-b border-gray-200/50 dark:border-navy-700/50
                              bg-gray-50/50 dark:bg-navy-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Order Summary
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedItems.length} items selected
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-brand-50 dark:bg-brand-500/10 
                                  rounded-full text-sm font-medium text-brand-600 
                                  dark:text-brand-400">
                      {formatPrice(
                        cartItems
                          .filter(item => selectedItems.includes(item.cart_id))
                          .reduce((sum, item) => sum + item.sub_total, 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* Selected Items List with Enhanced Scrollbar */}
                <div className="px-6 py-4 max-h-[300px] overflow-y-auto 
                              scrollbar-thin scrollbar-track-transparent
                              hover:scrollbar-track-gray-100/50
                              dark:hover:scrollbar-track-navy-900/50
                              scrollbar-thumb-gray-200/80 
                              dark:scrollbar-thumb-navy-700/80
                              hover:scrollbar-thumb-gray-300/90
                              dark:hover:scrollbar-thumb-navy-600/90
                              scroll-smooth
                              [scrollbar-gutter:stable]
                              [&::-webkit-scrollbar]:w-1.5
                              [&::-webkit-scrollbar-thumb]:rounded-full
                              [&::-webkit-scrollbar-track]:rounded-full
                              transition-colors duration-200">
                  {cartItems
                    .filter(item => selectedItems.includes(item.cart_id))
                    .map(item => (
                      <div key={item.cart_id}
                        className="flex items-center gap-3 p-3 rounded-xl mb-2
                                    bg-gray-50/50 dark:bg-navy-900/50
                                    border border-gray-100 dark:border-navy-700/50
                                    hover:border-brand-500/20 dark:hover:border-brand-400/20
                                    transition-all duration-300">
                        {/* Item Thumbnail */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-navy-700">
                          <img src={item.img_url} alt={item.product_name} crossOrigin="anonymouse"
                            className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.product_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 text-xs rounded-full
                                         bg-brand-50 dark:bg-brand-500/10
                                         text-brand-600 dark:text-brand-400">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              × {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm font-medium text-brand-500 dark:text-brand-400 whitespace-nowrap">
                          {formatPrice(item.sub_total)}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Shipping Section */}
                <div className="p-6 space-y-4 bg-gray-50/80 dark:bg-navy-900/80 
                              border-t border-gray-200/50 dark:border-navy-700/50">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Shipping Method
                    </label>
                    <select
                      value={selectedShipping.method}
                      onChange={(e) => {
                        const option = shippingOptions.find(opt => opt.id === e.target.value);
                        setSelectedShipping(option);
                      }}
                      className="w-full p-3 text-sm bg-white dark:bg-navy-800 
                              border border-gray-200 dark:border-navy-600
                              rounded-xl focus:ring-2 focus:ring-brand-500/20
                              focus:border-brand-500 dark:focus:border-brand-400
                              transition-colors"
                    >
                      {shippingOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name} - {formatPrice(option.cost)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-200/50 dark:border-navy-700/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(
                          cartItems
                            .filter(item => selectedItems.includes(item.cart_id))
                            .reduce((sum, item) => sum + item.sub_total, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(selectedShipping.cost)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200/50 dark:border-navy-700/50">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          Total Amount
                        </span>
                        <span className="text-lg font-bold bg-gradient-to-r from-brand-500 
                                     to-brand-400 bg-clip-text text-transparent">
                          {formatPrice(
                            cartItems
                              .filter(item => selectedItems.includes(item.cart_id))
                              .reduce((sum, item) => sum + item.sub_total, 0) +
                            selectedShipping.cost
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="p-6 w-full relative dark:bg-navy-800">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0 || isBelowMinimumOrder}
                    className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 
                              disabled:bg-gray-300 dark:disabled:bg-navy-700
                              disabled:cursor-not-allowed text-white font-medium 
                              rounded-xl transform transition-all duration-300
                              shadow-sm hover:shadow-lg hover:-translate-y-0.5
                              active:translate-y-0 disabled:hover:transform-none"
                  >
                    {selectedItems.length === 0
                      ? "Select items to checkout"
                      : isBelowMinimumOrder
                        ? `Minimum order ${formatPrice(MIN_ORDER_AMOUNT)}`
                        : "Proceed to Checkout"
                    }
                  </button>
                  {isBelowMinimumOrder && selectedItems.length > 0 && (
                    <p className="mt-2 text-xs text-center text-red-500 dark:text-red-400">
                      Your order total must be at least {formatPrice(MIN_ORDER_AMOUNT)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="lg:col-span-8 lg:order-1 space-y-6">
            {cartItems.map((item) => (
              <div key={item.cart_id}
                id={`cart-item-${item.cart_id}`} // Add ID for targeting in delete function
                className="group relative bg-white dark:bg-navy-800 rounded-2xl overflow-hidden 
                           shadow-sm hover:shadow-xl transition-all duration-300"
                data-aos="fade-up">
                {/* Top Accent Color - Solid */}
                <div className="absolute top-0 inset-x-0 h-24 bg-brand-500/10 dark:bg-brand-400/15" />

                {/* Top Right Actions */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
                  {/* Detail Button */}
                  <button
                    onClick={() => navigate(`/auth/product-details/${item.product_id}`)}
                    className="p-2.5 bg-white/90 dark:bg-navy-700/90 rounded-xl
                              border border-gray-200/50 dark:border-navy-600/50
                              hover:bg-brand-50 dark:hover:bg-brand-500/10
                              hover:border-brand-500/50 dark:hover:border-brand-400/50
                              shadow-sm hover:shadow-md
                              transform hover:-translate-y-0.5
                              transition-all duration-300"
                    title="View Product Details"
                  >
                    <svg
                      className="w-5 h-5 text-brand-500 dark:text-brand-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  {/* Larger Modern Checkbox */}
                  <label className="relative flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="hidden peer"
                      checked={selectedItems.includes(item.cart_id)}
                      onChange={() => toggleSelection(item.cart_id)}
                    />
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-navy-700
                                  border-2 border-gray-200/50 dark:border-navy-600/50
                                  peer-checked:border-brand-500 peer-checked:bg-brand-500
                                  hover:border-brand-400 dark:hover:border-brand-400
                                  group-hover:shadow-lg group-hover:shadow-brand-500/25
                                  flex items-center justify-center
                                  transition-all duration-300 ease-out">
                      <svg
                        className="w-5 h-5 text-white opacity-0 peer-checked:opacity-100
                                   transform scale-50 peer-checked:scale-100
                                   transition-all duration-300 ease-out"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </label>
                </div>

                {/* Rest of the existing card content */}
                <div className="relative">
                  <div className="relative p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Product Image Section with Controls */}
                      <div className="relative w-full lg:w-48">
                        {/* Image */}
                        <div className="aspect-square border rounded-xl overflow-hidden">
                          <img
                            src={item.img_url}
                            alt={item.product_name}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover transform group-hover:scale-110 
                                     transition-transform duration-700"
                          />
                        </div>

                        {/* Quantity Controls */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%]">
                          <div className="bg-white dark:bg-navy-700 rounded-xl shadow-lg 
                                        border border-gray-300 dark:border-navy-600/50 p-1">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => updateQuantity(item.cart_id, -1)}
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-600 rounded-lg 
                                         transition-colors disabled:opacity-50"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cart_id, 1)}
                                disabled={item.quantity >= item.stock}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-600 rounded-lg 
                                         transition-colors disabled:opacity-50"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[90%]
                                        opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                                        transition-all duration-300 ease-out">
                          <button
                            onClick={() => handleDelete(item.cart_id)}
                            className="w-full p-2 bg-white/80 dark:bg-navy-700/80 backdrop-blur-sm 
                                      rounded-xl shadow-sm border border-gray-300 dark:border-navy-600/50
                                      group/delete flex items-center justify-center gap-2
                                      hover:bg-red-50 dark:hover:bg-red-500/10
                                      transition-all duration-300"
                          >
                            <FiTrash2 className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-500 
                                           transition-opacity">
                              Remove
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                                         dark:from-white dark:to-gray-300 bg-clip-text text-transparent
                                         group-hover:from-brand-600 group-hover:to-brand-400 
                                         transition-all duration-300">
                            {item.product_name}
                          </h3>

                        </div>

                        {/* Variants Info */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          {item.variant_name && (
                            <div className="px-3 py-2 bg-gray-50 dark:bg-navy-700 rounded-lg">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Variant</p>
                              <p className="font-medium">{item.variant_name}</p>
                            </div>
                          )}
                          {item.sku_name && (
                            <div className="px-3 py-2 bg-gray-50 dark:bg-navy-700 rounded-lg">
                              <p className="text-xs text-gray-500 dark:text-gray-400">SKU</p>
                              <p className="font-medium">{item.sku_name}</p>
                            </div>
                          )}
                        </div>

                        {/* Stock Info */}
                        <div className="mt-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-full bg-gray-100 dark:bg-navy-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-500"
                                style={{ width: `${(item.quantity / item.stock) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {item.stock} units left
                            </span>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="mt-6 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Price per unit</p>
                            <p className="text-lg font-bold bg-gradient-to-r from-brand-500 to-brand-400 
                                        bg-clip-text text-transparent">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatPrice(item.sub_total)}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Improved */}
      {isDeleting && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
          aria-labelledby="delete-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with click handler */}
          <div
            className="fixed inset-0 bg-gray-900/70 dark:bg-navy-900/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsDeleting(false)}
          ></div>

          {/* Modal Content */}
          <div
            className="relative w-full max-w-md mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-navy-700/50 overflow-hidden transform transition-all duration-300 ease-out"
              style={{ animation: "fadeInUp 0.3s forwards" }}
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-red-500"></div>

              {/* Close button */}
              <button
                onClick={() => setIsDeleting(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              {/* Modal Header */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500">
                    <FiTrash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 id="delete-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
                      Remove Item
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to remove this item from your cart?
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {deleteError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/40 flex gap-3">
                    <div className="text-red-500 mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">{deleteError}</p>
                      <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-1">
                        Try refreshing the page or logging in again if the problem persists.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cart Item Info */}
                {itemToDelete && cartItems.find(item => item.cart_id === itemToDelete) && (
                  <div className="mb-6 bg-gray-50 dark:bg-navy-900 rounded-xl overflow-hidden border border-gray-200/70 dark:border-navy-700/70">
                    <div className="px-4 py-3 bg-gray-100/70 dark:bg-navy-800/70 border-b border-gray-200/70 dark:border-navy-700/70">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Item to remove:
                      </p>
                    </div>
                    <div className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 shadow-sm">
                        <img
                          src={cartItems.find(item => item.cart_id === itemToDelete)?.img_url}
                          alt="Product"
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {cartItems.find(item => item.cart_id === itemToDelete)?.product_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300">
                            ID: {itemToDelete}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
                            Qty: {cartItems.find(item => item.cart_id === itemToDelete)?.quantity}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatPrice(cartItems.find(item => item.cart_id === itemToDelete)?.sub_total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-navy-600 
                               text-gray-700 dark:text-gray-300 bg-white dark:bg-navy-700
                               hover:bg-gray-50 dark:hover:bg-navy-600 hover:shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-gray-300/30 dark:focus:ring-navy-500/30
                               transition-all duration-200"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2.5 text-sm font-medium rounded-xl
                               text-white bg-red-500 hover:bg-red-600 
                               shadow-sm hover:shadow-md hover:shadow-red-600/10
                               focus:outline-none focus:ring-2 focus:ring-red-500/30
                               transform hover:-translate-y-0.5 active:translate-y-0
                               transition-all duration-200
                               flex items-center gap-2"
                    type="button"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add this to style section */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
};

export default CartPage;