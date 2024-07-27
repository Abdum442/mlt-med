// import Chart from 'chart.js/auto';

const dashboardMenu = document.getElementById('dashboard');

// const Chart = window.electronAPI.Chart;

// document.addEventListener("DOMContentLoaded", () => {
//   console.log('Chart object from preload:', Chart);
// })

document.addEventListener("DOMContentLoaded", () => {
  dashboardMenu.click();
  console.log('Chart object from preload:', Chart);
});

dashboardMenu.addEventListener('click', async function () {
  document.getElementById('detailed').style.display = 'none';
  document.getElementById('dashboard-details').style.display = 'block';
  document.getElementById('dashboard-details').innerHTML = '';

  constructDashboardDetails();  

  const totalCOGS = await getCOGS('2024-01-01');
  const totalRevenue = await getTotalRevenue('2024-01-01');
  const voidCOGS = await getVoidedCOGS('2024-01-01');
  const totalReceivable = await getTotalReceivable();
  const totalPayable = await getTotalPayable();
  const totalExpenses = await getTotalExpense('2024-01-01');
  const totalInventory = await getTotalInventoryCost();

  document.getElementById('summary-purchase').innerText = `ETB ${(totalCOGS + voidCOGS).toLocaleString('en-US')}`;
  document.getElementById('summary-sales').innerText = `ETB ${totalRevenue.toLocaleString('en-US')}`;
  document.getElementById('summary-profit').innerText = `ETB ${(totalRevenue + totalReceivable - totalCOGS - totalPayable - totalExpenses).toLocaleString('en-US')}`;
  document.getElementById('summary-operating-capital').innerText = `ETB ${(totalInventory + totalReceivable - totalPayable - totalExpenses).toLocaleString('en-US')}`;  
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

async function constructDashboardDetails() {
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
      headers: ['Product', 'Total Sales (ETB)'],
      container: topProductsContainer,
    },
    {
      title: 'Recent Expenses',
      id: 'recent-expenses',
      headers: ['Expense ID', 'Category', 'Amount (ETB)', 'Date'],
      container: expensesContainer,
    },
    {
      title: 'Loans and Debits',
      id: 'loans-debits',
      headers: ['ID', 'Amount (ETB)', 'Due Date', 'Type'],
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



  const topSellingQueryType = 'SELECT'
  const topSellingQuery = `SELECT 
                                p.id,
                                p.name,
                                SUM(s.quantity_sold) AS total_units_sold,
                                SUM(s.quantity_sold * p.saling_price) AS total_revenue
                            FROM 
                                sales s
                            JOIN 
                                products p ON s.product_id = p.id
                            WHERE 
                                s.sale_date >= DATE_TRUNC('year', CURRENT_DATE)
                            GROUP BY 
                                p.id, p.name
                            ORDER BY 
                                total_units_sold DESC
                            LIMIT 5`;
  const topSellingRawData = await window.electronAPI.sendQuery('general-query', topSellingQueryType, topSellingQuery);

  const topSellingData = JSON.parse(topSellingRawData);
  const topSellingProducts = topSellingData.map(item => ({ 
    product: item.name, 
    totalSales: item.total_revenue
  }));


  const recentExpenseQuery = `SELECT 
                                  e.id, 
                                  c.name AS category, 
                                  e.amount, 
                                  e.date 
                              FROM 
                                  cat_expenses e 
                              JOIN  
                                  expense_categories c 
                              ON 
                                  e.expense_category_id = c.id 
                              WHERE 
                                  date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
                              ORDER BY 
                                  date DESC`;
  const recentExpensesRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', recentExpenseQuery);

  const recentExpenses = JSON.parse(recentExpensesRawData).map(exp => ({
    expenseId: exp.id,
    category: exp.category,
    amount: exp.amount,
    date: exp.date
  }))


  const loansDebitsQuery = `SELECT 
                              id, 
                              amount_left AS "amount", 
                              due_date AS "dueDate", 
                              'Payable' AS type
                            FROM 
                              payables
                            WHERE 
                              amount_left > 0
                            UNION ALL
                            SELECT 
                              id, 
                              amount_left  AS "amount",
                              due_date AS "dueDate", 
                              'Receivable' AS type
                            FROM 
                              receivables
                            WHERE 
                              amount_left > 0
                            ORDER BY 
                              "dueDate"`

  const loansDebitsRaw = await window.electronAPI.sendQuery('general-query', 'SELECT', loansDebitsQuery);

  const loansDebits = JSON.parse(loansDebitsRaw);

  const salesRawData = await window.electronAPI.sendQuery('general-query', 'SELECT',
    `SELECT * FROM sales`);

  const salesObjData = JSON.parse(salesRawData);

  // const salesRawData = JSON.parse(localStorage.getItem('sales-data'));





  const salesData = getSalesData(salesObjData, 18);

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
            text: 'Revenue',
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
    cell2.innerText = `${formatNumber(parseFloat(product.totalSales))}`;
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
    cell3.innerText = `${formatNumber(parseFloat(expense.amount))}`;
    cell4.innerText = formatDate(expense.date);
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
    cell2.innerText = formatNumber(parseFloat(entry.amount));
    cell3.innerText = formatDate(entry.dueDate);
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
      // console.log('sales date: ', entry.sale_date, 'formated date: ', date);
      date.setHours(0, 0, 0, 0); // Normalize the time part

      const dateString = formatLocalDate(date);

      // console.log('sales date: ', entry.sale_date, 'formated date: ', dateString);
      
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

    const formattedDate = formatLocalDate(date); // Format date as YYYY-MM-DD
    const volume = Math.round(salesMap.get(formattedDate) || 0); // Get volume or 0 if no sales on that date

    result.push({ date: formattedDate, volume });
  }

  return result.reverse();
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatNumber(number) {
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionsDigits: 2 })
}

