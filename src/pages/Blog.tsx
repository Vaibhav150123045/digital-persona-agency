
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "The Future of AI in Entertainment: What Artists Need to Know",
      excerpt: "Exploring how artificial intelligence is reshaping the entertainment industry and what it means for today's artists.",
      author: "Alex Chen",
      date: "December 10, 2024",
      category: "Industry Insights",
      readTime: "5 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Building Your Personal Brand as an Actor in 2024",
      excerpt: "Essential strategies for actors to build a strong personal brand that stands out in today's competitive market.",
      author: "Maria Rodriguez",
      date: "December 5, 2024",
      category: "Career Tips",
      readTime: "7 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "How SPAIS AI Matches Talent with Perfect Opportunities",
      excerpt: "An inside look at our proprietary AI matching algorithm and how it's revolutionizing casting decisions.",
      author: "David Thompson",
      date: "November 28, 2024",
      category: "Technology",
      readTime: "6 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Contract Negotiations: What Every Artist Should Know",
      excerpt: "Understanding the key elements of entertainment contracts and how to protect your interests.",
      author: "Jennifer Kim",
      date: "November 20, 2024",
      category: "Legal",
      readTime: "8 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "The Rise of Digital Content Creation in Entertainment",
      excerpt: "How streaming platforms and social media are creating new opportunities for content creators.",
      author: "Michael Brown",
      date: "November 15, 2024",
      category: "Industry Trends",
      readTime: "5 min read",
      image: "/api/placeholder/400/250"
    }
  ];

  const categories = ["All", "Industry Insights", "Career Tips", "Technology", "Legal", "Industry Trends"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              SPAIS Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Insights, tips, and industry knowledge to help you navigate your entertainment career.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 
                  ? "bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)]"
                  : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                }
              >
                <Tag className="h-4 w-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors group">
                <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-blue-300 mb-3">
                    <span className="px-2 py-1 bg-blue-500/20 rounded-full">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                      <Calendar className="h-4 w-4 ml-2" />
                      <span>{post.date}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20">
              Load More Posts
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
