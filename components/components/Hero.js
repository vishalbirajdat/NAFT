import React, { useEffect } from 'react'
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

const Hero = () => {
    const dispatch = useDispatch();



  return (
    <div>
          <section className="hero">
              <div className="container">

                  <div className="hero-content">

                      <h1 className="h1 hero-title">Discover digital art sell your specific <span>NFT</span></h1>

                      <p className="hero-text">
                          Partner with one of the world’s largest retailers to showcase your brand and products.
                      </p>

                      <div className="btn-group">
                              <button onClick={() => { Router.push("/#explore") }} className="btn btn-primary">Explore more</button>
                          <button onClick={() => { Router.push("/createnft") }} className="btn btn-secondary">Create now</button>
                          
                      </div>

                  </div>

                  <figure className="hero-banner">
                      <img src="/images/hero-banner.jpg" alt="nft art" />
                  </figure>

              </div>
          </section>
    </div>
  )
}

export default Hero