import Header from "@/components/Header";
import "./globals.css";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/Footer";
const inter = Poppins({ subsets: ["latin"], weight: ["500"] });

export const metadata = {
  title: "Mawadda Muslim Wedding Site",
  description: "IT Craft Hub offers expert web development, Next.js, WordPress, Shopify, and graphics design services. Get fast, SEO-optimized, and scalable solutions to grow your business. Contact us today to get started!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader
          color="#FF552F"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FF552F,0 0 5px #FF552F"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
