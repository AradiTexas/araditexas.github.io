document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing dashboard');
    let contributions =  { name: [], shares: [], amountInvested: [] };
    const response = await fetch('./contributions.xlsx');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        contributions = jsonData.reduce((c, row) => {
            if (row.Member) {
                c.name.push( row.Member );
                c.shares.push( row.Shares || "-");
                c.amountInvested.push( row.Shares * 1000  || "-");
            }
            return c;
        }, { name: [], shares: [], amountInvested: [] });

        

        updateMetrics(contributions)

        populateTable('contributions-data', contributions.name.map((c, i) => ({
            name: contributions.name[i],
            ownership: (contributions.amountInvested[i]/contributions.amountInvested.reduce((sum, amount) => {
                const num = parseFloat(amount);
                return isNaN(num) ? sum : sum + num;
            })*100).toFixed(2) + "%",
            investedCapital: "$" + contributions.amountInvested[i]
        })));
        

        

        //functions
        function updateMetrics(c) {
            // Calculate total capital (sum of all asset prices + expenses)
            const partnersNum = c.name.length;
            const totalCapital = c.amountInvested.reduce((sum, amount) => {
                const num = parseFloat(amount);
                return isNaN(num) ? sum : sum + num;
            }, 0);
            
            
            // Update the DOM elements
            document.getElementById('totalPartners').textContent = `${partnersNum.toLocaleString()}`;
            document.getElementById('totalCapital').textContent = `${totalCapital.toLocaleString()}`;
        }

        function populateTable(tableId, rows) {
            const tableBody = document.getElementById(tableId);
            
            if (!tableBody) throw new Error(`Element #${tableId} not found`);
            
            tableBody.innerHTML = rows.map(row => 
                `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`
            ).join('');
        }

});