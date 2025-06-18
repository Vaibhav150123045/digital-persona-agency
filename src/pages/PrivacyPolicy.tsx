
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="prose prose-lg max-w-none text-gray-300">
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-6">
                We collect information you provide directly to us, such as when you create an account, 
                update your profile, or communicate with us. This may include your name, email address, 
                phone number, professional information, and other details relevant to talent representation.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Provide and improve our talent representation services</li>
                <li>Match you with relevant opportunities using our AI technology</li>
                <li>Communicate with you about your account and our services</li>
                <li>Process payments and manage billing</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing and Disclosure</h2>
              <p className="mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share your information 
                with trusted partners who help us operate our services, conduct business, or serve you.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="mb-6">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of certain communications</li>
                <li>Request data portability</li>
                <li>Object to processing of your data</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
              <p className="mb-6">
                We use cookies and similar tracking technologies to enhance your experience on our 
                platform. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to This Policy</h2>
              <p className="mb-6">
                We may update this privacy policy from time to time. We will notify you of any 
                material changes by posting the new policy on this page and updating the 
                "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <p><strong>SPAIS Agency</strong></p>
                <p>Email: privacy@spais.agency</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 1234 Main Street, Los Angeles, CA 90028</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
