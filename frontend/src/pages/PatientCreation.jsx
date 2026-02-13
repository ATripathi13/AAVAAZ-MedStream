import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PatientCreation() {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        phone: '',
        address: '',
        diagnosis: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${API_URL}/api/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    date_of_birth: formData.dateOfBirth,
                    phone: formData.phone,
                    address: formData.address,
                    diagnosis: formData.diagnosis,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create patient');
            }

            const data = await response.json();
            setResult(data);
            setFormData({
                name: '',
                dateOfBirth: '',
                phone: '',
                address: '',
                diagnosis: '',
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section - Form Title */}
            <div className="w-1/3 flex items-center justify-center p-12">
                <div className="fade-in">
                    <h1 className="text-5xl font-light text-white tracking-wider heading-font mb-4">
                        LET'S TALK
                    </h1>
                    <h2 className="text-5xl font-light text-white/80 tracking-wider heading-font mb-8">
                        ABOUT YOUR
                    </h2>
                    <h3 className="text-5xl font-light text-white/80 tracking-wider heading-font">
                        FUTURE
                    </h3>

                    <div className="mt-12 text-white/70 text-sm">
                        <p className="mb-2">CONTACT US</p>
                        <p className="mb-1">admin@aavaaz.net</p>
                        <p>866.694.6292</p>
                    </div>
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-full max-w-lg fade-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-white/70 text-sm uppercase tracking-wide mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                                placeholder="Please fill in this field"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-white/70 text-sm uppercase tracking-wide mb-2">
                                Date of Birth *
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-white/70 text-sm uppercase tracking-wide mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                                placeholder="Please fill in this field"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-white/70 text-sm uppercase tracking-wide mb-2">
                                Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                                placeholder="Please fill in this field"
                            />
                        </div>

                        {/* Diagnosis */}
                        <div>
                            <label className="block text-white/70 text-sm uppercase tracking-wide mb-2">
                                Diagnosis *
                            </label>
                            <textarea
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors resize-none"
                                placeholder="Tell us a little about your diagnosis"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Create Patient'}
                        </button>
                    </form>

                    {/* Success Message */}
                    {result && (
                        <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded">
                            <p className="text-green-300 font-medium mb-2">Patient Created Successfully!</p>
                            <pre className="text-white/70 text-xs overflow-x-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded">
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
