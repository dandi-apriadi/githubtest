import React, { useState } from "react";
import Card from "components/card";
import { Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Project = () => {
  const { baseURL } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleTogglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'small-alert' }
      });
      return;
    }

    try {
      const response = await baseURL.patch('/api/user/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Password updated successfully',
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'small-alert' }
        });
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: error.response?.data?.msg || 'Failed to update password',
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'small-alert' }
      });
    }
  };

  return (
    <Card extra={"w-full p-4 h-full"}>
      <div className="mb-8 w-full">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Change Password
        </h4>
        <p className="mt-2 text-base text-gray-600">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Old Password */}
        <div className="relative">
          <label className="text-sm text-navy-700 dark:text-white">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => handleTogglePassword('old')}
              className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-600"
            >
              {showPassword.old ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="text-sm text-navy-700 dark:text-white">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => handleTogglePassword('new')}
              className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-600"
            >
              {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="text-sm text-navy-700 dark:text-white">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => handleTogglePassword('confirm')}
              className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-600"
            >
              {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="linear mt-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Change Password
        </button>
      </form>
    </Card>
  );
};

export default Project;
