
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Download } from "lucide-react";

const Press = () => {
  const pressReleases = [
    {
      date: "December 15, 2024",
      title: "SPAIS Agency Raises $10M Series A to Revolutionize Talent Representation",
      excerpt: "Leading AI-powered talent agency secures funding to expand services across entertainment industry.",
      link: "#"
    },
    {
      date: "November 20, 2024",
      title: "SPAIS Partners with Major Studios for AI-Driven Casting Solutions",
      excerpt: "New partnerships bring cutting-edge technology to Hollywood's casting process.",
      link: "#"
    },
    {
      date: "October 5, 2024",
      title: "The Future of Talent Representation: SPAIS CEO Speaks at TechCrunch Disrupt",
      excerpt: "Industry insights on how AI is transforming the entertainment business.",
      link: "#"
    }
  ];

  const mediaAssets = [
    { name: "SPAIS Logo Package", type: "ZIP", size: "2.4 MB" },
    { name: "Executive Headshots", type: "ZIP", size: "8.1 MB" },
    { name: "Company Fact Sheet", type: "PDF", size: "1.2 MB" },
    { name: "Product Screenshots", type: "ZIP", size: "15.3 MB" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Stay updated with SPAIS Agency's latest news, announcements, and media resources.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-8">Latest News</h2>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 text-blue-300 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{release.title}</h3>
                    <p className="text-gray-300 mb-4">{release.excerpt}</p>
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                      Read More
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Media Kit</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <p className="text-gray-300 mb-6">
                  Download our media assets, logos, and company information for editorial use.
                </p>
                <div className="space-y-4">
                  {mediaAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{asset.name}</p>
                        <p className="text-sm text-gray-400">{asset.type} • {asset.size}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)]">
                  Download All Assets
                </Button>
              </div>

              <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Media Contact</h3>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Sarah Johnson</strong></p>
                  <p>Head of Communications</p>
                  <p>press@spais.agency</p>
                  <p>+44 20 7123 4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Press;