function formatDate(dateString) {

  const dateObject = new Date(dateString);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat(navigator.language, options);
  const formattedDate = formatter.format(dateObject);

  return formattedDate;

}

async function getCOGS(start_date) {
  const query = `SELECT
                  SUM(s.quantity_sold * p.purchase_price) AS total_cogs
                  FROM 
                    sales s
                  JOIN 
                    products p ON s.product_id = p.id
                  WHERE
                    s.sale_date BETWEEN $1 AND CURRENT_DATE`; 
  const rowData = await window.electronAPI.sendQuery('general-query', 'SELECT', query, [start_date]);

  const total_cogs = JSON.parse(rowData)[0].total_cogs;
  return Math.round(parseFloat(total_cogs));
}

async function getVoidedCOGS(start_date) {
  const query = `SELECT
                  SUM(vp.void_quantity * p.purchase_price) AS void_cogs
                  FROM 
                    voided_products vp
                  JOIN 
                    products p ON vp.product_id = p.id
                  WHERE
                    vp.void_date BETWEEN $1 AND CURRENT_DATE`;
  const rowData = await window.electronAPI.sendQuery('general-query', 'SELECT', query, [start_date]);

  const total_cogs = (JSON.parse(rowData)[0].void_cogs) === null ? '0' : JSON.parse(rowData)[0].void_cogs;
  return Math.round(parseFloat(total_cogs));
}

async function getTotalRevenue(start_date) {
  const query = `SELECT SUM(total_amount) AS total_revenue
                FROM sales_order
                WHERE order_date BETWEEN $1 AND CURRENT_DATE`;

  const rowData = await window.electronAPI.sendQuery('general-query', 'SELECT', query, [start_date]);
  const total_revenue = JSON.parse(rowData)[0].total_revenue;
  return Math.round(parseFloat(total_revenue));
}

async function getTotalReceivable() {
  const query = `SELECT SUM(amount_left) AS total_receivable
                  FROM receivables
                  WHERE amount_left > 0`;

  const rowData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);
  const total_revenue = JSON.parse(rowData)[0].total_receivable;
  return Math.round(parseFloat(total_revenue));
}

async function getTotalPayable() {
  const query = `SELECT SUM(amount_left) AS total_payable
                  FROM payables
                  WHERE amount_left > 0`;

  const rowData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);
  const total_revenue = JSON.parse(rowData)[0].total_payable;
  return Math.round(parseFloat(total_revenue));
}

async function getTotalInventoryCost () {
  const query = `SELECT SUM(cs.quantity * p.purchase_price) AS total_inventory
                  FROM company_stock cs
                  JOIN products p ON cs.product_id = p.id
                  WHERE cs.quantity > 0`;

  const rowData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);
  const total = JSON.parse(rowData)[0].total_inventory;
  return Math.round(parseFloat(total));
}

async function getTotalExpense(start_date) {
  const query = `SELECT SUM(amount) AS total_expenses
                  FROM expenses
                  WHERE expense_date BETWEEN $1 AND CURRENT_DATE`;

  const rowData = await window.electronAPI.sendQuery('general-query', 'SELECT', query, [start_date]);
  const total = JSON.parse(rowData)[0].total_expenses;
  return Math.round(parseFloat(total));
}
