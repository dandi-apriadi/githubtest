import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiMenu, FiHome } from 'react-icons/fi';
import { useSelector, useDispatch } from "react-redux";
import { getMe, logoutUser, reset } from "../../store/slices/authSlice";
import "./style.css";
import logo from "../../assets/img/homepage/logo.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = (e) => {
    e?.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getMe()).unwrap();
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    document.title = user?.name || "";
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(reset());
      setIsProfileOpen(false);
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('.menu-button')) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed w-full z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-auto rounded-full mr-3"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 text-transparent bg-clip-text">
                    AKREDITASI
                  </span>
                  <span className="text-xs tracking-wide uppercase text-gray-600">
                    Teknik Komputer
                  </span>
                </div>
              </Link>
            </div>

            {/* Right side items - Only Login Button */}
            <div className="flex items-center">
              <Link to="/auth/sign-in"
                className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg">
                Masuk
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 ml-3 rounded-md focus:outline-none text-gray-700"
              >
                {isMobileMenuOpen ?
                  <FiX className="w-6 h-6" /> :
                  <FiMenu className="w-6 h-6" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Login Only */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 z-30 transform transition-transform ease-in-out duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="h-screen bg-white pt-20 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2 pt-2 mt-4">
              <Link
                to="/auth/sign-in"
                onClick={handleMobileMenuClose}
                className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg text-center"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified bottom mobile navigation - Login Only */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200">
        <div className="grid grid-cols-1 h-16">
          <Link
            to="/auth/sign-in"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <FiHome className="w-5 h-5" />
            <span className="text-xs mt-1">Login</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;