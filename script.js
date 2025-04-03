// Wait for DOM to be fully loaded


// Function to redirect to selected portfolio
function redirectToPortfolio(portfolioType) {
    let url;
    
    // Set the appropriate URL based on portfolio type
    switch(portfolioType) {
        case 'aas':
            url = 'aas/index.html';
            break;
        case 'are':
            url = 'are/index.html';
            break;
        case 'fm':
            url = 'fm/index.html';
            break;
        case 'fm1314':
            url = 'fm1314/index.html';
            break;
        case 'rebs':
            url = 'rebs/index.html';
            break;
        case 'reis':
            url = 'reis/index.html';
            break;
        case 'reps':
            url = 'reps/index.html';
            break;
        case 'ress':
            url = 'ress/index.html';
            break;                                                        
        default:
            url = 'index.html';
    }
    
    
    // Redirect to the selected portfolio
    window.location.href = url;
}