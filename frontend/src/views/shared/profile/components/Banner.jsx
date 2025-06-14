import React, { useState, useEffect } from "react";
import Card from "components/card";
import Nft3 from "assets/img/nfts/Nft4.png";
import defaultAvatar from "assets/img/nfts/Nft4.png";
import { Upload, X, Calendar, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import "./swall.css";
import Swal from "sweetalert2";

const Banner = ({ userData }) => {
  const { baseURL } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(userData?.profile_picture);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    setCurrentImageUrl(userData?.profile_picture);
    console.log(currentImageUrl)
  }, []);

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Please Select Image to upload",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'small-alert' }
        });
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_id', userData.user_id);
      const response = await baseURL.patch('/api/user/update-profile-image',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (response.status === 200) {
        setCurrentImageUrl(response.data.profile_picture);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Profile image updated successfully",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'small-alert' }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.response?.data?.msg || "Failed to update profile image",
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'small-alert' }
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card extra="relative flex flex-col w-full h-full bg-cover">
        {/* Banner Section */}
        <div className="relative h-[400px] w-full rounded-t-2xl overflow-hidden">
          {/* Background with Blur */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
            style={{
              backgroundImage: `url(${Nft3})`,
              filter: 'blur(2px)',
              transform: 'scale(1.1)'
            }}
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/80 via-purple-500/70 to-brand-400/80 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Centered Profile Image Container */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <div className="relative group w-80 h-80">
              {/* Profile Image with Click Handler */}
              <div
                onClick={toggleModal}
                className="w-full h-full rounded-full border-[4px] border-white dark:border-navy-700 shadow-2xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover"
                  src={currentImageUrl || defaultAvatar}
                  alt={userData?.fullname || 'Profile Picture'}
                  onError={(e) => { e.target.src = defaultAvatar }}
                  crossOrigin="anonymous"
                />
              </div>

              {/* Upload Button */}
              <label className="absolute top-3 right-3 cursor-pointer transform scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="rounded-full bg-white/90 dark:bg-navy-700/90 p-3 shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-navy-600 transition-all duration-300">
                  <Upload className="h-6 w-6 text-brand-500 dark:text-white" />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-4 px-8 pb-6 text-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            {userData?.fullname || 'User Name'}
          </h4>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            {userData?.role || 'Role'}
          </p>

          {/* Date Information */}
          <div className="mt-6 px-4 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-500" />
                <div className="text-sm">
                  <span className="block text-gray-600 dark:text-gray-400">Joined</span>
                  <span className="font-medium text-navy-700 dark:text-white">
                    {formatDate(userData?.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <div className="text-sm">
                  <span className="block text-gray-600 dark:text-gray-400">Updated</span>
                  <span className="font-medium text-navy-700 dark:text-white">
                    {formatDate(userData?.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleModal}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-navy-800 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Content */}
            <div className="p-1">
              <img
                src={currentImageUrl || defaultAvatar}
                alt={userData?.fullname || 'Profile Picture'}
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => { e.target.src = defaultAvatar }}
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;