import { useState, useEffect } from 'react';
import {
    FiCheck, FiUser, FiMapPin, FiCreditCard, FiShoppingBag,
    FiClock, FiBox, FiInfo, FiMessageCircle
} from 'react-icons/fi';
import PropTypes from 'prop-types';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ReviewOrder = ({ onBack, formData, cartData, onOrderPlaced }) => {
    const [error, setError] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderStatus, setOrderStatus] = useState('review');
    const [paymentProof, setPaymentProof] = useState(null);
    const personal = formData.personal_info || {};
    const shipping = formData.shipping || {};
    const payment = formData.payment || {};
    const { baseURL } = useSelector((state) => state.auth);
    const shippingCost = shipping.cost || cartData.shipping?.cost || 0;
    const orderTotal = (cartData.summary?.subtotal || 0) + shippingCost;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    useEffect(() => {
        AOS.init({
            duration: 800, // values from 0 to 3000, with step 50ms
            once: true,    // whether animation should happen only once
            easing: 'ease-out-cubic',
            delay: 100
        });
    }, []);

    const handlePlaceOrder = async () => {
        try {
            setError(null); // Clear any previous errors
            if (!termsAccepted) {
                setError('Please accept the terms and conditions');
                return;
            }

            // Validate required data
            const missingPersonalFields = [];
            if (!personal.fullname) missingPersonalFields.push('fullname');
            if (!personal.email) missingPersonalFields.push('email');
            if (!personal.phone) missingPersonalFields.push('phone');
            if (!personal.address) missingPersonalFields.push('address');

            if (missingPersonalFields.length > 0) {
                console.error('Missing personal information:', missingPersonalFields);
                setError('Missing personal information');
                return;
            }

            const missingShippingFields = [];
            if (!shipping.courier) missingShippingFields.push('courier');
            if (!shipping.package) missingShippingFields.push('package');

            if (missingShippingFields.length > 0) {
                console.error('Missing shipping information:', missingShippingFields);
                setError('Missing shipping information');
                return;
            }

            if (!payment.method) {
                console.error('Missing payment information: payment method');
                setError('Missing payment information');
                return;
            }

            if (!cartData.items || cartData.items.length === 0) {
                console.error('Cart is empty');
                setError('Your cart is empty');
                return;
            }

            setIsSubmitting(true);
            try {
                // We don't need to explicitly provide the user_id
                // The backend will retrieve it from the session
                const orderData = {
                    fullname: personal.fullname,
                    email: personal.email,
                    phone_number: personal.phone,
                    shipping_address: personal.address,
                    province: personal.province,
                    city: personal.city,
                    district: personal.district,
                    postal_code: personal.postal_code,
                    courier: shipping.courier,
                    shipping_package: shipping.package,
                    shipping_cost: shippingCost,
                    shipping_notes: shipping.notes || '',
                    shipping_estimate: shipping.estimate || cartData.shipping?.estimate || '',
                    shipping_method: shipping.method || cartData.shipping?.method || 'Standard Delivery',
                    payment_method: payment.method,
                    payment_option: payment.option || '',
                    subtotal: cartData.summary?.subtotal || 0,
                    total_amount: orderTotal,
                    items: cartData.items.map(item => ({
                        product_id: item.product_id,
                        variant_id: item.variant_id || null,
                        sku_id: item.sku_id || null,
                        quantity: item.quantity,
                        price: item.price,
                        subtotal: item.price * item.quantity
                    }))
                };

                // Log complete order data to console for debugging
                console.log('Sending order to server:', {
                    orderData,
                    endpoint: '/api/orders'
                });

                // Send order to backend API with credentials to include cookies
                const response = await baseURL.post(`/api/orders`, orderData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true // This ensures cookies are sent with the request
                });

                // Log the server response
                console.log('Server response:', response.data);

                if (response.data.status === 'success') { // Changed from checking 'success' property to checking status
                    // Store order ID for reference
                    localStorage.setItem('lastOrderId', response.data.data.order_id);
                    localStorage.setItem('orderPlaced', 'true'); // Add flag for redirect

                    // Update order status and notify parent
                    onOrderPlaced();
                    setOrderStatus(payment.method === 'cod' ? 'success' : 'payment');

                } else {
                    throw new Error(response.data.message || 'Failed to create order');
                }

            } catch (error) {
                console.error('Error placing order:', error);
                // Log additional error details if available
                if (error.response) {
                    console.error('Error response:', {
                        status: error.response.status,
                        data: error.response.data
                    });

                    // Display specific missing fields if available
                    if (error.response.data && error.response.data.missingFields) {
                        console.error('Missing fields:', error.response.data.missingFields);
                        setError(`Missing required fields: ${error.response.data.missingFields.join(', ')}`);
                        return;
                    }
                }
                setError(error.response?.data?.message || error.message);
            } finally {
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setError(error.response?.data?.message || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 
                    dark:border-red-800/30 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}
            <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg overflow-hidden"
                data-aos="fade-up">
                {orderStatus === 'review' ? (
                    <>
                        {/* New Header Section with Gradient */}
                        <div className="relative bg-gradient-to-r from-brand-500 to-brand-600 p-6 sm:p-8">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Review Your Order
                                </h2>
                                <p className="text-brand-50 text-sm">
                                    Please verify all information before placing your order
                                </p>
                                <div className="absolute top-0 right-0 mt-2 mr-2">
                                    <span className="px-3 py-1 text-sm bg-white/10 backdrop-blur-sm 
                                        text-white rounded-full border border-white/20">
                                        Step 4 of 4
                                    </span>
                                </div>
                            </div>
                            {/* Decorative Background Elements */}
                            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-400 rounded-full 
                                opacity-20 -translate-y-32 translate-x-32" />
                            <div className="absolute left-0 bottom-0 w-40 h-40 bg-brand-400 rounded-full 
                                opacity-10 translate-y-20 -translate-x-20" />
                        </div>

                        {/* Rest of the content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {/* Left Column - Main Content */}
                                <div className="lg:col-span-3 space-y-6">
                                    {/* Customer Information Card */}
                                    <div className="bg-white dark:bg-navy-800/95 rounded-xl p-5 space-y-4 shadow-sm border border-gray-100 dark:border-navy-700/50"
                                        data-aos="fade-up">
                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-navy-700">
                                            <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                                                <FiUser className="w-5 h-5 text-brand-500" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                Customer Information
                                            </h3>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</span>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {personal.fullname}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</span>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {personal.phone}
                                                </p>
                                            </div>
                                            <div className="sm:col-span-2 space-y-1">
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {personal.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address Card */}
                                    <div className="bg-white dark:bg-navy-800/95 rounded-xl p-5 space-y-4 shadow-sm border border-gray-100 dark:border-navy-700/50"
                                        data-aos="fade-up" data-aos-delay="100">
                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-navy-700">
                                            <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                                                <FiMapPin className="w-5 h-5 text-brand-500" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                Shipping Address
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {personal.address}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">City</span>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {personal.city}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Province</span>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {personal.province}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">District</span>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {personal.district}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Postal Code</span>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {personal.postal_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Details */}
                                    <div className="bg-white dark:bg-navy-800/95 rounded-xl p-5 space-y-4 shadow-sm border border-gray-100 dark:border-navy-700/50"
                                        data-aos="fade-up" data-aos-delay="200">
                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-navy-700">
                                            <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                                                <FiClock className="w-5 h-5 text-brand-500" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                Delivery Details
                                            </h3>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {shipping.method || 'Standard Delivery'}
                                                </p>
                                                {shipping.estimate && (
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Estimated delivery: {shipping.estimate}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(shippingCost)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Order Summary */}
                                <div className="lg:col-span-2">
                                    <div className="sticky top-6">
                                        <div className="bg-white dark:bg-navy-800/95 rounded-xl p-5 space-y-4 shadow-sm border border-gray-100 dark:border-navy-700/50"
                                            data-aos="fade-left" data-aos-delay="300">
                                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-navy-700">
                                                <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                                                    <FiShoppingBag className="w-5 h-5 text-brand-500" />
                                                </div>
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                    Order Summary
                                                </h3>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {formatPrice(cartData.summary.subtotal)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipping</span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {formatPrice(shippingCost)}
                                                    </span>
                                                </div>
                                                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-navy-700">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
                                                        <span className="text-lg font-bold text-brand-500">
                                                            {formatPrice(orderTotal)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Method */}
                                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-navy-700">
                                                <div className="flex items-center gap-2">
                                                    <FiCreditCard className="w-5 h-5 text-brand-500" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                                        {payment.method?.replace('_', ' ')}
                                                        {payment.option && ` - ${payment.option.toUpperCase()}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 space-y-4">
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 p-4 rounded-xl 
                                                    bg-brand-50/30 dark:bg-brand-500/5 cursor-pointer 
                                                    hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={termsAccepted}
                                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                                        className="w-4 h-4 rounded border-gray-300 text-brand-500 
                                                            focus:ring-brand-500 dark:border-navy-600"
                                                    />
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        I agree to the terms and conditions
                                                    </span>
                                                </label>

                                                {/* Add payment notice */}
                                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                                            <FiInfo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                                {payment.method === 'cod'
                                                                    ? "Your order will be processed immediately for Cash on Delivery payment method."
                                                                    : "Your order will be processed after we receive your payment confirmation."
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rest of the buttons section */}
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={handlePlaceOrder}
                                                    disabled={!termsAccepted || isSubmitting}
                                                    className={`w-full px-6 py-3 rounded-xl text-white 
                                                        flex items-center justify-center gap-2
                                                        ${termsAccepted && !isSubmitting
                                                            ? 'bg-brand-500 hover:bg-brand-600'
                                                            : 'bg-gray-300 dark:bg-navy-600 cursor-not-allowed'
                                                        }`}>
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="animate-spin rounded-full h-5 w-5 
                                                                border-2 border-white border-t-transparent" />
                                                            <span>Processing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Place Order</span>
                                                            <FiCheck className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onBack}
                                                    disabled={isSubmitting}
                                                    className="w-full px-6 py-3 rounded-xl text-gray-700 bg-gray-100 
                                                        hover:bg-gray-200 transition-colors flex items-center justify-center gap-2
                                                        disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <span>←</span>
                                                    <span>Back</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : orderStatus === 'success' ? (
                    <SuccessScreen />
                ) : (
                    <PaymentScreen
                        orderTotal={orderTotal}
                        paymentMethod={payment.method}
                        formatPrice={formatPrice}
                    />
                )}
            </div>
        </div>
    );
};

// Success Screen Component
const SuccessScreen = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="max-w-2xl mx-auto text-center p-8" data-aos="fade-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 
                          flex items-center justify-center">
                <FiCheck className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Order Successfully Placed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
                Your order has been received and will be processed immediately.
                We'll send you updates about your order status via email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => window.location.href = '/auth/products'}
                    className="px-6 py-3 rounded-xl bg-brand-500 text-white 
                            hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                >
                    <FiShoppingBag className="w-5 h-5" />
                    Continue Shopping
                </button>
                <button
                    onClick={() => window.location.href = `/${user?.role || 'customer'}/cart`}
                    className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700
                            hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    View Cart
                </button>
            </div>
        </div>
    );
};

// Payment Instructions Screen Component
const PaymentScreen = ({ orderTotal, paymentMethod, formatPrice }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentProof, setPaymentProof] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const orderId = localStorage.getItem('lastOrderId');
    const { baseURL, user } = useSelector((state) => state.auth);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi file
        if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
            setError('File must be an image (JPEG, PNG, or WebP)');
            return;
        }
        if (file.size > 5000000) {
            setError('File size should be less than 5MB');
            return;
        }

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setPaymentProof(file);
        setError(null);
    };

    const handleSubmitPayment = async () => {
        if (!paymentProof) {
            setError('Please upload payment proof');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('image', paymentProof);
            formData.append('payment_method', paymentMethod);
            formData.append('order_id', orderId);

            const response = await baseURL.post(
                `/api/orders/${orderId} /payment-proof`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                // Clear preview URL
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                console.log('Upload Success:', response.data);
                setPaymentSuccess(true);
            } else {
                throw new Error(response.data.message || 'Failed to upload payment proof');
            }

        } catch (error) {
            console.error('Payment submission error:', error);
            setError(error.response?.data?.message || 'Failed to submit payment proof');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (paymentSuccess) {
        return (
            <div className="max-w-2xl mx-auto p-8" data-aos="fade-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 
                                  flex items-center justify-center">
                        <FiCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Payment Proof Uploaded Successfully!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Thank you for your payment. We'll verify your payment and process your order shortly.
                        You'll receive updates about your order status via email.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-8 max-w-lg mx-auto">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                            Your order ID: <span className="font-medium">{orderId}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => window.location.href = `/${user?.role || 'customer'}/cart`}
                        className="w-full px-6 py-3 rounded-xl bg-brand-500 text-white 
                                hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiShoppingBag className="w-5 h-5" />
                        Return to Cart
                    </button>

                    <button
                        onClick={() => window.location.href = '/auth/products'}
                        className="w-full px-6 py-3 rounded-xl bg-gray-100 text-gray-700 
                                hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8" data-aos="fade-up">
            <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/20 
                              flex items-center justify-center">
                    <FiCreditCard className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Complete Your Payment
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Please complete your payment of {formatPrice(orderTotal)} to process your order.
                </p>
            </div>

            <div className="bg-white dark:bg-navy-800/95 rounded-xl p-6 mb-6 
                          border border-gray-200 dark:border-navy-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Payment Instructions
                </h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 
                                      dark:bg-brand-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-brand-500">1</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Transfer the exact amount of {formatPrice(orderTotal)} to:
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 
                                      dark:bg-brand-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-brand-500">2</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Bank Central Asia (BCA)
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Account Number: 1234567890
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Account Name: Your Store Name
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 
                                      dark:bg-brand-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-brand-500">3</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Take a screenshot or photo of your payment confirmation
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="bg-white dark:bg-navy-800/95 rounded-xl p-6 
                              border border-gray-200 dark:border-navy-700/50">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        Upload Payment Proof
                    </h4>

                    {/* File input with preview */}
                    <div className="space-y-4">
                        <label className="block">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                         file:mr-4 file:py-2 file:px-4 file:rounded-full
                                         file:border-0 file:text-sm file:font-medium
                                         file:bg-brand-50 file:text-brand-500
                                         dark:file:bg-brand-500/10 dark:file:text-brand-400
                                         hover:file:bg-brand-100 dark:hover:file:bg-brand-500/20"
                            />
                        </label>

                        {previewUrl && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Payment proof preview"
                                    className="max-w-full h-auto max-h-64 rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSubmitPayment}
                    disabled={!paymentProof || isSubmitting}
                    className={`w-full px-6 py-3 rounded-xl text-white
                              flex items-center justify-center gap-2
                              ${!paymentProof || isSubmitting
                            ? 'bg-gray-300 dark:bg-navy-600 cursor-not-allowed'
                            : 'bg-brand-500 hover:bg-brand-600'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin rounded-full h-5 w-5 
                                           border-2 border-white border-t-transparent" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <FiCheck className="w-5 h-5" />
                            <span>Submit Payment Proof</span>
                        </>
                    )}
                </button>

                <button
                    onClick={() => window.location.href = '/contact'}
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 text-gray-700 
                             hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                    <FiMessageCircle className="w-5 h-5" />
                    Need Help? Contact Support
                </button>
            </div>
        </div>
    );
};

ReviewOrder.propTypes = {
    onBack: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        personal_info: PropTypes.shape({
            fullname: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string,
            address: PropTypes.string,
            province: PropTypes.string,
            city: PropTypes.string,
            district: PropTypes.string,
            postal_code: PropTypes.string,
            country: PropTypes.string
        }),
        shipping: PropTypes.shape({
            courier: PropTypes.string,
            package: PropTypes.string,
            notes: PropTypes.string,
            cost: PropTypes.number,
            method: PropTypes.string,
            estimate: PropTypes.string
        }),
        payment: PropTypes.shape({
            method: PropTypes.string,
            option: PropTypes.string
        })
    }).isRequired,
    cartData: PropTypes.shape({
        items: PropTypes.array.isRequired,
        summary: PropTypes.shape({
            subtotal: PropTypes.number.isRequired,
            total: PropTypes.number
        }).isRequired,
        shipping: PropTypes.shape({
            method: PropTypes.string,
            cost: PropTypes.number,
            estimate: PropTypes.string
        })
    }).isRequired,
    onOrderPlaced: PropTypes.func.isRequired
};

export default ReviewOrder;