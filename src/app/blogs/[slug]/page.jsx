import Link from "next/link";
import { notFound } from "next/navigation";

async function getBlog(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.blog;
  } catch (error) {
    console.error(`Error loading blog post with slug ${slug}:`, error);
    return null;
  }
}

export default async function BlogPage({ params }) {
  const { slug } = params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    notFound();
  }
  
  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Header */}
      <div 
        className="w-full h-96 bg-center bg-cover flex items-end relative"
        style={{ backgroundImage: `url('${blog.coverImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto w-full px-4 pb-12 text-white">
          <Link href="/blogs" className="inline-flex items-center mb-6 text-sm text-white/80 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center text-sm">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>By {blog.author}</span>
          </div>
        </div>
      </div>
      
      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Blog Summary */}
          <div className="mb-8 text-lg text-gray-700 font-medium border-l-4 border-blue-600 pl-4 py-2 bg-blue-50">
            {blog.summary}
          </div>
          
          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-gray-600 text-sm uppercase font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      
      {/* Back to Blogs Link */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Link 
          href="/blogs" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Blogs
        </Link>
      </div>
    </div>
  );
}

// Add this to generate static pages at build time for better performance
export async function generateMetadata({ params }) {
  const { slug } = params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found'
    };
  }
  
  return {
    title: blog.title,
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      images: [{ url: blog.coverImage }]
    }
  };
} 