import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Add isVisible prop to component definition
const OrderSummary = ({ cartData, isVisible = true }) => {
    const [persistedShipping, setPersistedShipping] = useState(null);

    // Load saved shipping data on mount
    useEffect(() => {
        const savedShipping = localStorage.getItem('checkoutShipping');
        if (savedShipping) {
            setPersistedShipping(JSON.parse(savedShipping));
        }

        // Cleanup function
        return () => {
            localStorage.removeItem('checkoutShipping');
        };
    }, []);

    // Save shipping data when it changes
    useEffect(() => {
        if (cartData?.shipping?.method) {
            localStorage.setItem('checkoutShipping', JSON.stringify(cartData.shipping));
            setPersistedShipping(cartData.shipping);
        }
    }, [cartData?.shipping]);

    // Add early return if not visible
    if (!isVisible || !cartData) return null;

    const { items, summary } = cartData;
    // Use persisted shipping data if current shipping is not available
    const shipping = cartData.shipping?.method ? cartData.shipping : persistedShipping;

    // Calculate total including shipping
    const total = (summary?.subtotal || 0) + (shipping?.cost || 0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Update the main container div with pattern decoration
    return (
        <div className="relative bg-white dark:bg-navy-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-navy-700/50 overflow-hidden">
            {/* Decorative Patterns */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
                <div className="absolute right-0 top-0 w-40 h-40 -translate-y-16 translate-x-16">
                    <div className="absolute inset-0 rotate-45">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-px w-40 bg-brand-500"
                                style={{ top: `${i * 8}px` }}
                            />
                        ))}
                    </div>
                </div>
                <div className="absolute left-0 bottom-0 w-40 h-40 translate-y-16 -translate-x-16">
                    <div className="absolute inset-0 -rotate-45">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-px w-40 bg-brand-500"
                                style={{ top: `${i * 8}px` }}
                            />
                        ))}
                    </div>
                </div>
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, ${getComputedStyle(document.documentElement).getPropertyValue('--brand-500')} 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Order Summary
                </h3>

                {/* Items list */}
                <div className="space-y-4 mb-6">
                    {items?.map((item) => (
                        <div key={item.cart_id} className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden 
                                        bg-gray-100 dark:bg-navy-700">
                                <img src={item.img_url}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous" />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 
                                        dark:text-white truncate">
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

                            {/* Item Subtotal */}
                            <p className="text-sm font-medium text-brand-500 
                                    dark:text-brand-400 whitespace-nowrap">
                                {formatPrice(item.sub_total)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-navy-700">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(summary?.subtotal || 0)}
                        </span>
                    </div>

                    {/* Update the shipping display section */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                        <div className="text-right">
                            {shipping?.method ? (
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(shipping.cost)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {shipping.method}
                                    </p>
                                    {shipping.estimate && (
                                        <p className="text-xs text-brand-500">
                                            Est. {shipping.estimate}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-400">Select shipping method</span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between text-base font-medium pt-4 border-t border-gray-200 dark:border-navy-700">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-brand-500">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

OrderSummary.propTypes = {
    cartData: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            cart_id: PropTypes.string.isRequired,
            product_name: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            sub_total: PropTypes.number.isRequired,
            img_url: PropTypes.string
        })).isRequired,
        summary: PropTypes.shape({
            subtotal: PropTypes.number.isRequired,
            total: PropTypes.number.isRequired
        }).isRequired,
        shipping: PropTypes.shape({
            method: PropTypes.string,
            cost: PropTypes.number,
            estimate: PropTypes.string,
            courier: PropTypes.string
        })
    }).isRequired,
    isVisible: PropTypes.bool
};

export default OrderSummary;