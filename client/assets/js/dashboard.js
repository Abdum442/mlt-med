const dashboardMenu = document.getElementById('dashboard');

document.addEventListener("DOMContentLoaded", () => {
  constructDashboardDetails();
  dashboardMenu.click();
});

dashboardMenu.addEventListener('click', function () {
  document.getElementById('detailed').style.display = 'none';
  document.getElementById('dashboard-details').style.display = 'block';

  const purchaseRawData = JSON.parse(localStorage.getItem('purchase-data'));
  const ordersRawData = JSON.parse(localStorage.getItem('orders-data'));
  const salesRawData = JSON.parse(localStorage.getItem('sales-data'));
  const productRawData = JSON.parse(localStorage.getItem('products-data'));
  const stockRawData = JSON.parse(localStorage.getItem('stock-data'));


  const productMap = new Map(productRawData.map(item =>
    [parseInt(item.id), 
      { 
        name: item.name,
        sellingPrice: item.saling_price, 
        purchasePrice: item.purchase_price 
      }
    ]));

  const costUnsoldItem = Math.round(stockRawData.reduce((total, stock) =>{
    const purchasePrice = parseFloat(productMap.get(parseInt(stock.product_id)).purchasePrice);
    const leftItems = parseInt(stock.quantity);
    const totalCost = purchasePrice * leftItems;
    return total + totalCost;
  }, 0));

  const totalProfit = Math.round(salesRawData.reduce((total, sales) => {
    const quantitySold = parseInt(sales.quantity_sold);
    const salesAmount = parseInt(sales.amount_received);

    const purchasePrice = parseFloat(productMap.get(parseInt(sales.product_id)).purchasePrice);

    const purchaseCost = quantitySold * purchasePrice;

    const salesProfit = Math.round(salesAmount - purchaseCost); 
    
    return total + salesProfit;
  }, 0));

  


  const totalPurchaseCost = Math.round(purchaseRawData.reduce((total, purchase) => total + parseFloat(purchase.amount_paid), 0));
  const totalSales = Math.round(ordersRawData.reduce((total, order) => {
    if(order.checkout_status === 'sold'){
      return total + parseFloat(order.amount_paid);
    } else {
      return total;
    }
  }, 0));


  document.getElementById('summary-purchase').innerText = `ETB ${totalPurchaseCost.toLocaleString('en-US')}`;
  document.getElementById('summary-sales').innerText = `ETB ${totalSales.toLocaleString('en-US')}`;
  document.getElementById('summary-profit').innerText = `ETB ${totalProfit.toLocaleString('en-US')}`;
  document.getElementById('summary-operating-capital').innerText = `ETB ${(costUnsoldItem + totalSales).toLocaleString('en-US')}`;
  

  
});


function getPurchaseSummary(purchase_raw_data) {
  let total = 0;
  for (const purchase of purchase_raw_data) {
    if(purchase.amount_paid !== null) {
      total += parseFloat(purchase.amount_paid);
    }
  }
  return Math.round(total);
}

