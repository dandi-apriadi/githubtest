import { useState, useEffect } from "react";
import Card from "components/card";
import { MapPin, Phone, Mail, User2, Edit2, Save, X, Loader } from "lucide-react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from 'axios';
import PropTypes from 'prop-types';

const General = ({ userData, setUserData }) => {
  const { baseURL } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(userData || {});
  const [formData, setFormData] = useState({
    ...userData,
    district_id: userData?.district_id || '',
    district: userData?.district || '',
    postal_code: userData?.postal_code || ''
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
    submit: false,
    names: false
  });

  // Add new state for location names
  const [locationNames, setLocationNames] = useState({
    provinceName: '',
    cityName: '',
    districtName: ''
  });

  // Update initialData when userData changes
  useEffect(() => {
    if (userData) {
      setInitialData(userData);
      setFormData({
        ...userData,
        district_id: userData.district_id || '',
        district: userData.district || '',
        postal_code: userData.postal_code || ''
      });
    }
  }, [userData]);

  // Fetch provinces on edit mode
  useEffect(() => {
    const fetchProvinces = async () => {
      if (isEditing) {
        setLoading(prev => ({ ...prev, provinces: true }));
        try {
          const response = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
          setLocations(prev => ({
            ...prev,
            provinces: response.data.map(province => ({
              province_id: province.id,
              province: province.name
            }))
          }));
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Failed to load provinces',
            text: 'Could not fetch province data'
          });
        } finally {
          setLoading(prev => ({ ...prev, provinces: false }));
        }
      }
    };

    fetchProvinces();
  }, [isEditing]);

  const fetchCities = async (provinceId) => {
    if (!provinceId) return;

    setLoading(prev => ({ ...prev, cities: true }));
    try {
      const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      setLocations(prev => ({
        ...prev,
        cities: response.data.map(city => ({
          city_id: city.id,
          city_name: city.name
        }))
      }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load cities',
        text: 'Could not fetch city data'
      });
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };

  const fetchDistricts = async (cityId) => {
    if (!cityId) return;

    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`);
      setLocations(prev => ({
        ...prev,
        districts: response.data.map(district => ({
          district_id: district.id,
          district_name: district.name
        }))
      }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load districts',
        text: 'Could not fetch district data'
      });
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // Add function to fetch location names
  const fetchLocationNames = async () => {
    if (!isEditing && formData.province_id) {
      setLoading(prev => ({ ...prev, names: true }));
      try {
        // Convert IDs to string for comparison
        const provinceId = String(formData.province_id);
        const cityId = String(formData.city_id);
        const districtId = String(formData.district_id);

        // Parallel API calls
        const [provinceData, cityData, districtData] = await Promise.all([
          axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json'),
          formData.province_id ? axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`) : Promise.resolve({ data: [] }),
          formData.city_id ? axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`) : Promise.resolve({ data: [] })
        ]);

        // Find location names
        const province = provinceData.data.find(p => String(p.id) === provinceId);
        const city = cityData.data.find(c => String(c.id) === cityId);
        const district = districtData.data.find(d => String(d.id) === districtId);

        setLocationNames({
          provinceName: province?.name || '-',
          cityName: city?.name || '-',
          districtName: district?.name || '-'
        });
      } catch (error) {
        console.error('Error fetching location names:', error);
        setLocationNames({
          provinceName: '-',
          cityName: '-',
          districtName: '-'
        });
      } finally {
        setLoading(prev => ({ ...prev, names: false }));
      }
    }
  };

  // Add useEffect to fetch names when needed
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetchLocationNames();
    }

    return () => {
      mounted = false;
    };
  }, [formData.province_id, formData.city_id, formData.district_id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'province_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        city_id: '',
        city: '',
        district_id: '',
        district: ''
      }));
      if (value) fetchCities(value);
    } else if (name === 'city_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        district_id: '',
        district: ''
      }));
      if (value) fetchDistricts(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));

      const updateData = {
        ...formData,
        province_id: parseInt(formData.province_id) || 0,
        city_id: parseInt(formData.city_id) || 0,
        district_id: parseInt(formData.district_id) || 0
      };

      const response = await baseURL.patch('/api/user/update-profile', updateData);

      if (response.data.response) {
        setFormData(response.data.response);

        if (typeof setUserData === 'function') {
          setUserData(response.data.response);
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data profil berhasil diperbarui',
          timer: 1500
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.msg || 'Terjadi kesalahan pada server'
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Store initial data for cancel operation
    setInitialData({ ...formData });
  };

  // Add cancel handler
  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
    setLocations({
      provinces: [],
      cities: [],
      districts: []
    });
  };

  // Add helper function
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Card extra={"w-full h-full p-3"}>
      {/* Header with Edit/Save Buttons */}
      <div className="mt-2 mb-8 w-full flex justify-between items-center">
        <div>
          <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
            Informasi Umum
          </h4>
          <p className="mt-2 px-2 text-base text-gray-600">
            Data profil dan alamat Anda
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSubmit}
                disabled={loading.submit}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                <Save size={16} />
                Simpan
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                <X size={16} />
                Batal
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
              disabled={loading.provinces || loading.cities}
            >
              {(loading.provinces || loading.cities) ? (
                <>
                  Loading... <Loader className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  Edit <Edit2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 gap-4 px-2">
        {/* Personal Information Section */}
        <div className="flex flex-col rounded-2xl bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <User2 className="h-6 w-6 text-brand-500" />
            <h4 className="text-lg font-semibold text-navy-700 dark:text-white">
              Data Pribadi
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <p className="text-sm text-gray-600">Nama Lengkap</p>
              {isEditing ? (
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none"
                />
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {userData?.fullname || '-'}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none"
                >
                  <option value="">Pilih Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {capitalizeFirstLetter(userData?.gender) || '-'}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-base font-medium text-navy-700 dark:text-white capitalize">
                {userData?.role || '-'}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-base font-medium capitalize ${userData?.status === 'active' ? 'text-green-500' :
                userData?.status === 'inactive' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                {userData?.status || '-'}
              </p>
            </div>

            {/* Verified */}
            <div>
              <p className="text-sm text-gray-600">Verifikasi</p>
              <p className={`text-base font-medium ${userData?.verified ? 'text-green-500' : 'text-red-500'
                }`}>
                {userData?.verified ? 'Terverifikasi' : 'Belum Terverifikasi'}
              </p>
            </div>

            {/* Created At */}
            <div>
              <p className="text-sm text-gray-600">Bergabung Sejak</p>
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {userData?.created_at || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col rounded-2xl bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-6 w-6 text-brand-500" />
            <h4 className="text-lg font-semibold text-navy-700 dark:text-white">
              Kontak
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email - Read Only */}
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {userData?.email || '-'}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm text-gray-600">Nomor Telepon</p>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none"
                />
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {userData?.phone_number || '-'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex flex-col rounded-2xl bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-brand-500" />
            <h4 className="text-lg font-semibold text-navy-700 dark:text-white">
              Informasi Alamat
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province */}
            <div>
              <p className="text-sm text-gray-600">Provinsi</p>
              {isEditing ? (
                <select
                  name="province_id"
                  value={formData.province_id}
                  onChange={handleChange}
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none"
                >
                  <option value="">Pilih Provinsi</option>
                  {locations.provinces.map(province => (
                    <option key={province.province_id} value={province.province_id}>
                      {province.province}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {locationNames.provinceName || '-'}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <p className="text-sm text-gray-600">Kota/Kabupaten</p>
              {isEditing ? (
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none"
                  disabled={!formData.province_id || loading.cities}
                >
                  <option value="">Pilih Kota</option>
                  {locations.cities.map(city => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {locationNames.cityName || '-'}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <p className="text-sm text-gray-600">Kecamatan</p>
              {isEditing ? (
                <select
                  name="district_id"
                  value={formData.district_id}
                  onChange={handleChange}
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none"
                  disabled={!formData.city_id || loading.districts}
                >
                  <option value="">Pilih Kecamatan</option>
                  {locations.districts.map(district => (
                    <option key={district.district_id} value={district.district_id}>
                      {district.district_name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {locationNames.districtName || '-'}
                </p>
              )}
            </div>

            {/* Full Address */}
            <div className="col-span-full">
              <p className="text-sm text-gray-600">Alamat Lengkap</p>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none resize-none"
                />
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {userData?.address || '-'}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <p className="text-sm text-gray-600">Kode Pos</p>
              {isEditing ? (
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  maxLength="5"
                  className="w-full text-base font-medium text-navy-700 dark:text-white bg-transparent border-b border-gray-200 focus:border-brand-500 outline-none"
                />
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {userData?.postal_code || '-'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

General.propTypes = {
  userData: PropTypes.shape({
    user_id: PropTypes.string,
    district_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    district: PropTypes.string,
    postal_code: PropTypes.string,
    province_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    province: PropTypes.string,
    city_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    city: PropTypes.string
  }).isRequired,
  setUserData: PropTypes.func
};

export default General;