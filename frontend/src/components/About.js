import React from 'react';

function About() {
  return (
    <section>
      <div className="about project">
        <h1>About the Project</h1>
        <p>MapMaster was developed as part of the 2024/2025 Team Programming university course at the University of Silesia 🎓</p> 
        <p>I hope you enjoy playing the game and learning about different countries' flags!</p>
      </div>
      <div className="about github">
        <h1>Can I steal your code?</h1>
        <p>Sure! 😄</p> 
        <p>This project is open-source. You can fork it's repo <a href="https://github.com/gabgab1337/MapMaster">here</a>.</p>
      </div>
      <div className="about iso">
        <h1>Why are the names weird sometimes?</h1>
        <p>Because of the <a href="https://pl.wikipedia.org/wiki/ISO_3166">ISO 3166</a>.</p> 
        <p>It's the international standard that in some part covers country names. The way that we may name some countries in day-to-day conversations might be different than what is stated in this standard. We use this standard to avoid confusion.</p>
        <p className="bolder">That's why:</p>
        <p>🇺🇸 = United States</p>
        <p>🇬🇧 = United Kingdom</p>
      </div>
    </section>
  );
}

export default About;