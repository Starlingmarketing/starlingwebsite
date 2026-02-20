import { useState } from 'react';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    location: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry. We will be in touch shortly.');
    setFormData({ name: '', email: '', date: '', location: '', message: '' });
  };

  return (
    <div className="animate-fade-in opacity-0 min-h-screen px-6 md:px-12 max-w-7xl mx-auto py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        {/* Info Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-8">
            Inquire
          </h1>
          <p className="text-slate-500 font-light leading-relaxed mb-12 max-w-md">
            We know how exciting it is to start planning your shoot, so we make it a priority to get back to you as quickly as possible. From our very first chat to the moment you receive your final gallery, we are completely dedicated to giving you an exceptional experience and capturing photos you'll treasure forever. Let's create something beautiful together!
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">Email</h3>
              <p className="text-slate-900 font-light">starlingphotostudios@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-slate-50/50 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-slate-300 py-3 text-slate-900 font-light placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-slate-300 py-3 text-slate-900 font-light placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="date" className="text-xs uppercase tracking-widest text-slate-500">
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-slate-300 py-3 text-slate-900 font-light placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-xs uppercase tracking-widest text-slate-500">
                  Location / Venue
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-slate-300 py-3 text-slate-900 font-light placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  placeholder="Lake Como, Italy"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-slate-500">
                Tell us about your event
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-transparent border-b border-slate-300 py-3 text-slate-900 font-light placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors resize-none"
                placeholder="Share your vision, aesthetic, and what drew you to our work..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-8 px-12 py-4 bg-slate-900 text-white text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors w-full md:w-auto"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
