import React, { useState, useEffect } from 'react'

export default function CurrencyConverter ({response}) {
  const [exchangeRates, setExchangeRates] = useState({})
  const [amount, setAmount] = useState(100)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('UAH')

  useEffect(() => {
    const getData = async () => {
      try {
        const rates = {};
        response.data.forEach(currency => {
          rates[currency.cc] = currency.rate
        });
        rates['UAH'] = 1
        setExchangeRates(rates)
      } catch (error) {
        console.error('Помилка в отриманні даних:', error)
      }
    }
    getData()
  }, [response])

  const convertedAmount = ((amount * exchangeRates[fromCurrency]) / exchangeRates[toCurrency]).toFixed(2)


  const handleAmountChange = e => {
    setAmount(e.target.value)
  };

  const handleFromCurrencyChange = e => {
    setFromCurrency(e.target.value)
  };

  const handleToCurrencyChange = e => {
    setToCurrency(e.target.value)
  };
  const swapCurrencies = () => {
   const tempCurrency = fromCurrency
   setFromCurrency(toCurrency)
   setToCurrency(tempCurrency)
  };

  return (
    <div>
      <h3>Конвертер валют</h3>
        <div className='converter-body'>
          <div className='converter-currency'>
            <input value={amount} onChange={handleAmountChange}/>
            <select value={fromCurrency} onChange={handleFromCurrencyChange}>
              {Object.keys(exchangeRates).map(currency => (
                <option key={currency} value={currency}>
                {currency}
                </option>
              ))}
            </select>
            <div>
              <button onClick={() => setFromCurrency('USD')}>USD</button>
              <button onClick={() => setFromCurrency('EUR')}>EUR</button>
              <button onClick={() => setFromCurrency('UAH')}>UAH</button>
            </div>
          </div>
          <div className='converter-currency'>
            <label>{convertedAmount}</label>
            <select value={toCurrency} onChange={handleToCurrencyChange}>
              {Object.keys(exchangeRates).map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <div>
              <button onClick={() => setToCurrency('USD')}>USD</button>
              <button onClick={() => setToCurrency('EUR')}>EUR</button>
              <button onClick={() => setToCurrency('UAH')}>UAH</button>
            </div>
          </div>
          <div>
            <label> Поміняти валюти місцями: </label>
            <button onClick={swapCurrencies}>⇋</button>
          </div>
    </div>
  </div>
  )
}
