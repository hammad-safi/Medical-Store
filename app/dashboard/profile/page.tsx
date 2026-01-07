"use client";
import { useState } from 'react';
import { Camera, Mail, MapPin, Phone, Clock, Award, Users, Package, Edit2, Save, X, Star } from 'lucide-react';

export default function ProfileUI() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    storeName: 'HealthCare Plus Pharmacy',
    tagline: 'Your Trusted Healthcare Partner',
    license: 'LIC-2023-MED-45678',
    owner: 'Dr. Sarah Johnson',
    phone: '+1 (555) 123-4567',
    email: 'contact@healthcareplus.com',
    address: '123 Medical Center Drive, Downtown',
    city: 'San Francisco, CA 94102',
    hours: 'Mon-Sat: 8:00 AM - 10:00 PM | Sun: 9:00 AM - 8:00 PM',
    established: '2015',
    about: 'We are a licensed medical store committed to providing quality healthcare products and professional pharmaceutical services. Our experienced pharmacists are always ready to assist you with medication guidance and health consultations.',
    services: ['Prescription Medicines', 'OTC Medications', 'Health Supplements', 'Medical Equipment', 'Free Consultation', 'Home Delivery'],
    stats: {
      customers: '15K+',
      products: '5000+',
      rating: '4.8'
    }
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="h-40 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button 
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="relative px-8 pb-8">
            {/* Store Logo/Icon */}
            <div className="flex items-end gap-6 -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 border-4 border-white shadow-xl flex items-center justify-center text-white">
                  <Package className="w-16 h-16" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1 pb-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={tempProfile.storeName}
                      onChange={(e) => handleChange('storeName', e.target.value)}
                      className="text-3xl font-bold text-gray-900 w-full border-2 border-blue-300 rounded-lg px-3 py-2 mb-2"
                    />
                    <input
                      type="text"
                      value={tempProfile.tagline}
                      onChange={(e) => handleChange('tagline', e.target.value)}
                      className="text-lg text-gray-600 w-full border-2 border-blue-300 rounded-lg px-3 py-2"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.storeName}</h1>
                    <p className="text-lg text-gray-600 mt-1">{profile.tagline}</p>
                  </>
                )}
              </div>
            </div>

            {/* License Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Licensed Store: {profile.license}</span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-700">{profile.stats.customers}</div>
                <div className="text-sm text-blue-600 mt-1">Happy Customers</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 text-center">
                <Package className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-teal-700">{profile.stats.products}</div>
                <div className="text-sm text-teal-600 mt-1">Products Available</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-700">{profile.stats.rating}</div>
                <div className="text-sm text-green-600 mt-1">Customer Rating</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempProfile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="flex-1 border-2 border-blue-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <div className="text-gray-600">{profile.phone}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="flex-1 border-2 border-blue-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-gray-600">{profile.email}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  {isEditing ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={tempProfile.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full border-2 border-blue-300 rounded-lg px-3 py-2"
                        placeholder="Address"
                      />
                      <input
                        type="text"
                        value={tempProfile.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full border-2 border-blue-300 rounded-lg px-3 py-2"
                        placeholder="City, State ZIP"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">Address</div>
                      <div className="text-gray-600">{profile.address}</div>
                      <div className="text-gray-600">{profile.city}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h3>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.hours}
                      onChange={(e) => handleChange('hours', e.target.value)}
                      className="flex-1 border-2 border-blue-300 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">Working Hours</div>
                      <div className="text-gray-600">{profile.hours}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Owner/Pharmacist</div>
                    <div className="text-gray-600">{profile.owner}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Established</div>
                    <div className="text-gray-600">{profile.established}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About Us</h3>
              {isEditing ? (
                <textarea
                  value={tempProfile.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                  className="w-full text-gray-700 border-2 border-blue-300 rounded-lg px-4 py-3 h-32"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.about}</p>
              )}
            </div>

            {/* Services Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg px-4 py-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need Assistance?</h3>
              <p className="text-blue-100">Our pharmacists are here to help you 24/7</p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contact Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );


}

