import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { FiUser, FiMail, FiPhone, FiMapPin, FiMap, FiNavigation } from "react-icons/fi";
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

const PersonalInfoForm = ({ onNext, savedData }) => {
    const [formData, setFormData] = useState(savedData || {
        fullname: "",
        email: "",
        phone: "",
        address: "",
        province_id: "",
        city_id: "",
        district_id: "",
        postal_code: "",
        country: "Indonesia"
    });

    const [locations, setLocations] = useState({
        provinces: [],
        cities: [],
        districts: []
    });

    const [loading, setLoading] = useState({
        provinces: false,
        cities: false,
        districts: false,
        submit: false
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoading(prev => ({ ...prev, provinces: true }));
            try {
                const response = await axios.get(`${API_BASE_URL}/provinces.json`);
                setLocations(prev => ({
                    ...prev,
                    provinces: response.data.map(province => ({
                        province_id: province.id,
                        province: province.name
                    }))
                }));
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setLoading(prev => ({ ...prev, provinces: false }));
            }
        };

        fetchProvinces();
    }, []);

    // Fetch cities when province changes
    useEffect(() => {
        if (!formData.province_id) return;

        const fetchCities = async () => {
            setLoading(prev => ({ ...prev, cities: true }));
            try {
                const response = await axios.get(`${API_BASE_URL}/regencies/${formData.province_id}.json`);
                setLocations(prev => ({
                    ...prev,
                    cities: response.data.map(city => ({
                        city_id: city.id,
                        city_name: city.name
                    }))
                }));
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                setLoading(prev => ({ ...prev, cities: false }));
            }
        };

        fetchCities();
    }, [formData.province_id]);

    // Fetch districts when city changes
    useEffect(() => {
        if (!formData.city_id) return;

        const fetchDistricts = async () => {
            setLoading(prev => ({ ...prev, districts: true }));
            try {
                const response = await axios.get(`${API_BASE_URL}/districts/${formData.city_id}.json`);
                setLocations(prev => ({
                    ...prev,
                    districts: response.data.map(district => ({
                        district_id: district.id,
                        district_name: district.name
                    }))
                }));
            } catch (error) {
                console.error('Error fetching districts:', error);
            } finally {
                setLoading(prev => ({ ...prev, districts: false }));
            }
        };

        fetchDistricts();
    }, [formData.city_id]);

    // Modify the handleChange function to store both ID and name
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'province_id') {
            const selectedProvince = locations.provinces.find(p => p.province_id === value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                province: selectedProvince?.province || '',
                city_id: '',
                city: '',
                district_id: '',
                district: '',
                postal_code: ''
            }));
        } else if (name === 'city_id') {
            const selectedCity = locations.cities.find(c => c.city_id === value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                city: selectedCity?.city_name || '',
                district_id: '',
                district: '',
                postal_code: ''
            }));
        } else if (name === 'district_id') {
            const selectedDistrict = locations.districts.find(d => d.district_id === value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                district: selectedDistrict?.district_name || ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Validate field
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'fullname':
                return value?.trim() ? '' : 'Full name is required';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ''
                    : 'Valid email is required';
            case 'phone':
                return /^[0-9+\-\s()]{10,}$/.test(value)
                    ? ''
                    : 'Valid phone number is required';
            case 'address':
                return value?.trim()
                    ? ''
                    : 'Address is required';
            case 'province_id':
                return value?.trim()
                    ? ''
                    : 'Province is required';
            case 'city_id':
                return value?.trim()
                    ? ''
                    : 'City is required';
            case 'district_id':
                return value?.trim()
                    ? ''
                    : 'District is required';
            case 'postal_code':
                return /^\d{5}(?:[-\s]\d{4})?$/.test(value)
                    ? ''
                    : 'Valid ZIP code is required';
            default:
                return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid && !isSubmitting) {
            setIsSubmitting(true);
            try {
                // Make sure to include both IDs and names
                const formDataWithNames = {
                    ...formData,
                    province: locations.provinces.find(p => p.province_id === formData.province_id)?.province,
                    city: locations.cities.find(c => c.city_id === formData.city_id)?.city_name,
                    district: locations.districts.find(d => d.district_id === formData.district_id)?.district_name
                };
                await onNext(formDataWithNames);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleClear = () => {
        setFormData({
            fullname: "",
            email: "",
            phone: "",
            address: "",
            province_id: "",
            city_id: "",
            district_id: "",
            postal_code: "",
            country: "Indonesia"
        });
        setErrors({});
    };

    // First, add a function to check if all required fields are filled
    const isFormComplete = () => {
        const requiredFields = [
            'fullname',
            'email',
            'phone',
            'address',
            'province_id',
            'city_id',
            'district_id',
            'postal_code'
        ];

        return requiredFields.every(field => formData[field]?.trim?.());
    };

    // Update the useEffect for form validation
    useEffect(() => {
        const hasErrors = Object.values(errors).some(error => error !== '');
        const isComplete = isFormComplete();

        setIsFormValid(!hasErrors && isComplete);
    }, [formData, errors]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/95 dark:bg-navy-800/95 rounded-2xl p-6 shadow-lg border border-gray-200/50 
     dark:border-navy-700/50 relative overflow-hidden">
                {/* Update the decorative background with lower opacity */}
                <div className="absolute inset-0">
                    {/* Lighter gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50/20 to-transparent 
             dark:from-brand-900/10 dark:to-transparent" />

                    {/* Reduced opacity for patterns */}
                    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
                        {/* Diagonal Lines Top Right */}
                        <div className="absolute right-0 top-0 w-72 h-72 -translate-y-24 translate-x-24">
                            <div className="absolute inset-0 rotate-45">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-px w-72 bg-brand-500"
                                        style={{
                                            top: `${i * 12}px`,
                                            opacity: `${(8 - i) * 0.1}`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Diagonal Lines Bottom Left */}
                        <div className="absolute left-0 bottom-0 w-72 h-72 translate-y-24 -translate-x-24">
                            <div className="absolute inset-0 -rotate-45">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-px w-72 bg-brand-500"
                                        style={{
                                            top: `${i * 12}px`,
                                            opacity: `${(8 - i) * 0.1}`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Dot Pattern */}
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, 
                                    ${getComputedStyle(document.documentElement)
                                        .getPropertyValue('--brand-500')} 1px, transparent 0)`,
                                backgroundSize: '32px 32px',
                                opacity: 0.4
                            }}
                        />

                        {/* Circular Decoration */}
                        <div className="absolute right-0 bottom-0">
                            <div className="w-64 h-64 rounded-full border border-brand-500/10 
                                 -translate-y-1/2 translate-x-1/2" />
                            <div className="w-48 h-48 rounded-full border border-brand-500/10 
                                 -translate-y-3/4 translate-x-1/4" />
                        </div>
                    </div>
                </div>

                {/* Enhance text contrast and readability */}
                <div className="relative z-10">
                    {/* Update section headers */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200 dark:border-navy-700">
                        <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10">
                            <FiUser className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Personal Information
                        </h2>
                    </div>

                    {/* Personal Information Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up">
                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                Full Name <span className="text-red-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full pl-10 pr-4 py-3
                bg-white dark:bg-navy-900
                border-2 rounded-xl 
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:ring-2 focus:ring-brand-500/20
                focus:border-brand-500 dark:focus:border-brand-400
                transition-all duration-200
                ${errors.fullname
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                        }`}
                                />
                            </div>
                            {errors.fullname && (
                                <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.fullname}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full pl-10 pr-4 py-2.5 
        bg-white/70 dark:bg-navy-900/70 
        backdrop-blur-sm
        border rounded-xl 
        focus:ring-2 focus:ring-brand-500/20
        focus:border-brand-500 dark:focus:border-brand-400
        transition-all duration-200
        ${errors.email
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+62 xxx-xxxx-xxxx"
                                    className={`w-full pl-10 pr-4 py-2.5 
        bg-white/70 dark:bg-navy-900/70 
        backdrop-blur-sm
        border rounded-xl 
        focus:ring-2 focus:ring-brand-500/20
        focus:border-brand-500 dark:focus:border-brand-400
        transition-all duration-200
        ${errors.phone
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                        }`}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="mt-10" data-aos="fade-up" data-aos-delay="100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200 dark:border-navy-700">
                            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10">
                                <FiMapPin className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Shipping Address
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Province Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Province <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiMap className="absolute left-3 top-3 text-gray-400" />
                                    <select
                                        name="province_id"
                                        value={formData.province_id}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 
        bg-white/70 dark:bg-navy-900/70 
        backdrop-blur-sm
        border rounded-xl 
        focus:ring-2 focus:ring-brand-500/20
        focus:border-brand-500 dark:focus:border-brand-400
        transition-all duration-200
        ${errors.province_id
                                                ? 'border-red-500'
                                                : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                            }`}
                                        disabled={loading.provinces}
                                    >
                                        <option value="">Select Province</option>
                                        {locations.provinces.map(province => (
                                            <option key={province.province_id} value={province.province_id}>
                                                {province.province}
                                            </option>
                                        ))}
                                    </select>
                                    {loading.provinces && (
                                        <div className="absolute right-3 top-3">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-500 border-t-transparent"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.province_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.province_id}</p>
                                )}
                            </div>

                            {/* City Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiNavigation className="absolute left-3 top-3 text-gray-400" />
                                    <select
                                        name="city_id"
                                        value={formData.city_id}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 
        bg-white/70 dark:bg-navy-900/70 
        backdrop-blur-sm
        border rounded-xl 
        focus:ring-2 focus:ring-brand-500/20
        focus:border-brand-500 dark:focus:border-brand-400
        transition-all duration-200
        ${errors.city_id
                                                ? 'border-red-500'
                                                : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                            }`}
                                        disabled={!formData.province_id || loading.cities}
                                    >
                                        <option value="">Select City</option>
                                        {locations.cities.map(city => (
                                            <option key={city.city_id} value={city.city_id}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </select>
                                    {loading.cities && (
                                        <div className="absolute right-3 top-3">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-500 border-t-transparent"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.city_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.city_id}</p>
                                )}
                            </div>

                            {/* District Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    District <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                                    <select
                                        name="district_id"
                                        value={formData.district_id}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 
        bg-white/70 dark:bg-navy-900/70 
        backdrop-blur-sm
        border rounded-xl 
        focus:ring-2 focus:ring-brand-500/20
        focus:border-brand-500 dark:focus:border-brand-400
        transition-all duration-200
        ${errors.district_id
                                                ? 'border-red-500'
                                                : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                            }`}
                                        disabled={!formData.city_id || loading.districts}
                                    >
                                        <option value="">Select District</option>
                                        {locations.districts.map(district => (
                                            <option key={district.district_id} value={district.district_id}>
                                                {district.district_name}
                                            </option>
                                        ))}
                                    </select>
                                    {loading.districts && (
                                        <div className="absolute right-3 top-3">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-500 border-t-transparent"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.district_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.district_id}</p>
                                )}
                            </div>

                            {/* ZIP Code Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    ZIP Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    placeholder="Enter ZIP code"
                                    className={`w-full px-4 py-2.5 
        bg-white/70 dark:bg-navy-900/70 
        backdrop-blur-sm
        border rounded-xl 
        focus:ring-2 focus:ring-brand-500/20
        focus:border-brand-500 dark:focus:border-brand-400
        transition-all duration-200
        ${errors.postal_code
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                        }`}
                                />
                                {errors.postal_code && (
                                    <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                                )}
                            </div>

                            {/* Complete Address Field - Now at the bottom */}
                            <div className="space-y-2 md:col-span-2 mt-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Complete Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your complete address details"
                                        className={`w-full pl-10 pr-4 py-2.5 
        bg-white/70 dark:bg-navy-900/70 
        backdrop-blur-sm
        border rounded-xl 
        focus:ring-2 focus:ring-brand-500/20
        focus:border-brand-500 dark:focus:border-brand-400
        transition-all duration-200
        ${errors.address
                                                ? 'border-red-500'
                                                : 'border-gray-200 dark:border-navy-700 hover:border-brand-500/50'
                                            }`}
                                        rows="3"
                                    />
                                </div>
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Update form completion warning */}
                    {!isFormComplete() && (
                        <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800/30">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                Please fill in all required fields marked with <span className="text-red-500 font-bold">*</span>
                            </p>
                        </div>
                    )}

                    {/* Update action buttons */}
                    <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t-2 border-gray-200 dark:border-navy-700">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="inline-flex items-center px-6 py-3 rounded-xl text-gray-700 bg-gray-100 
                          hover:bg-gray-200 font-medium transition-colors duration-200"
                        >
                            Clear Form
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || !isFormComplete()}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium
                          transition-all duration-200
                          ${isFormValid && isFormComplete()
                                    ? 'bg-brand-500 hover:bg-brand-600 cursor-pointer'
                                    : 'bg-gray-300 dark:bg-navy-600 cursor-not-allowed'
                                }`}
                        >
                            {!isFormComplete() ? (
                                <span>Please Fill All Fields</span>
                            ) : (
                                <>
                                    <span>Continue to Shipping</span>
                                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

PersonalInfoForm.propTypes = {
    onNext: PropTypes.func.isRequired,
    savedData: PropTypes.shape({
        fullname: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        address: PropTypes.string,
        province_id: PropTypes.string,
        city_id: PropTypes.string,
        district_id: PropTypes.string,
        postal_code: PropTypes.string,
        country: PropTypes.string
    })
};

export default PersonalInfoForm;