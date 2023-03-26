import React from 'react';

const Footer = ({year}) => (
  <footer className="bg-light p-3 text-center" data-testid="footer">
    <div className="logo" data-testid="footer-logo" />
    <p data-testid="footer-text">
      Powered by <a href="https://luxuryappliancesupport.com">Luxury Appliance Support ©{year}</a>
    </p>
  </footer>
);

export default Footer;
