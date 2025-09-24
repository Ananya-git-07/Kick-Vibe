const Footer = () => {
  return (
    <footer className="border-(--border-color) border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-(--text-color)/60">
          © {new Date().getFullYear()} KickVibe. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-sm transition-colors hover:text-(--brand-color)">Terms of Service</a>
          <a href="#" className="text-sm transition-colors hover:text-(--brand-color)">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;