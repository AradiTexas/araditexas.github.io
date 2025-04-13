document.addEventListener('DOMContentLoaded', function() {
    // Update timestamp
    // document.getElementById('update-time').textContent = new Date().toLocaleString();
    
    // Sample data - replace with real data from your API
    const sampleData = {
        performance: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            values: [100, 105, 103, 110, 115, 120, 118, 125, 130, 135, 140, 145],
            benchmark: [100, 102, 101, 105, 108, 110, 109, 112, 115, 118, 120, 122]
        },
        allocation: {
            labels: ['8.04 Acre Village', '2.42 Acre Bartlett	 st', '9706 Champion House	', '26M Land	', 'Lake Land	'],
            data: [16.38, 32.32, 13.88, 12.25, 21.21],
            colors: ['#2962ff', '#00c853', '#ffab00', '#ff3d00', '#78909c']
        },
        holdings: [
            { name: '8.04 Acre Village',  shares: 43.33, Cost: 390000, expenses: 0 },
            { name: '2.42 Acre Bartlett	 st',  shares: 100, Cost: 769470.16, expenses: 0 },
            { name: '9706 Champion House	',  shares: 100, Cost: 330383.95, expenses: 0 },
            { name: '26M Land	',  shares: 31.3332, Cost: 291712.09, expenses: 0 },
            { name: 'Lake Land	',  shares: 27.8508, Cost: 504880.79, expenses: 0 },
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

    // function initComparisonChart() {
    //     const ctx = document.getElementById('comparison-chart').getContext('2d');
    //     window.comparisonChart = new Chart(ctx, {
    //         type: 'line',
    //         data: {
    //             labels: sampleData.performance.labels,
    //             datasets: [
    //                 {
    //                     label: 'Portfolio',
    //                     data: sampleData.performance.values,
    //                     borderColor: '#2962ff', // Fixed CSS variable reference
    //                     backgroundColor: 'rgba(41, 98, 255, 0.1)',
    //                     borderWidth: 2,
    //                     tension: 0.4
    //                 },
    //                 {
    //                     label: 'Benchmark (S&P 500)',
    //                     data: sampleData.performance.benchmark,
    //                     borderColor: '#78909c', // Fixed CSS variable reference
    //                     backgroundColor: 'rgba(120, 144, 156, 0.1)',
    //                     borderWidth: 2,
    //                     borderDash: [5, 5],
    //                     tension: 0.4
    //                 }
    //             ]
    //         },
    //         options: {
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             plugins: {
    //                 legend: {
    //                     position: 'top',
    //                 },
    //                 tooltip: {
    //                     mode: 'index',
    //                     intersect: false,
    //                     callbacks: {
    //                         label: function(context) {
    //                             return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
    //                         }
    //                     }
    //                 }
    //             },
    //             scales: {
    //                 y: {
    //                     beginAtZero: false,
    //                     ticks: {
    //                         callback: function(value) {
    //                             return value + '%';
    //                         }
    //                     }
    //                 }
    //             },
    //             interaction: {
    //                 mode: 'nearest',
    //                 axis: 'x',
    //                 intersect: false
    //             }
    //         }
    //     });
    // }

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
            const value = (holding.shares * holding.expenses).toLocaleString();
            const returnValue = ((holding.expenses - holding.Cost) / holding.Cost * 100).toFixed(1);
            const returnDollar = (holding.shares * (holding.expenses - holding.Cost)).toLocaleString();
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${holding.name}</td>
                <td>${holding.shares.toLocaleString()}%</td>
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