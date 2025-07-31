let chart;

async function searchStock() {
  const symbol = document.getElementById("stockInput").value.trim().toUpperCase();
  if (!symbol) {
    alert("Please enter a stock symbol like TCS.NS or RELIANCE.NS");
    return;
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.chart || !data.chart.result) {
      alert("No data found. Try a valid NSE symbol.");
      return;
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;

    const labels = timestamps.map(t =>
      new Date(t * 1000).toLocaleDateString()
    );

    if (chart) chart.destroy(); // remove previous chart

    const ctx = document.getElementById("stockChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${symbol} Price (INR)`,
          data: prices,
          borderColor: "#0070f3",
          backgroundColor: "rgba(0, 112, 243, 0.1)",
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { maxTicksLimit: 10 } },
          y: { beginAtZero: false }
        }
      }
    });
  } catch (err) {
    console.error(err);
    alert("Failed to fetch data.");
  }
}
