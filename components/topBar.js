import React from "react";
import currencyFormatter from "currency-formatter";
import { Container, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinTongue } from "@fortawesome/free-solid-svg-icons";

function topBar({ totalMarketCap, totalCrypto, altCoinMarketCap, value24h }) {
  return (
    <div className="header-top">
      <div className="top-bar">
        <span>
          Cryptos: <a href="#">{totalCrypto}</a>
        </span>
        <span>
          Market Cap:{" "}
          <a href="#">
            {currencyFormatter.format(totalMarketCap, { code: "USD" })}
          </a>
        </span>
        <span>
          AltCoin Market Cap:{" "}
          <a href="#">
            {currencyFormatter.format(altCoinMarketCap, { code: "USD" })}
          </a>
        </span>
        <span>
          24h Vol:{" "}
          <a href="#">{currencyFormatter.format(value24h, { code: "USD" })}</a>
        </span>
      </div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#">Crypto Market Analysis</Navbar.Brand>
          <div className="my-2 my-lg-0">𐰏𐰇𐰲</div>
        </Container>
      </Navbar>
    </div>
  );
}

export default topBar;
