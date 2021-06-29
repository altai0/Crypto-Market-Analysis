import React, { useState } from "react";
import LoadingBar from "react-top-loading-bar";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import { Container, Navbar, Row, Col, Table, Button } from "react-bootstrap";
import currencyFormatter from "currency-formatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faReddit,
  faGithub,
  faWeebly,
  faSquarespace,
} from "@fortawesome/free-brands-svg-icons";
import GaugeChart from "react-gauge-chart";

// ANA BÖLÜM
function CoinAnalysis({
  posts,
  currentPricePost,
  trendPost,
  orderBookPost,
  bitcoinPrice,
  lsPost,
}) {
  const [progress, setProgress] = useState(0);
  const result = Object.keys(posts.data).map((key) => [
    Number(key),
    posts.data[key],
  ]);
  const priceResult = Object.keys(currentPricePost.data).map((key) => [
    Number(key),
    currentPricePost.data[key],
  ]);
  const currentResult = result[0][1];
  const currentPriceResult = priceResult[0][1];
  const trendScore = trendPost.data[0].trend_score / 100;
  const socialMedia = () => {
    const website = currentResult.urls.website[0];
    const twitter = currentResult.urls.twitter[0];
    const reddit = currentResult.urls.reddit[0];
    const github = currentResult.urls.source_code[0];
    let socialMedias = [];

    if (website == undefined) {
      socialMedias.push(reddit);
    } else if (twitter == undefined) {
    } else if (reddit == undefined) {
    } else if (github == undefined) {
    }
    console.log(reddit);
  };
  let totalAsks = 0;
  let totalBids = 0;
  const satisDirencNoktasi = [];
  const alisDirencNoktasi = [];
  //asks satış bids alış
  let satisbuyukKacTane = 0;
  let alisbuyukKacTane = 0;
  for (var i = 0; i < orderBookPost["bids"].length; i++) {
    //asks
    if (orderBookPost["asks"][i][1] == undefined) {
      console.log("neden undefined ?");
      break;
    }
    totalAsks +=
      orderBookPost["asks"][i][1] * currentPriceResult.quote.USD.price;
    if (
      orderBookPost["asks"][i][1] * currentPriceResult.quote.USD.price >
      bitcoinPrice * 5
    ) {
      satisDirencNoktasi.push([
        orderBookPost["asks"][i][0],
        orderBookPost["asks"][i][1],
      ]);
      satisbuyukKacTane += 1;
    }
    //bids
    totalBids +=
      orderBookPost["bids"][i][1] * currentPriceResult.quote.USD.price;
    if (
      orderBookPost["bids"][i][1] * parseFloat(orderBookPost["bids"][i][0]) >
      bitcoinPrice * 5
    ) {
      alisDirencNoktasi.push([
        orderBookPost["bids"][i][0],
        orderBookPost["bids"][i][1],
      ]);
      alisbuyukKacTane += 1;
    }
  }

  const listsatisDirenc = satisDirencNoktasi.map((coin) => {
    return (
      <tr key={`${coin[0]}`}>
        <td>{coin[0]}</td>
        <td>{coin[1]}</td>
        <td>
          {currencyFormatter.format(coin[1] * parseFloat(coin[0]), {
            code: "USD",
          })}
        </td>
      </tr>
    );
  });
  const listalisDirenc = alisDirencNoktasi.map((coin) => {
    return (
      <tr key={`${coin[0]}`}>
        <td>{coin[0]}</td>
        <td>{coin[1]}</td>
        <td>
          {currencyFormatter.format(coin[1] * parseFloat(coin[0]), {
            code: "USD",
          })}
        </td>
      </tr>
    );
  });
  return (
    <div className="coin-analysis">
      <LoadingBar
        color="#ff0018"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Head>
        <title>{currentResult.name}</title>
      </Head>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand onClick={() => setProgress(progress + 50)} href="../">
            Go Home
          </Navbar.Brand>
          <div className="my-2 my-lg-0 social-media">
            <a href="https://twitter.com/ACryptohunt" target="__blank">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </Container>
      </Navbar>
      <div className="top-detail">
        <Container>
          <Row>
            <Col md="6">
              <img className="analysis-logo" src={currentResult.logo} />

              <p className="analysis-name">
                {currentResult.name}{" "}
                <span className="badge rounded-pill bg-danger">
                  {currentResult.category}
                </span>
                <span className="badge rounded-pill bg-danger">
                  %{" "}
                  {currencyFormatter.format(
                    currentPriceResult.quote.USD.percent_change_24h,
                    {
                      code: "USD",
                      symbol: " ",
                    }
                  )}
                </span>
              </p>
              <small>{currentResult.description}</small>
            </Col>
            <Col md="6">
              <p className="analysis-price">
                <div className="text-id"> Price</div>$
                {currentPriceResult.quote.USD.price.toFixed(5)}
                <div className="text-id">Market Trend</div>
                <GaugeChart
                  id="gauge-chart2"
                  nrOfLevels={20}
                  percent={trendScore}
                  arcWidth={0.2}
                  colors={["#EA4228", "#F5CD19", "#5BE12C"]}
                />
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="body-detail">
        <Container>
          <h4>Basic Data</h4>
          <Row className="body-row">
            <Col md="6">
              <div className="supply-item">
                <div className="supply-item-head">Total Supply</div>
                <div className="supply-item-body">
                  {currencyFormatter.format(currentPriceResult.total_supply, {
                    code: "USD",
                    symbol: " ",
                  })}
                </div>
              </div>
              <div className="supply-item">
                <div className="supply-item-head">Circulating Supply</div>
                <div className="supply-item-body">
                  {currencyFormatter.format(
                    currentPriceResult.circulating_supply,
                    { code: "USD", symbol: " " }
                  )}
                </div>
              </div>
              <div className="supply-item">
                <div className="supply-item-head">Max Supply</div>
                <div className="supply-item-body">
                  {currencyFormatter.format(currentPriceResult.max_supply, {
                    code: "USD",
                    symbol: " ",
                  })}
                </div>
              </div>
            </Col>
            <Col md="6">
              <div className="supply-item">
                <div className="supply-item-head">24 H Total Volume</div>
                <div className="supply-item-body">
                  {currencyFormatter.format(
                    currentPriceResult.quote.USD.volume_24h,
                    {
                      code: "USD",
                    }
                  )}
                </div>
              </div>
              <div className="supply-item">
                <div className="supply-item-head">Market Cap</div>
                <div className="supply-item-body">
                  {currencyFormatter.format(
                    currentPriceResult.quote.USD.market_cap,
                    {
                      code: "USD",
                    }
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <h4>indicator signals</h4>
          <Row className="body-row">
            <Col md="4">
              <h4>support-resistance</h4>
              <Button>Testing Button</Button>
            </Col>
            <Col md="4">
              <h4>lorem ipsum</h4>
            </Col>
            <Col md="4">
              <h4>lorem ipsum</h4>
            </Col>
          </Row>
          <Row className="body-row">
            <Col md="6" id="tableSize">
              <h4>current high buy orders</h4>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Total :</th>
                    <th>
                      <span className="th-item">{alisbuyukKacTane}</span>
                      there is a large purchase order.
                    </th>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>USD</th>
                  </tr>
                </thead>
                <tbody>{listalisDirenc}</tbody>
              </Table>
            </Col>
            <Col md="6" id="tableSize">
              <h4>current high sell orders</h4>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Total :</th>
                    <th>
                      <span className="th-item">{satisbuyukKacTane}</span> There
                      is a large sales order.
                    </th>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>USD</th>
                  </tr>
                </thead>
                <tbody>{listsatisDirenc}</tbody>
              </Table>
            </Col>
          </Row>

          <h4>Place-3</h4>
          <Row className="body-row">
            <Col md="12"></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const cryptoCurrencyRes = await fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?sort=cmc_rank&limit=500",
    {
      method: "GET",
      headers: { "X-CMC_PRO_API_KEY": api_key },
    }
  );
  const cryptoCurrencyPost = await cryptoCurrencyRes.json();

  const paths = cryptoCurrencyPost.data.map((character) => {
    return { params: { id: `${character.symbol}` } };
  });
  return {
    paths,
    fallback: false,
  };
}

const api_key = "YOUR API KEY";
export async function getStaticProps({ params }) {
  //coin info
  const res = await fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=" +
      params.id,
    {
      method: "GET",
      headers: { "X-CMC_PRO_API_KEY": api_key },
    }
  );
  const posts = await res.json();
  //coin detail info
  const urlOne =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" +
    params.id;
  const currentPriceRes = await fetch(urlOne, {
    method: "GET",
    headers: { "X-CMC_PRO_API_KEY": api_key },
  });
  const currentPricePost = await currentPriceRes.json();
  //bitcoinPrice
  const urltwo =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC";
  const currentBitcoinPriceRes = await fetch(urltwo, {
    method: "GET",
    headers: { "X-CMC_PRO_API_KEY": api_key },
  });
  const currentBitcoinPricePost = await currentBitcoinPriceRes.json();
  //cryptometer trend indicator
  const trendRes = await fetch(
    "https://api.cryptometer.io/trend-indicator-v3/?api_key=YOUR API KEY"
  );
  const trendPost = await trendRes.json();
  //order book analysis
  const orderBookRes = await fetch(
    `https://api.binance.com/api/v3/depth?symbol=${params.id}USDT&limit=5000`
  );
  const orderBookPost = await orderBookRes.json();

  const bitcoinPrice = currentBitcoinPricePost.data.BTC.quote.USD.price;

  return {
    props: {
      posts,
      currentPricePost,
      trendPost,
      orderBookPost,
      bitcoinPrice,
    },
  };
}
export default CoinAnalysis;
