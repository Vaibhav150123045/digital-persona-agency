
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300">
              Last updated: May 2025
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="prose prose-lg max-w-none text-gray-300">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using SPAIS Agency's services, you accept and agree to be bound by 
                these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="mb-6">
                SPAIS Agency provides AI-powered talent representation services, including but not 
                limited to casting matching, contract negotiation assistance, career consulting, 
                and industry networking opportunities.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <p className="mb-4">As a user of our services, you agree to:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use our services only for lawful purposes</li>
                <li>Respect intellectual property rights</li>
                <li>Not interfere with or disrupt our services</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Payment</h2>
              <p className="mb-6">
                Paid services are billed on a subscription basis. You agree to pay all applicable 
                fees as described in your chosen plan. Subscriptions automatically renew unless 
                cancelled before the renewal date.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">5. Representation Agreement</h2>
              <p className="mb-6">
                By using our representation services, you acknowledge that SPAIS Agency will act 
                as your representative in seeking opportunities and negotiating contracts on your 
                behalf, subject to the terms of your specific plan.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p className="mb-6">
                You retain ownership of your personal content and materials. By using our services, 
                you grant us a limited license to use your content for the purpose of providing 
                representation services.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p className="mb-6">
                SPAIS Agency provides services on an "as is" basis. We make no guarantees regarding 
                specific outcomes or opportunities. Our liability is limited to the amount paid for 
                our services.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
              <p className="mb-6">
                Either party may terminate the service agreement with appropriate notice. Upon 
                termination, your access to paid features will cease, but you retain ownership 
                of your content.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">9. Privacy</h2>
              <p className="mb-6">
                Your privacy is important to us. Please review our Privacy Policy to understand 
                how we collect, use, and protect your information.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
              <p className="mb-6">
                We reserve the right to modify these terms at any time. Material changes will be 
                communicated to users with appropriate notice.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
              <p className="mb-6">
                These terms are governed by the laws of California, United States. Any disputes 
                will be resolved through binding arbitration.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <p><strong>SPAIS Agency Legal Department</strong></p>
                <p>Email: legal@spais.agency</p>
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

export default TermsOfService;
