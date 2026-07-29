import Footer from "@/shared/components/Footer.js";

function Layout({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
