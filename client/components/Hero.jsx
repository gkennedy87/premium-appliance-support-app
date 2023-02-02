import React from 'react';

import Logo from './Logo';
const Hero = ({name}) => (

  <div className="hero mt-5 mb-2 text-center" data-testid="hero">
    {name ?
      <>
      <h1 className="mb-2" data-testid="hero-title">
        Welcome {name} to the Premium Appliance Support: Service App
      </h1>
      <p className="lead" data-testid="hero-lead">
          Please choose one of the options below      
      </p>
      </>
      :
      <>
        <h1 className="mb-4" data-testid="hero-title">
          Welcome to the Premium Appliance Support: Service App
        </h1>
        <p className="lead" data-testid="hero-lead">
          Please log in with the provided credentials. If you don't have any credentials, please contact your manager or Premium Appliance Support representative.
        </p>
     </>
    }
    
    
  </div>
);

export default Hero;
