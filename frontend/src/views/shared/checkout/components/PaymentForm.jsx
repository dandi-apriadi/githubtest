import { useState, useEffect } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import PropTypes from 'prop-types';
import {
    RiBankFill,
    RiMoneyDollarCircleFill,
    RiBuildingFill
} from 'react-icons/ri';

const paymentMethods = [
    {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: RiBankFill,
        description: 'Pay from your bank account',
        options: [
            {
                id: 'bca',
                name: 'BCA',
                icon: RiBuildingFill,
                instructions: `
                    Bank: BCA
                    Account Number: 1234567890
                    Account Name: Your Company Name
                    
                    Steps:
                    1. Login to your BCA mobile/internet banking
                    2. Select transfer menu
                    3. Enter the account number above
                    4. Enter the exact amount
                    5. Keep your payment proof
                `
            },
            {
                id: 'mandiri',
                name: 'Mandiri',
                icon: RiBuildingFill,
                instructions: `
                    Bank: Mandiri
                    Account Number: 0987654321
                    Account Name: Your Company Name
                    
                    Steps:
                    1. Login to your Mandiri mobile/internet banking
                    2. Select transfer menu
                    3. Enter the account number above
                    4. Enter the exact amount
                    5. Keep your payment proof
                `
            },
            {
                id: 'bni',
                name: 'BNI',
                icon: RiBuildingFill,
                instructions: `
                    Bank: BNI
                    Account Number: 1122334455
                    Account Name: Your Company Name
                    
                    Steps:
                    1. Login to your BNI mobile/internet banking
                    2. Select transfer menu
                    3. Enter the account number above
                    4. Enter the exact amount
                    5. Keep your payment proof
                `
            }
        ]
    },
    {
        id: 'cod',
        name: 'Cash on Delivery',
        icon: RiMoneyDollarCircleFill,
        description: 'Pay when you receive',
        instructions: `
            1. Place your order
            2. Our courier will deliver to your address
            3. Inspect your items upon delivery
            4. Pay in cash to the courier
            5. Keep your receipt
            
            Note: COD is only available for selected areas
        `
    }
];

const PaymentForm = ({ onNext, onBack, savedData }) => {
    // Check if savedData.method is 'e_wallet', if so change to 'cod' as default
    const initialMethod = savedData?.method === 'e_wallet' ? 'cod' : (savedData?.method || 'cod');
    const [selectedMethod, setSelectedMethod] = useState(initialMethod);
    const [selectedOption, setSelectedOption] = useState(savedData?.option || '');
    const [formData, setFormData] = useState({
        method: initialMethod,
        option: savedData?.option || '',
        instructions: paymentMethods.find(m => m.id === initialMethod)?.instructions || ''
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, formattedValue)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.method) {
            setErrors({ method: 'Payment method is required' });
            return;
        }

        if (formData.method !== 'cod' && !formData.option) {
            setErrors({ option: 'Payment option is required' });
            return;
        }

        try {
            onNext({
                ...formData,
                instructions: selectedMethod === 'cod'
                    ? paymentMethods.find(m => m.id === 'cod')?.instructions
                    : paymentMethods
                        .find(m => m.id === selectedMethod)
                        ?.options.find(o => o.id === selectedOption)
                        ?.instructions
            });
        } catch (error) {
            console.error('Error in payment form submission:', error);
            setErrors({ submit: error.message });
        }
    };

    useEffect(() => {
        const isValid =
            selectedMethod === 'cod' ||
            (selectedMethod && selectedOption);

        console.log('Payment form validation state:', { // Add logging
            selectedMethod,
            selectedOption,
            isValid
        });

        setIsFormValid(isValid);
    }, [selectedMethod, selectedOption]);

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}
                className="bg-white dark:bg-navy-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200/50 dark:border-navy-700/50"
                data-aos="fade-up">

                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-navy-700">
                    <FiCreditCard className="w-6 h-6 text-brand-500" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Payment Information
                    </h2>
                </div>

                <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Select Payment Method
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => {
                                        const selectedMethodData = paymentMethods.find(m => m.id === method.id);
                                        setSelectedMethod(method.id);
                                        setSelectedOption('');
                                        setFormData(prev => ({
                                            ...prev,
                                            method: method.id,
                                            option: '',
                                            instructions: method.id === 'cod' ? selectedMethodData?.instructions : ''
                                        }));
                                    }}
                                    className={`p-4 border-2 rounded-xl transition-all duration-200
                                        ${selectedMethod === method.id
                                            ? 'border-brand-500 bg-brand-50/50 dark:bg-navy-800'
                                            : 'border-gray-200 dark:border-navy-700 hover:border-brand-300'
                                        } flex flex-col items-center gap-3`}
                                >
                                    <Icon className="w-6 h-6 text-brand-500" />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {method.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {method.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedMethod !== 'cod' && (
                    <div className="space-y-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                            Select Bank
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {paymentMethods
                                .find(m => m.id === selectedMethod)
                                ?.options.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => {
                                                const selectedMethodData = paymentMethods
                                                    .find(m => m.id === selectedMethod)
                                                    ?.options.find(o => o.id === option.id);

                                                setSelectedOption(option.id);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    option: option.id,
                                                    instructions: selectedMethodData?.instructions || ''
                                                }));
                                            }}
                                            className={`p-4 border-2 rounded-xl transition-all duration-200
                                                ${selectedOption === option.id
                                                    ? 'border-brand-500 bg-brand-50/50 dark:bg-navy-800'
                                                    : 'border-gray-200 dark:border-navy-700 hover:border-brand-300'
                                                } flex items-center gap-3`}
                                        >
                                            <Icon className="w-8 h-8" />
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {option.name}
                                            </span>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                )}

                {/* Single Payment Instructions Section */}
                <div className="bg-gray-50 dark:bg-navy-900 rounded-xl p-6 border border-gray-200 dark:border-navy-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Payment Instructions</h4>
                    <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                        {selectedMethod === 'cod'
                            ? paymentMethods.find(m => m.id === 'cod')?.instructions
                            : selectedOption
                                ? paymentMethods
                                    .find(m => m.id === selectedMethod)
                                    ?.options.find(o => o.id === selectedOption)
                                    ?.instructions
                                : 'Please select a payment option to see instructions.'
                        }
                    </pre>
                </div>


                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-navy-700">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-2.5 rounded-xl text-gray-700 bg-gray-100 
                            hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>←</span>
                        <span>Back</span>
                    </button>
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`px-6 py-2.5 rounded-xl text-white transition-all duration-200 
                            flex items-center justify-center gap-2 relative
                            ${isFormValid
                                ? 'bg-brand-500 hover:bg-brand-600 cursor-pointer'
                                : 'bg-gray-300 dark:bg-navy-600 cursor-not-allowed'
                            }`}
                        title={!isFormValid && selectedMethod !== 'cod' ? "Please select both payment method and option" : ""}
                    >
                        <span>Review Order</span>
                        <span>→</span>
                        {!isFormValid && selectedMethod !== 'cod' && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                                Please complete your selection
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

PaymentForm.propTypes = {
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    savedData: PropTypes.shape({
        method: PropTypes.string,
        option: PropTypes.string,
        cardNumber: PropTypes.string,
        cardName: PropTypes.string,
        expiryDate: PropTypes.string,
        cvv: PropTypes.string
    })
};

export default PaymentForm;