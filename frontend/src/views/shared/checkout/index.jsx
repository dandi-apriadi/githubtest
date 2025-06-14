import { FiArrowLeft, FiCreditCard, FiTruck, FiCheck, FiUser} from "react-icons/fi";
import PersonalInfoForm from './components/PersonalInfoForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from 'react';
import OrderSummary from './components/OrderSummary.jsx';
import PaymentForm from "./components/PaymentForm";
import ReviewOrder from "./components/ReviewOrder";
import ShippingForm from "./components/ShippingForm";
import PropTypes from 'prop-types';
import ErrorBoundary from './components/ErrorBoundary';

// Add price formatting utility
const formatPrice = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [personalInfo, setPersonalInfo] = useState(null);  // Add this line
  const [formData, setFormData] = useState({
    personal_info: {}, // Changed from 'personal' to 'personal_info' to match the key used in handleNextStep
    shipping: {},
    payment: {}
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false); // Add new state to track order placement

  const [cartSummary, setCartSummary] = useState({
    items: location.state?.checkoutData?.items || [],
    summary: {
      subtotal: location.state?.checkoutData?.summary?.subtotal || 0,
      total: location.state?.checkoutData?.summary?.total || 0
    },
    shipping: {
      cost: 0,
      method: '',
      estimate: '',
      courier: '',
      package: '' // Add package field
    }
  });

  const handleShippingChange = (shippingDetails) => {
    if (!shippingDetails) return;

    setCartSummary(prev => ({
      ...prev,
      shipping: {
        cost: shippingDetails.cost || 0,
        method: shippingDetails.method || '',
        estimate: shippingDetails.estimate || '',
        courier: shippingDetails.courier || '',
        package: shippingDetails.package || ''
      },
      summary: {
        ...prev.summary,
        total: prev.summary.subtotal + (shippingDetails.cost || 0)
      }
    }));
  };

  // Add this near the top of the component
  useEffect(() => {
    // Load saved form data from localStorage on component mount
    const savedFormData = localStorage.getItem('checkoutFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Add this to watch for form data changes
  useEffect(() => {
    // Save form data to localStorage whenever it changes
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  // Add cleanup in component unmount
  useEffect(() => {
    return () => {
      // Optionally clear the saved data when component unmounts
      // localStorage.removeItem('checkoutFormData');
    };
  }, []);

  // Add cleanup function
  useEffect(() => {
    return () => {
      // Clear checkout data on unmount
      localStorage.removeItem('checkoutFormData');
    };
  }, []);

  useEffect(() => {
    // Load saved shipping data on mount
    const savedShipping = localStorage.getItem('checkoutShipping');
    if (savedShipping) {
      const parsedShipping = JSON.parse(savedShipping);
      setCartSummary(prev => ({
        ...prev,
        shipping: parsedShipping
      }));
    }
  }, []);

  // Add this near the other useEffect hooks
  useEffect(() => {
    // Check if order was previously placed
    const orderPlaced = localStorage.getItem('orderPlaced');
    
    if (orderPlaced === 'true') {
      // Clear the flag and redirect to cart
      localStorage.removeItem('orderPlaced');
      const redirectPath = user?.role ? `/${user.role}/cart` : '/cart';
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, user?.role]);

  // Steps configuration
  const steps = useMemo(() => [
    { id: 1, title: 'Personal Info', icon: FiUser },
    { id: 2, title: 'Shipping', icon: FiTruck },
    { id: 3, title: 'Payment', icon: FiCreditCard },
    { id: 4, title: 'Review', icon: FiCheck }
  ], []);

  // Cart data memoization
  const cartData = useMemo(() => {
    if (!location?.state?.checkoutData) return null;

    const { items = [], summary = {}, shipping = { method: '', cost: 0 } } = location.state.checkoutData;

    return {
      items,
      summary,
      shipping
    };
  }, [location?.state?.checkoutData]);

  // Initialize checkout and validate cart data
  useEffect(() => {
    let mounted = true;
    const initializeCheckout = async () => {
      try {
        if (!mounted) return;
        setIsLoading(true);
        setError(null);

        // Check if location.state and checkoutData exist
        if (!location?.state?.checkoutData) {
          throw new Error('No cart data found');
        }

        const { items = [], summary = {}, shipping = {} } = location.state.checkoutData;

        // Validate items array with null checks
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('Cart is empty');
        }

        // Validate cart items structure with safe type checking
        const isValidCartData = items.every(item => {
          if (!item || typeof item !== 'object') return false;

          const requiredFields = {
            cart_id: 'string',
            product_name: 'string',
            price: 'number',
            quantity: 'number',
            sub_total: 'number',
            img_url: 'string',
            product_id: 'string',
            sku_name: 'string',
            variant_name: 'string',
            status: 'string',
            stock: 'number'
          };

          return Object.entries(requiredFields).every(([field, type]) => {
            const value = item[field];
            return value !== undefined && value !== null && typeof value === type;
          });
        });

        if (!isValidCartData) {
          throw new Error('Invalid cart item structure');
        }

        // Validate summary with safe type checking
        const isValidSummary = summary &&
          typeof summary === 'object' &&
          typeof summary.subtotal === 'number' &&
          typeof summary.shipping === 'number' &&
          typeof summary.total === 'number';

        if (!isValidSummary) {
          throw new Error('Invalid summary structure');
        }

        // Alternative shipping validation with safe trim check
        const isValidShipping = shipping &&
          typeof shipping === 'object' &&
          typeof shipping.cost === 'number' &&
          typeof shipping.method === 'string' &&
          (shipping.method?.trim?.() || '').length > 0;

        if (!isValidShipping) {
          throw new Error('Invalid shipping structure');
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          console.error('Checkout initialization error:', err);
          const redirectPath = user?.role ? `/${user.role}/cart` : '/cart';
          navigate(redirectPath, { replace: true });
        }
      }
    };

    initializeCheckout();

    return () => {
      mounted = false;
    };
  }, [location?.state, navigate, user?.role]);

  // Utility functions
  const isStepCompleted = (stepId) => completedSteps.includes(stepId);
  const isStepActive = (stepId) => currentStep === stepId;

  // Form validation
  const validateFormData = (stepData, step) => {
    console.log(`Validating ${step} data:`, stepData); // Add logging

    switch (step.toLowerCase()) {
      case 'shipping':
        if (!stepData.courier || !stepData.package) {
          throw new Error('Please select both courier and shipping package');
        }
        if (!stepData.method || !stepData.cost) {
          throw new Error('Invalid shipping method details');
        }
        break;
      case 'payment':
        if (!stepData || !stepData.method) {
          const error = new Error('Payment data is required');
          console.error('Payment validation failed:', error); // Add logging
          throw error;
        }
        if (stepData.method !== 'cod' && !stepData.option) {
          const error = new Error('Please select a payment option');
          console.error('Payment validation failed:', error); // Add logging
          throw error;
        }
        break;
      // ... other cases
    }
  };

  // Navigation handlers
  const handleStepNavigation = (stepId) => {
    try {
      if (isStepCompleted(stepId) || stepId === currentStep) {
        // Check if previous steps are completed
        const previousSteps = steps
          .filter(step => step.id < stepId)
          .map(step => step.id);

        const allPreviousStepsCompleted = previousSteps.every(step =>
          isStepCompleted(step));

        if (!allPreviousStepsCompleted) {
          throw new Error('Please complete previous steps first');
        }

        setCurrentStep(stepId);
        setError(null);
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleNextStep = (stepData) => {
    try {
      console.log('Processing step data:', { // Add logging
        currentStep,
        stepData
      });

      if (currentStep < steps.length) {
        const currentStepTitle = steps.find(step => step.id === currentStep)?.title;

        if (!currentStepTitle) {
          console.error('Invalid step:', currentStep); // Add logging
          throw new Error('Invalid step');
        }

        validateFormData(stepData, currentStepTitle);
        const formKey = currentStepTitle.toLowerCase().replace(/\s+/g, '_');

        // Validate specific data
        switch (formKey) {
          case 'shipping':
            if (!stepData.courier || !stepData.package) {
              throw new Error('Please select both courier and package');
            }
            break;
          case 'payment':
            if (!stepData.method) {
              throw new Error('Please select a payment method');
            }
            if (stepData.method !== 'cod' && !stepData.option) {
              throw new Error('Please select a payment option');
            }
            break;
          default:
            break;
        }

        // If it's personal info step, update personalInfo state
        if (formKey === 'personal_info') {
          setPersonalInfo(stepData);
        }

        setFormData(prev => ({
          ...prev,
          [formKey]: { ...stepData }
        }));

        // Mark step as completed
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps(prev => [...prev, currentStep]);
        }

        setCurrentStep(prev => prev + 1);
        setError(null);
      }
    } catch (err) {
      console.error('Step validation error:', { // Add detailed error logging
        step: currentStep,
        data: stepData,
        error: err
      });
      setError(err);
      console.error('Step validation error:', err);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  };

  const handleBackNavigation = () => {
    const redirectPath = user?.role ? `/${user.role}/cart` : '/cart';
    navigate(redirectPath);
  };

  // Modify the onOrderPlaced handler
  const handleOrderPlaced = () => {
    setIsOrderPlaced(true);
    // Set flag in localStorage when order is placed
    localStorage.setItem('orderPlaced', 'true');
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            onNext={handleNextStep}
            savedData={formData.personal_info}
            error={error}
          />
        );
      case 2:
        return (
          <ShippingForm
            onNext={handleNextStep}
            onBack={handlePrevStep}
            savedData={formData.shipping}
            personalInfo={formData.personal_info} // Use formData instead of personalInfo
            onShippingChange={handleShippingChange}
            error={error}
          />
        );
      case 3:
        return (
          <PaymentForm
            onNext={handleNextStep}
            onBack={handlePrevStep}
            savedData={formData.payment}
            error={error}
          />
        );
      case 4:
        return (
          <ReviewOrder
            onBack={handlePrevStep}
            formData={formData}
            cartData={cartData}
            error={error}
            onOrderPlaced={handleOrderPlaced} // Use the new handler
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">{error.message}</h2>
          <button
            onClick={handleBackNavigation}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  // Main layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/95 via-white/98 to-gray-50/95 
                    dark:from-navy-900 dark:via-navy-800 dark:to-navy-900">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <div className="relative bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl shadow-sm">
          {/* Gradient Border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

          <div className="max-w-7xl mx-auto">
            <div className="py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Back Button with improved hover effect */}
                  <button
                    onClick={handleBackNavigation}
                    className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400
                      hover:bg-brand-50 dark:hover:bg-navy-700 
                      hover:text-brand-500 dark:hover:text-brand-400
                      transition-all duration-200 group"
                  >
                    <FiArrowLeft className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Title Section with improved typography */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r 
                        from-gray-900 via-gray-800 to-gray-700
                        dark:from-white dark:via-gray-200 dark:to-gray-300 
                        bg-clip-text text-transparent">
                        Checkout
                      </h1>
                      {/* Step Indicator */}
                      <span className="hidden sm:inline-flex items-center px-3 py-1 text-xs 
                        rounded-full bg-brand-50 dark:bg-brand-500/10 
                        text-brand-600 dark:text-brand-400 font-medium">
                        Step {currentStep} of {steps.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Complete your purchase securely
                    </p>
                  </div>
                </div>

                {/* Optional: Add total amount display on header */}
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                    <span className="text-lg font-bold text-brand-500 dark:text-brand-400">
                      {formatPrice(cartSummary.summary.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border with Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-navy-700 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="hidden md:flex items-center justify-between px-6 py-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => handleStepNavigation(step.id)}
                className={`group flex items-center ${isStepCompleted(step.id) || step.id === currentStep
                  ? 'cursor-pointer'
                  : 'cursor-default'
                  }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors
                  ${isStepCompleted(step.id)
                    ? 'bg-brand-500/20 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 hover:bg-brand-500/30 dark:hover:bg-brand-400/30'
                    : isStepActive(step.id)
                      ? 'bg-brand-100 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400 ring-2 ring-brand-500 dark:ring-brand-400'
                      : 'bg-gray-100/80 text-gray-400 dark:bg-navy-700/50 dark:text-gray-500'}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium transition-colors
                    ${isStepActive(step.id)
                      ? 'text-brand-500 dark:text-brand-400'
                      : isStepCompleted(step.id)
                        ? 'text-brand-500/80 dark:text-brand-400/80 group-hover:text-brand-500 dark:group-hover:text-brand-400'
                        : 'text-gray-500 dark:text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-20 mx-4 h-1 transition-colors
                  ${isStepCompleted(step.id)
                    ? 'bg-brand-500/20 dark:bg-brand-400/20'
                    : 'bg-gray-100 dark:bg-navy-700/50'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : null}
              className={`text-sm font-medium ${currentStep > 1
                ? 'text-brand-500/90 dark:text-brand-400/90 hover:text-brand-600 dark:hover:text-brand-500'
                : 'text-gray-400 cursor-default'
                }`}
            >
              Previous Step
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {steps.find(step => step.id === currentStep)?.title}
            </span>
          </div>
          <div className="mt-2 w-full h-1 bg-gray-100 dark:bg-navy-700/50 rounded-full">
            <div className="h-full bg-brand-500/20 dark:bg-brand-400/20 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }} />
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isOrderPlaced ? '' : 'lg:grid-cols-12'} gap-8`}>
          {/* Form Area */}
          <div className={`${isOrderPlaced ? 'max-w-3xl mx-auto w-full' : 'lg:col-span-8'} space-y-6`}>
            {renderStepContent()}
          </div>

          {/* Order Summary Area - Hidden when order is placed */}
          {!isOrderPlaced && (
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <OrderSummary
                  cartData={cartSummary}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CheckoutPage.propTypes = {
  cartData: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        cart_id: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        sub_total: PropTypes.number.isRequired,
        img_url: PropTypes.string.isRequired,
        product_id: PropTypes.string.isRequired,
        sku_name: PropTypes.string.isRequired,
        variant_name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        stock: PropTypes.number.isRequired
      })
    ).isRequired,
    summary: PropTypes.shape({
      subtotal: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired
    }).isRequired,
    shipping: PropTypes.shape({
      cost: PropTypes.number,
      method: PropTypes.string,
      estimate: PropTypes.string,
      courier: PropTypes.string,
      package: PropTypes.string
    })
  })
};

const CheckoutWithErrorBoundary = () => (
  <ErrorBoundary>
    <CheckoutPage />
  </ErrorBoundary>
);

export default CheckoutWithErrorBoundary;