document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing dashboard');

    // Sample data structure
    const accounting = {
        asset: { name: [], price: [], colors: [], shares: [], expenses: [], revenue: [] },
    };

    try {
        // Load and process Excel data
        const response = await fetch('./assets.xlsx');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        
        // Process asset data
        accounting.asset = jsonData.reduce((acc, row) => {
            const value = parseFloat(row.Price);
            if (row.Asset) {
                acc.name.push( row.Asset );
                acc.price.push( row.Price || "Unknown");
                acc.colors.push(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
                acc.shares.push( row.Shares || 'Unknown');
                acc.expenses.push( row.Expenses || '-');
                acc.revenue.push( row.Revenue || "-");
            }
            return acc;
        }, { name: [], price: [], colors: [], shares: [], expenses: [], revenue: [] });
        

        if (accounting.asset.name.length === 0) {
            throw new Error('No valid data found in Excel file');
        }

        // Initialize components

        updatePerformanceMetrics(accounting.asset);
        initAllocationChart();
        populateTable('allocation-data', accounting.asset.name.map((label, i) => ({
            name: label,
            percentage: (accounting.asset.price[i] / accounting.asset.price.reduce((a, b) => a + b, 0) * 100).toFixed(1)+"%",
            value: "$" + (accounting.asset.price[i] + accounting.asset.expenses[i]).toLocaleString()
        })));
        
        populateTable('holdings-data', accounting.asset.name.map((label, i) => ({
            name: label,
            shares: accounting.asset.shares[i].toLocaleString(),
            cost: accounting.asset.price[i].toLocaleString(),
            expenses: accounting.asset.expenses[i].toLocaleString(),
            value: "$" + (accounting.asset.price[i] + accounting.asset.expenses[i] ).toLocaleString(),
            return: accounting.asset.revenue[i].toLocaleString()
        })));

    } catch (err) {
        console.error('Initialization error:', err);
        alert(`Error: ${err.message}`);
    }

    function initAllocationChart() {
        const ctx = document.getElementById('allocation-chart')?.getContext('2d');
        if (!ctx) throw new Error('Canvas #allocation-chart not found');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                name: accounting.asset.name,
                datasets: [{
                    data: accounting.asset.price,
                    backgroundColor: accounting.asset.colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total ? Math.round((context.raw / total) * 100) : 0;
                                return `${context.label}: ${percentage}% ($${context.raw.toLocaleString()})`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    function populateTable(tableId, rows) {
        const tableBody = document.getElementById(tableId);
        if (!tableBody) throw new Error(`Element #${tableId} not found`);
        
        tableBody.innerHTML = rows.map(row => 
            `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`
        ).join('');
    }

    function updatePerformanceMetrics(rows) {
        // Calculate total capital (sum of all asset prices + expenses)
        const totalCapital = rows.price.reduce((sum, price, index) => {
            return sum + parseFloat(price) + parseFloat(rows.expenses[index] || 0);
        }, 0);
        
        // Calculate total revenue
        const totalRevenue = rows.revenue.reduce((sum, revenue) => {
            return sum + parseFloat(revenue) || 0;
        }, 0);
        
        // Calculate ROI (Return on Investment)
        // ROI = (Total Revenue - Total Expenses) / Total Capital * 100
        const totalExpenses = rows.expenses.reduce((sum, expense) => {
            return sum + parseFloat(expense) || 0;
        }, 0);
        
        const roi = ((totalRevenue - totalExpenses) / totalCapital * 100).toFixed(2);
        
        // Calculate IRR (Internal Rate of Return)
        // Simplified approximation for demonstration (real IRR calculation would need cash flow dates)
        const irrApproximation = (totalRevenue / totalCapital * 100).toFixed(2);
        
        // Update the DOM elements
        document.getElementById('totalCapital').textContent = `$${totalCapital.toLocaleString()}`;
        document.getElementById('ROI').textContent = `${roi}%`;
        document.getElementById('IRR').textContent = `${irrApproximation}%`;
        document.getElementById('Revenue').textContent = `$${totalRevenue.toLocaleString()}`;
    }
    
});