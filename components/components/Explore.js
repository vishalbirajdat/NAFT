import React from 'react';
import Card from './Card';
import Router from 'next/router';
import { useSelector } from 'react-redux';

const Explore = ({ name, explore, ownnft }) => {
  const { address } = useSelector((state) => state.auth);
  return (
    <div>
      {explore &&
        <section id="explore" className="explore-product">
          <div className="container">

            <div className="section-header-wrapper">

              <h2 className="h2 section-title">{name}</h2>
              {ownnft ?
                <button className="btn btn-secondary">{explore.length} : nfts</button> :
                <button onClick={() => { Router.push("/createnft"); }} className="btn btn-secondary">Create now</button>
              }

            </div>

            <ul className="product-list">

              {explore.map((data) => {
                console.log("data in explore");
                // const contract = await contractLinkProvider();
                // const userName = await contract.username()[data.tokenId];

                console.log(data);
                return (
                  <div>
                    <Card props={{
                      "tokenId": data.tokenId,
                      "title": data.title,
                      "nftURL": data.nftURL,
                      "owner": data.owner,
                      "price": data.price,
                      "currentlyListed": data.currentlyListed,
                      "ownnft": ownnft
                    }} />
                  </div>

                );
              })
              }



            </ul>

          </div>
        </section>
      }
    </div>
  );
};



export default Explore;