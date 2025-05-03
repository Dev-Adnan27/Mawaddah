import Link from "next/link";

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    const data = await res.json();
    return data.blogs || [];
  } catch (error) {
    console.error('Error loading blogs:', error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Stay informed with our latest articles, insights, and updates.
          </p>
        </div>
      </section>
      
      {/* Blog List */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium text-gray-600">No blog posts yet</h2>
            <p className="mt-2 text-gray-500">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.filter(blog => blog.isPublished).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BlogCard({ blog }) {
  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <Link href={`/blogs/${blog.slug}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{blog.author}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{blog.summary}</p>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-blue-600 font-medium flex items-center">
            Read more 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
} 