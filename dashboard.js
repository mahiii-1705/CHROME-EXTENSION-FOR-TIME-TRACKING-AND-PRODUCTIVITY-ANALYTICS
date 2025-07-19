// Fetch analytics data and render chart
fetch("http://localhost:5000/api/analytics")
  .then(res => res.json())
  .then(data => {
    if (!data || data.length === 0) {
      console.log("No data received.");
      return;
    }

    const labels = data.map(entry => entry._id);
    const values = data.map(entry => Math.round(entry.totalTime / 60)); // seconds → minutes

    const ctx = document.getElementById("productivityChart").getContext("2d");

    new Chart(ctx, {
      type: "doughnut", // change to 'bar' or 'pie' if preferred
      data: {
        labels: labels,
        datasets: [{
          label: "Time Spent (minutes)",
          data: values,
          backgroundColor: [
            "#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0", "#00bcd4"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: false
          }
        }
      }
    });
  })
  .catch(err => {
    console.error("Error loading chart data:", err);
  });
