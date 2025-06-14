import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiTruck, FiMapPin, FiClock, FiPackage, FiBox, FiPhone, FiMail } from 'react-icons/fi';
import { SiGoogleearth } from 'react-icons/si';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ShippingForm = ({ onNext, onBack, savedData, personalInfo, onShippingChange }) => {
    const staticCouriers = [
        {
            id: 'jne',
            name: 'JNE',
            description: 'Jalur Nugraha Ekakurir',
            packages: [
                { id: 'reg', name: 'Reguler', estimate: '2-3 days', price: 12000 },
                { id: 'yes', name: 'YES (Yakin Esok Sampai)', estimate: '1 day', price: 24000 },
                { id: 'express', name: 'Express', estimate: 'Same day', price: 36000 }
            ],
            icon: FiTruck
        },
        {
            id: 'tiki',
            name: 'TIKI',
            description: 'Titipan Kilat',
            packages: [
                { id: 'eco', name: 'ECO', estimate: '3-4 days', price: 10000 },
                { id: 'reg', name: 'Regular', estimate: '2-3 days', price: 15000 },
                { id: 'ons', name: 'ONS', estimate: '1 day', price: 28000 }
            ],
            icon: FiBox
        },
        {
            id: 'pos',
            name: 'POS',
            description: 'POS Indonesia',
            packages: [
                { id: 'standard', name: 'Standard', estimate: '3-5 days', price: 9000 },
                { id: 'express', name: 'Express', estimate: '1-2 days', price: 20000 },
                { id: 'same-day', name: 'Same Day', estimate: 'Same day', price: 32000 }
            ],
            icon: SiGoogleearth
        }
    ];

    const [formData, setFormData] = useState(savedData || {
        fullname: "",
        email: "",
        phone: "",
        address: "",
        province_id: "",
        province: "",    // Added
        city_id: "",
        city: "",        // Added
        district_id: "",
        district: "",    // Added
        postal_code: "",
        country: "Indonesia"
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [locations, setLocations] = useState({
        provinces: [],
        cities: [],
        districts: []
    });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    useEffect(() => {
        // Here we're setting the locations based on the data from personalInfo
        // You might want to fetch this from an API instead
        setLocations({
            provinces: [{
                province_id: personalInfo?.province_id,
                province: personalInfo?.province || 'Not specified'
            }],
            cities: [{
                city_id: personalInfo?.city_id,
                city_name: personalInfo?.city || 'Not specified'
            }],
            districts: [{
                district_id: personalInfo?.district_id,
                district_name: personalInfo?.district || 'Not specified'
            }]
        });
    }, [personalInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCourierSelect = (courier) => {
        setSelectedCourier(courier);
        setFormData(prev => ({
            ...prev,
            courier: courier.id,
            package: '' // Reset package when courier changes
        }));
    };

    const handlePackageSelect = (pkg) => {
        const shippingData = {
            courier: selectedCourier.id,
            package: pkg.id,
            cost: pkg.price,
            method: `${selectedCourier.name} - ${pkg.name}`,
            estimate: pkg.estimate,
            notes: formData.notes || ''
        };

        setFormData(prev => ({
            ...prev,
            ...shippingData
        }));

        // Call the parent's shipping change handler
        onShippingChange(shippingData);
    };

    useEffect(() => {
        const isValid = formData.courier && formData.package;
        setIsFormValid(isValid);
    }, [formData.courier, formData.package]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid && !isSubmitting) {
            setIsSubmitting(true);
            try {
                await onNext(formData);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const getFormattedAddress = () => {
        return {
            fullAddress: personalInfo?.address || 'No address provided',
            province: personalInfo?.province || 'Not specified',
            city: personalInfo?.city || 'Not specified',
            district: personalInfo?.district || 'Not specified',
            postalCode: personalInfo?.postal_code || 'Not specified'
        };
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}
                className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-navy-700/50"
                data-aos="fade-up">

                {/* Header Section */}
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-navy-700">
                    <FiMapPin className="w-6 h-6 text-brand-500" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Shipping Information
                    </h2>
                </div>

                <div className="space-y-8">
                    {/* Address Card */}
                    <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-200/70 dark:border-navy-700/70"
                        data-aos="fade-up" data-aos-delay="100">
                        <div className="flex items-center gap-2 mb-4">
                            <FiMapPin className="w-5 h-5 text-brand-500" />
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                                Delivery Address
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {/* Recipient Information */}
                            <div className="flex flex-col space-y-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {personalInfo?.fullname || 'No name provided'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {personalInfo?.phone || 'No phone provided'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {personalInfo?.email || 'No email provided'}
                                </span>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-4 border-t border-gray-200 dark:border-navy-700 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Complete Address
                                    </span>
                                    <p className="text-gray-800 dark:text-white mt-1">
                                        {getFormattedAddress().fullAddress}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">City</span>
                                        <p className="text-gray-800 dark:text-white font-medium">
                                            {getFormattedAddress().city || 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">State/Province</span>
                                        <p className="text-gray-800 dark:text-white font-medium">
                                            {getFormattedAddress().province || 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">ZIP Code</span>
                                        <p className="text-gray-800 dark:text-white font-medium">
                                            {getFormattedAddress().postalCode || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">Country</span>
                                    <p className="text-gray-800 dark:text-white font-medium">
                                        {personalInfo?.country || 'Indonesia'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Updated Courier Selection */}
                    <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex items-center gap-2 mb-4">
                            <FiPackage className="w-5 h-5 text-brand-500" />
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                                Select Courier
                            </h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {staticCouriers.map((courier) => {
                                const Icon = courier.icon;
                                return (
                                    <button
                                        key={courier.id}
                                        type="button"
                                        onClick={() => handleCourierSelect(courier)}
                                        className={`relative p-6 border-2 rounded-xl transition-all duration-200
                                            ${formData.courier === courier.id
                                                ? 'border-brand-500 bg-brand-50 dark:bg-navy-800'
                                                : 'border-gray-200 dark:border-navy-700 hover:border-brand-300'
                                            } group hover:shadow-md`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className={`p-3 rounded-full mb-3 transition-colors
                                                ${formData.courier === courier.id
                                                    ? 'bg-brand-500 text-white'
                                                    : 'bg-gray-100 dark:bg-navy-700 text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-500'
                                                }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {courier.name}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">
                                                {courier.description}
                                            </span>
                                            {formData.courier === courier.id && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* New Shipping Packages Section */}
                    {selectedCourier && (
                        <div className="mt-8 space-y-4" data-aos="fade-up" data-aos-delay="300">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                                Select Shipping Package
                            </h3>
                            <div className="space-y-3">
                                {selectedCourier.packages.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        type="button"
                                        onClick={() => handlePackageSelect(pkg)}
                                        className={`w-full p-4 border-2 rounded-xl transition-all duration-200
                                            ${formData.package === pkg.id
                                                ? 'border-brand-500 bg-brand-50/50 dark:bg-navy-800'
                                                : 'border-gray-200 dark:border-navy-700 hover:border-brand-300'
                                            } flex items-center justify-between group hover:shadow-sm`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-4 h-4 mt-1 rounded-full border-2 transition-colors
                                                ${formData.package === pkg.id
                                                    ? 'border-brand-500 bg-brand-500'
                                                    : 'border-gray-300'
                                                }`}
                                            />
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {pkg.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Estimated delivery: {pkg.estimate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-brand-500">
                                                Rp {pkg.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes Section */}
                    <div className="space-y-3" data-aos="fade-up" data-aos-delay="300">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Delivery Notes
                            <span className="text-gray-500 ml-1">(Optional)</span>
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional delivery instructions..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-navy-900 border rounded-xl
                                focus:ring-2 focus:ring-brand-500/20 transition-colors
                                border-gray-200 dark:border-navy-700 resize-none"
                            rows="3"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-navy-700">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-2.5 rounded-xl text-gray-700 bg-gray-100 
                            hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        ← Back
                    </button>
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className={`px-6 py-2.5 rounded-xl text-white transition-all duration-200 
                            flex items-center justify-center gap-2 relative
                            ${isFormValid && !isSubmitting
                                ? 'bg-brand-500 hover:bg-brand-600 cursor-pointer'
                                : 'bg-gray-300 dark:bg-navy-600 cursor-not-allowed'
                            }`}
                        title={!isFormValid ? "Please select both courier and shipping package" : ""}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Continue to Payment</span>
                                <span>→</span>
                                {!isFormValid && (
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                                        Please select courier and package
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

ShippingForm.propTypes = {
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onShippingChange: PropTypes.func.isRequired,
    personalInfo: PropTypes.shape({
        fullname: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        address: PropTypes.string,
        province_id: PropTypes.string,
        province: PropTypes.string,  // Added
        city_id: PropTypes.string,
        city: PropTypes.string,      // Added
        district_id: PropTypes.string,
        district: PropTypes.string,  // Added
        postal_code: PropTypes.string,
        country: PropTypes.string
    }),
    savedData: PropTypes.shape({
        courier: PropTypes.string,
        package: PropTypes.string,
        notes: PropTypes.string
    })
};

export default ShippingForm;