import React, { useState } from "react";
import Head from "next/head";
import { Container, Row, Col, Button, Modal, Table } from "react-bootstrap";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import TopBar from "../components/topBar";
import GaugeChart from "react-gauge-chart";
import LoadingBar from "react-top-loading-bar";

function index({ posts, cryptoCurrencyPost, feerIndexPost }) {
  const [progress, setProgress] = useState(0);

  const btc_ddominance = posts.data.btc_dominance / 100;
  const feer_index = feerIndexPost.data[0].value / 100;

  const currencyList = cryptoCurrencyPost.data.map((coin) => {
    return (
      <tr>
        <td>
          <img
            src={`https://s2.coinmarketcap.com/static/img/coins/32x32/${coin.id}.png`}
          ></img>{" "}
          {coin.name} <span>( {coin.symbol} )</span>{" "}
        </td>
        <Link href="/analiz/[id]" as={`/analiz/${coin.symbol}`}>
          <td>
            <button
              onClick={() => setProgress(progress + 50)}
              className="btn btn-primary"
            >
              Detail
            </button>
          </td>
        </Link>
      </tr>
    );
    //console.log(coin.id);
  });

  return (
    <div className="App">
      <LoadingBar
        color="#ff0018"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Head>
        <title>Crypto Market Analysis</title>
      </Head>
      <TopBar
        totalMarketCap={posts.data.quote.USD.total_market_cap}
        totalCrypto={posts.data.total_cryptocurrencies}
        altCoinMarketCap={posts.data.quote.USD.altcoin_market_cap}
        value24h={posts.data.quote.USD.total_volume_24h}
      />
      <Container className="mt-3 p-4">
        <Row>
          <Col>
            <h4 className="text-center">
              Greed&Fear Index - {feerIndexPost.data[0].value_classification}
            </h4>
            <GaugeChart
              id="gauge-chart6"
              nrOfLevels={15}
              percent={feer_index}
              needleColor="#345243"
            />
          </Col>
          <Col>
            <h4 className="text-center">Bitcoin Dominance</h4>
            <GaugeChart
              id="gauge-chart6"
              nrOfLevels={15}
              percent={btc_ddominance}
              needleColor="#345243"
            />
          </Col>
        </Row>
        <h4>Cryptocurrencies</h4>
        <div id="tableSize">
          <Table striped bordered hover variant="dark" size="sm">
            <tbody>{currencyList}</tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

const api_key = "YOUR API KEY";
export async function getStaticProps() {
  // Api keyleri url ekle.
  // Json
  const res = await fetch(
    "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
    {
      method: "GET",
      headers: { "X-CMC_PRO_API_KEY": api_key },
    }
  );
  const posts = await res.json();

  const cryptoCurrencyRes = await fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?sort=cmc_rank&limit=500",
    {
      method: "GET",
      headers: { "X-CMC_PRO_API_KEY": api_key },
    }
  );
  const cryptoCurrencyPost = await cryptoCurrencyRes.json();
  const feerIndexRes = await fetch("https://api.alternative.me/fng/?limit=2");
  const feerIndexPost = await feerIndexRes.json();
  return {
    props: {
      posts,
      cryptoCurrencyPost,
      feerIndexPost,
    },
  };
}

export default index;
