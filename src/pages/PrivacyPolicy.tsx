
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, ChevronLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
            </Link>
            
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
            
            <p className="text-gray-500 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <Separator className="mb-8" />
            
            <div className="prose prose-gray max-w-none">
              <h2>Introduction</h2>
              <p>
                At Lumina Search, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our search engine.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We may collect the following types of information:
              </p>
              <ul>
                <li><strong>Search Queries:</strong> The search terms you enter into our search engine.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our service, including access times, pages viewed, and the routes by which you access our service.</li>
                <li><strong>Device Information:</strong> Data about the device you use to access our service, including hardware model, operating system, and browser type.</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our search services</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Protect against unauthorized access and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <h2>Security Measures</h2>
              <p>
                We implement strong security measures to protect against unauthorized access, alteration, disclosure, or destruction of your information, including:
              </p>
              <ul>
                <li>Firewall protection and content filtering</li>
                <li>Automated security lockdown for suspicious activities</li>
                <li>Regular security audits and system updates</li>
              </ul>
              
              <h2>Data Retention</h2>
              <p>
                We retain search history and other data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
              
              <h2>Your Rights</h2>
              <p>
                Depending on your location, you may have rights regarding your personal data, including:
              </p>
              <ul>
                <li>The right to access information we have about you</li>
                <li>The right to request correction or deletion of your data</li>
                <li>The right to object to or restrict certain processing of your data</li>
              </ul>
              
              <h2>Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@luminasearch.com<br />
                Address: 123 Tech Avenue, Suite 500, Innovation City, 94103
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
