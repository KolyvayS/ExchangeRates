import React, { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function ExchangeRateChart() {
  const [exchangeRates, setExchangeRates] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')
  const [selectedPeriod, setSelectedPeriod] = useState('рік')
  const chartRef = useRef()

  useEffect(() => {
    const getData = async () => {
      try {
        const endDate = new Date()
        const startDate = new Date()

        const formatDateForAPI = (date) =>
          date.toISOString().slice(0, 10).replace(/-/g, '')

        const apiUrl = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${selectedCurrency}&date=`
        const requests = []

        switch (selectedPeriod) {
          case 'тиждень':
            startDate.setDate(endDate.getDate() - 7)
            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
              const dateForAPI = formatDateForAPI(date)
              const requestUrl = `${apiUrl}${dateForAPI}&json`
              requests.push(fetch(requestUrl))
            }
            break
          case 'місяць':
            startDate.setDate(endDate.getDate() - 28)
            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 7)) {
              const dateForAPI = formatDateForAPI(date)
              const requestUrl = `${apiUrl}${dateForAPI}&json`
              requests.push(fetch(requestUrl))
            }
            break
          case 'квартал':
            startDate.setMonth(endDate.getMonth() - 3)
            for (let date = startDate; date <= endDate; date.setMonth(date.getMonth() + 1)) {
              const dateForAPI = formatDateForAPI(date)
              const requestUrl = `${apiUrl}${dateForAPI}&json`
              requests.push(fetch(requestUrl))
            }
            break
          case 'рік':
            startDate.setFullYear(endDate.getFullYear() - 1)
            for (let date = startDate; date <= endDate; date.setMonth(date.getMonth() + 1)) {
              const dateForAPI = formatDateForAPI(date)
              const requestUrl = `${apiUrl}${dateForAPI}&json`
              requests.push(fetch(requestUrl))
            }
            break
          case 'весь час':
            startDate.setFullYear(endDate.getFullYear() - 24)
            for (let date = startDate; date <= endDate; date.setFullYear(date.getFullYear() + 1)) {
              const dateForAPI = formatDateForAPI(date)
              const requestUrl = `${apiUrl}${dateForAPI}&json`
              requests.push(fetch(requestUrl))
            }
            break
          default:
            break
        }

        const responses = await Promise.all(requests)
        const data = await Promise.all(responses.map((response) => response.json()))

        setExchangeRates(data.map((item) => ({ date: item[0].exchangedate, rate: item[0].rate })))
      } catch (error) {
        console.error('Помилка при отриманні даних:', error)
      }
    };
    getData()

  }, [selectedCurrency, selectedPeriod])

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    const labels = exchangeRates.map((item) => item.date)
    const rates = exchangeRates.map((item) => item.rate)

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Курс ${selectedCurrency}`,
          data: rates
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      chart.destroy()
    };
  }, [selectedCurrency, exchangeRates])

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value)
  };

  return (
    <div>
      <h3>Графік курсу валюти за {selectedPeriod}</h3>
        <div className='chart-settings'>
            <div>
              <select value={selectedCurrency} onChange={handleCurrencyChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="PLN">PLN</option>
              </select>
            </div>
            <div className="period">
              <button onClick={() => setSelectedPeriod('тиждень')}>Тиждень</button>
              <button onClick={() => setSelectedPeriod('місяць')}>Місяць</button>
              <button onClick={() => setSelectedPeriod('квартал')}>Квартал</button>
              <button onClick={() => setSelectedPeriod('рік')}>Рік</button>
              <button onClick={() => setSelectedPeriod('весь час')}>Весь час</button>
            </div>
          </div>
          <div className="chart">
            <canvas ref={chartRef}></canvas>
          </div>
    </div>
  )
}
