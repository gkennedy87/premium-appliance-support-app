import React from 'react';
import logo from '../public/images/logo.png'
import Image from 'next/image'

const Footer = ({year}) => (
  <footer className="bg-light p-3 text-center" data-testid="footer">
    <div data-testid="footer-logo">
    
    </div>
    <p data-testid="footer-text">
      Powered by <a href="https://luxuryappliancesupport.com">Luxury Appliance Support ©{year}</a>
    </p>
  </footer>
);

export default Footer;
