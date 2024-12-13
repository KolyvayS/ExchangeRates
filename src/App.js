import React from "react";
import ExchangeRatesTable from "./components/ExchangeRatesTable";
import ExchangeRateChart from "./components/ExchangeRateChart";
import CurrencyConverter from "./components/CurrencyConverter";
import "./App.css";
import axios from 'axios';

const getCurrentDateForAPI = () => {
  const currentDate = new Date()
  return currentDate.toISOString().slice(0, 10).replace(/-/g, '')
}
const response = await axios.get(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${getCurrentDateForAPI()}&json`)

export default function Rates() {
  return(
    <div className="wrapper">
      <div className="text-components">
        <div>
          <ExchangeRatesTable  response = {response}/>
        </div>
        <div className="converter">
          <CurrencyConverter response = {response}/>
        </div>
      </div>
      <div className="chart-component">
        <ExchangeRateChart />
      </div>
    </div> 
  )
}
