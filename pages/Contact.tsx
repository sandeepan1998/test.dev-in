
import React from 'react';

const Contact: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-6">Contact & <br/> <span style={{ color: primaryColor }}>Support</span></h1>
          <p className="text-xl text-gray-500 mb-10">
            Have a question about a product or need technical assistance? Our team is here to help you solve any coding challenges.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">📧</div>
              <div>
                <h4 className="font-bold">Email Support</h4>
                <p className="text-gray-500">support@devbady.in</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">💬</div>
              <div>
                <h4 className="font-bold">Live Chat</h4>
                <p className="text-gray-500">Available Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Subject</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500">
                <option>Technical Support</option>
                <option>Sales Inquiry</option>
                <option>Report a Bug</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Describe your issue..."></textarea>
            </div>
            <button 
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl"
              style={{ backgroundColor: primaryColor }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