function constructDashboardDetails() {
  const allDetailsContainer = document.getElementById('dashboard-details');


  const detailContainer1 = document.createElement('div');
  detailContainer1.id = 'graph-topProducts';
  detailContainer1.className = 'details chart-top-product';

  allDetailsContainer.appendChild(detailContainer1);

  const graphContainer = document.createElement('div');
  graphContainer.className = 'chart';
  detailContainer1.appendChild(graphContainer);

  const topProductsContainer = document.createElement('div');
  topProductsContainer.className = 'top-products';
  detailContainer1.appendChild(topProductsContainer);



  const detailContainer2 = document.createElement('div');
  detailContainer2.id = 'expenses-loanDebit';
  detailContainer2.className = 'details expense-loan';

  allDetailsContainer.appendChild(detailContainer2);

  const expensesContainer = document.createElement('div');
  expensesContainer.className = 'expenses-table'
  detailContainer2.appendChild(expensesContainer);

  const loansContainer = document.createElement('div');
  loansContainer.className = 'loans-table';
  detailContainer2.appendChild(loansContainer);

  const canvas = document.createElement('canvas');
  canvas.id = 'salesChart';
  graphContainer.appendChild(canvas);


  const tableData = [
    {
      title: 'Top Selling Products',
      id: 'top-selling-products',
      headers: ['Product', 'Total Sales'],
      container: topProductsContainer,
    },
    {
      title: 'Recent Expenses',
      id: 'recent-expenses',
      headers: ['Expense ID', 'Category', 'Amount', 'Date'],
      container: expensesContainer,
    },
    {
      title: 'Loans and Debits',
      id: 'loans-debits',
      headers: ['ID', 'Amount', 'Due Date', 'Type'],
      container: loansContainer
    }
  ];





  tableData.forEach(table => {

    const h2 = document.createElement('h2');
    h2.innerText = table.title;
    table.container.appendChild(h2);

    const tableElement = document.createElement('table');
    tableElement.id = table.id;
    table.container.appendChild(tableElement);

    const thead = document.createElement('thead');
    tableElement.appendChild(thead);

    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);

    table.headers.forEach(header => {
      const td = document.createElement('td');
      td.innerText = header;
      headerRow.appendChild(td);
    });

    const tbody = document.createElement('tbody');
    tableElement.appendChild(tbody);
  });

  // Sample data
  const totalRevenue = 100000;
  const totalCost = 70000;
  const operatingCapital = 30000;
  const profit = 15000;
  const topSellingProducts = [
    { product: 'Product A', totalSales: 5000 },
    { product: 'Product B', totalSales: 4000 },
    { product: 'Product C', totalSales: 3000 }
  ];
  const recentExpenses = [
    { expenseId: 1, category: 'Marketing', amount: 500, date: '2024-01-01' },
    { expenseId: 2, category: 'Salaries', amount: 3000, date: '2024-01-02' }
  ];
  const loansDebits = [
    { id: 1, amount: 10000, dueDate: '2024-06-01', type: 'Loan' },
    { id: 2, amount: 5000, dueDate: '2024-07-01', type: 'Debit' }
  ];

  const salesRawData = JSON.parse(localStorage.getItem('sales-data'));

  const salesData = getSalesData(salesRawData, 7);

    // const salesData = [
    //   { date: '2024-01-01', volume: 100 },
    //   { date: '2024-01-02', volume: 120 },
    //   { date: '2024-01-03', volume: 110 },
    //   { date: '2024-01-31', volume: 150 },
    //   { date: '2024-02-01', volume: 140 },
    //   { date: '2024-02-02', volume: 160 },
    //   { date: '2024-02-03', volume: 170 },
    //   // Continue for other days
    // ];

  // console.log('sales raw: ', salesRawData);  

  function formatDateLabels(data) {
    const labels = [];
    let lastMonth = null;

    data.forEach(entry => {
      const date = new Date(entry.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const day = String(date.getDate()).padStart(2, '0');

      if (lastMonth !== month) {
        labels.push(`${month}`);
        lastMonth = month;
      } else {
        labels.push(`${day}`);
      }
    });

    return labels;
  }

  // Prepare labels and data for the chart
  const labels = formatDateLabels(salesData);
  const data = salesData.map(entry => entry.volume);

  // Sales Chart
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar', // Set the main type to bar
    data: {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          // label: 'Daily Sales Volume (Bar)',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        },
        {
          type: 'line',
          // label: 'Daily Sales Volume (Line)',
          data: data,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 3,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        x: {
          type: 'category',
          title: {
            display: false,
            text: 'Date',
            font: {
              weight: 'bold' // Make the title bold
            }
          },
          ticks: {
            font: {
              weight: 'bold' // Make the labels bold
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          border: {
            display: false,
          },
          title: {
            display: true,
            text: 'Sales Volume',
            color: 'black',
            font: {
              weight: 'bold', // Make the title bold
              size: 14
            }
          },
          ticks: {
            font: {
              weight: 'bold', // Make the labels bold
              color: 'black',
            },
            min: 80,
            max: 180,
            stepSize: 5000
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false,
        }
      }
    }
  });

  // Populate Top Selling Products table
  const topSellingTable = document.getElementById('top-selling-products').getElementsByTagName('tbody')[0];
  topSellingProducts.forEach(product => {
    const row = topSellingTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.innerText = product.product;
    cell2.innerText = `$${product.totalSales.toLocaleString()}`;
  });



  // Populate Recent Expenses table
  const recentExpensesTable = document.getElementById('recent-expenses').getElementsByTagName('tbody')[0];
  recentExpenses.forEach(expense => {
    const row = recentExpensesTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    cell1.innerText = expense.expenseId;
    cell2.innerText = expense.category;
    cell3.innerText = `$${expense.amount.toLocaleString()}`;
    cell4.innerText = expense.date;
  });

  // Populate Loans and Debits table
  const loansDebitsTable = document.getElementById('loans-debits').getElementsByTagName('tbody')[0];
  loansDebits.forEach(entry => {
    const row = loansDebitsTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    cell1.innerText = entry.id;
    cell2.innerText = `$${entry.amount.toLocaleString()}`;
    cell3.innerText = entry.dueDate;
    cell4.innerText = entry.type;
  });
}

function getSalesData(salesRawData, salesWindow) {
  // Get today's date and set the time to 00:00:00 to ignore time component
  const today = new Date();
  today.setHours(0, 0, 0, 0);
 
  // Create a map to store sales volumes by date
  const salesMap = new Map();

  // Process the raw data
  let total = 0;
  salesRawData.forEach(entry => {
    if (entry.checkout_status !== 'hold'){
      const date = new Date(entry.sale_date);
      date.setHours(0, 0, 0, 0); // Normalize the time part

      const dateString = date.toISOString().split('T')[0];

      console.log('sales date: ', entry.sale_date, 'formated date: ', dateString);
      
      if (!salesMap.has(dateString)) {
        salesMap.set(dateString, 0);
        total = 0;
      } else {
        total += parseFloat(entry.amount_received);
      }

      salesMap.set(dateString, salesMap.get(dateString) + parseFloat(entry.amount_received));
    }
    
    
  });   

  // Create the result array
  const result = [];

  // Count backwards from today up to the salesWindow
  for (let i = 0; i < salesWindow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0); // Normalize the time part

    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    // console.log('i: ', i, 'string date : ', formattedDate);
    const volume = Math.round(salesMap.get(formattedDate) || 0); // Get volume or 0 if no sales on that date

    result.push({ date: formattedDate, volume });
    // console.log('date: ', date, 'amount received: ', salesMap.get(date));
  }
  // console.log('date: ', date)
  console.log('sales map: ', salesMap)

  // console.log('sale data: ', salesMap.get(data));
  // Reverse the result array to have the dates in chronological order
  return result.reverse();
}
