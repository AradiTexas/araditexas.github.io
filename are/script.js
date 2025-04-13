document.addEventListener('DOMContentLoaded', function() {
    // Update timestamp
    // document.getElementById('update-time').textContent = new Date().toLocaleString();
    
    // Sample data - all numerical values zeroed out
    const sampleData = {
        performance: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            benchmark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        allocation: {
            labels: ['8.04 Acre Village', '2.42 Acre Bartlett st', '9706 Champion House', '26M Land', 'Lake Land'],
            data: [0, 0, 0, 0, 0],
            colors: ['#2962ff', '#00c853', '#ffab00', '#ff3d00', '#78909c']
        },
        holdings: [
            { name: '8.04 Acre Village', shares: 0, Cost: 0, expenses: 0 },
            { name: '2.42 Acre Bartlett st', shares: 0, Cost: 0, expenses: 0 },
            { name: '9706 Champion House', shares: 0, Cost: 0, expenses: 0 },
            { name: '26M Land', shares: 0, Cost: 0, expenses: 0 },
            { name: 'Lake Land', shares: 0, Cost: 0, expenses: 0 },
        ]
    };

    // Initialize charts
    // initPerformanceChart();
    initAllocationChart();
    // initComparisonChart();
    populateAllocationTable();
    populateHoldingsTable();

    // Timeframe selector functionality
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // In a real app, you would fetch new data based on timeframe
            updateCharts(this.dataset.timeframe);
        });
    });

    // Portfolio selector functionality
    document.getElementById('portfolio-select').addEventListener('change', function() {
        // In a real app, you would fetch new data based on selected portfolio
        console.log('Selected portfolio:', this.value);
    });

    function initPerformanceChart() {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        window.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampleData.performance.labels,
                datasets: [{
                    label: 'Portfolio Value',
                    data: sampleData.performance.values,
                    borderColor: '#2962ff',
                    backgroundColor: 'rgba(41, 98, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    function initAllocationChart() {
        const ctx = document.getElementById('allocation-chart').getContext('2d');
        window.allocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sampleData.allocation.labels,
                datasets: [{
                    data: sampleData.allocation.data,
                    backgroundColor: sampleData.allocation.colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const data = context.dataset.data;
                                const total = data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                // Handle zero total to avoid NaN
                                const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
                                return `${context.label}: ${percentage}% ($${value.toLocaleString()})`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    function populateAllocationTable() {
        const tableBody = document.getElementById('allocation-data');
        const totalValue = sampleData.allocation.data.reduce((a, b) => a + b, 0);
        
        sampleData.allocation.labels.forEach((label, index) => {
            const value = sampleData.allocation.data[index];
            const percentage = totalValue === 0 ? 0 : ((value / totalValue) * 100).toFixed(1);
            const dollarValue = (value * 1000).toLocaleString();
            const returnValue = (Math.random() * 15 - 2).toFixed(1);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td>${percentage}%</td>
                <td>$${dollarValue}</td>
                <td class="${returnValue >= 0 ? 'positive' : 'negative'}">${returnValue >= 0 ? '+' : ''}${returnValue}%</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function populateHoldingsTable() {
        const tableBody = document.getElementById('holdings-data');
        
        sampleData.holdings.forEach(holding => {
            const value = (holding.shares * holding.expenses).toLocaleString();
            const returnValue = holding.Cost === 0 ? 0 : ((holding.expenses - holding.Cost) / holding.Cost * 100).toFixed(1);
            const returnDollar = (holding.shares * (holding.expenses - holding.Cost)).toLocaleString();
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${holding.name}</td>
                <td>${holding.shares.toLocaleString()}</td>
                <td>$${holding.Cost.toLocaleString()}</td>
                <td>$${holding.expenses.toLocaleString()}</td>
                <td>$${value}</td>
                <td class="${returnValue >= 0 ? 'positive' : 'negative'}">${returnValue >= 0 ? '+' : ''}${returnValue}% ($${returnDollar})</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updateCharts(timeframe) {
        // In a real app, you would fetch new data based on timeframe
        console.log('Updating charts for timeframe:', timeframe);
        
        // For demo purposes, we'll just randomize the data a bit
        if (window.performanceChart) {
            const newData = sampleData.performance.values.map(val => {
                const change = (Math.random() * 10 - 5);
                return val + change;
            });
            
            window.performanceChart.data.datasets[0].data = newData;
            window.performanceChart.update();
        }
    }
});