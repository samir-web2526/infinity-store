import Categories from "@/components/sections/Categories";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import FlashSale from "@/components/sections/FlashSale";
import Hero from "@/components/sections/Hero";
import NewArrivals from "@/components/sections/NewArrivals";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import CustomerReviews from "@/components/sections/CustomerReviews";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="h-full overflow-y-auto">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FlashSale />
      <NewArrivals />
      <WhyChooseUs />
      <CustomerReviews />
      <FAQ />
      <Footer />
    </div>
  );
}
