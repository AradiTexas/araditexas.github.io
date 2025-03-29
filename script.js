document.addEventListener('DOMContentLoaded', function() {
    // Update timestamp
    document.getElementById('update-time').textContent = new Date().toLocaleString();
    
    // Sample data - replace with real data from your API
    const sampleData = {
        performance: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            values: [100, 105, 103, 110, 115, 120, 118, 125, 130, 135, 140, 145],
            benchmark: [100, 102, 101, 105, 108, 110, 109, 112, 115, 118, 120, 122]
        },
        allocation: {
            labels: ['Equities', 'Fixed Income', 'Real Estate', 'Commodities', 'Cash'],
            data: [55, 25, 10, 5, 5],
            colors: ['#2962ff', '#00c853', '#ffab00', '#ff3d00', '#78909c']
        },
        holdings: [
            { name: 'Apple Inc.', ticker: 'AAPL', shares: 500, avgCost: 120, currentPrice: 150 },
            { name: 'Microsoft Corp.', ticker: 'MSFT', shares: 300, avgCost: 200, currentPrice: 250 },
            { name: 'Amazon.com Inc.', ticker: 'AMZN', shares: 100, avgCost: 3000, currentPrice: 3200 },
            { name: 'Tesla Inc.', ticker: 'TSLA', shares: 200, avgCost: 600, currentPrice: 700 },
            { name: 'Alphabet Inc.', ticker: 'GOOGL', shares: 150, avgCost: 1800, currentPrice: 2000 },
            { name: 'Berkshire Hathaway', ticker: 'BRK.B', shares: 250, avgCost: 200, currentPrice: 220 },
            { name: 'Vanguard S&P 500 ETF', ticker: 'VOO', shares: 1000, avgCost: 350, currentPrice: 380 },
            { name: 'iShares Core Bond ETF', ticker: 'AGG', shares: 500, avgCost: 110, currentPrice: 108 }
        ]
    };

    // Initialize charts
    initPerformanceChart();
    initAllocationChart();
    initComparisonChart();
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
                    borderColor: '#2962ff', // Fixed CSS variable reference
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
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${percentage}% ($${(value * 1000).toLocaleString()})`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    function initComparisonChart() {
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        window.comparisonChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampleData.performance.labels,
                datasets: [
                    {
                        label: 'Portfolio',
                        data: sampleData.performance.values,
                        borderColor: '#2962ff', // Fixed CSS variable reference
                        backgroundColor: 'rgba(41, 98, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Benchmark (S&P 500)',
                        data: sampleData.performance.benchmark,
                        borderColor: '#78909c', // Fixed CSS variable reference
                        backgroundColor: 'rgba(120, 144, 156, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
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
                                return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
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

    function populateAllocationTable() {
        const tableBody = document.getElementById('allocation-data');
        const totalValue = sampleData.allocation.data.reduce((a, b) => a + b, 0);
        
        sampleData.allocation.labels.forEach((label, index) => {
            const value = sampleData.allocation.data[index];
            const percentage = ((value / totalValue) * 100).toFixed(1);
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
            const value = (holding.shares * holding.currentPrice).toLocaleString();
            const returnValue = ((holding.currentPrice - holding.avgCost) / holding.avgCost * 100).toFixed(1);
            const returnDollar = (holding.shares * (holding.currentPrice - holding.avgCost)).toLocaleString();
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${holding.name}</td>
                <td>${holding.ticker}</td>
                <td>${holding.shares.toLocaleString()}</td>
                <td>$${holding.avgCost.toLocaleString()}</td>
                <td>$${holding.currentPrice.toLocaleString()}</td>
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