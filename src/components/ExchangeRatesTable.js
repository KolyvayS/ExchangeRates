import React, { useState, useEffect } from 'react'
import "../App.css"

export default function ExchangeRatesTable({response}) {
  const [mainCurrencies, setMainCurrencies] = useState([])
  const [currenciesForSelection, setСurrenciesForSelection] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState('Злотий')

  const getCurrentDate = () => {
  const currentDate = new Date()
  return `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`
  }

  useEffect(() => {
    const getData = async () => {
      try {
        // Округлюємо значення до 3 цифр після коми
        const roundedRates = response.data.map(currency => ({
          ...currency,
          rate: parseFloat(currency.rate).toFixed(3),
        }));

        setСurrenciesForSelection(roundedRates)

        // Відфільтровуємо потрібні валюти (USD, EUR, GBP)
        const filteredCurrencies = roundedRates.filter(currency =>
          ['USD', 'EUR', 'GBP'].includes(currency.cc)
        );

        setMainCurrencies(filteredCurrencies)
      } catch (error) {
        console.error('Помикла в отриманні даних:', error)
      }
    };

    getData()
  }, [response])

  const selectedCurrencyObject = currenciesForSelection.find(currency => currency.txt === selectedCurrency)
  const selectedCurrencyRate = selectedCurrencyObject ? selectedCurrencyObject.rate : '—'
  const selectedCurrencyCode = selectedCurrencyObject ? selectedCurrencyObject.cc : '—'

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value)
  }

  return (
    <div className='table'>
      <h3>Курси валют за {getCurrentDate()}</h3>
      <table>
        <thead>
          <tr>
            <th>Код</th>
            <th>Назва валюти</th>
            <th>Курс</th>
          </tr>
        </thead>
        <tbody>
          {mainCurrencies.map(currency => (
            <tr key={currency.cc}>
              <td>{currency.cc}</td>
              <td>{currency.txt}</td>
              <td className="rates">{currency.rate}</td>
            </tr>
          ))}
          <tr>
            <td> {selectedCurrencyCode} </td>
            <td> <select onChange={handleCurrencyChange} value={selectedCurrency}>
              {currenciesForSelection.map(currency => (
                <option key={currency.txt} value={currency.txt}>{currency.txt}</option>
              ))}
            </select> </td>
            <td> {selectedCurrencyRate} </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

