import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const financialMgt = document.getElementById('financialReportMgt');
const profitLossBtn = document.getElementById('profitLossBtn');
const detailsContainer = document.body.querySelector('.details .recentOrders');

profitLossBtn.addEventListener('click', function () {

  detailsContainer.innerHTML = '';
  const profitLossContainer = profitLossTabContainer();

  detailsContainer.appendChild(profitLossContainer);

  const profitLossContent = document.getElementById('profitLoss-content');
  profitLossContent.style.display = 'block';




  const profitLossTableContainer = document.createElement('div');
  profitLossTableContainer.id = 'profitLoss-table';


  profitLossContent.appendChild(profitLossTableContainer);

  profitLossTable();

})

function profitLossTabContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "profitLoss-container"

  tabContainer.innerHTML = `<div class="tab">
                              <button id="profitLoss-tab" style="width:auto; padding: 20px 30px;">Profit/Loss</button>
                            </div>
                            <div class="tab-content" id="profitLoss-content">
    
                            </div>`;
  return tabContainer;
}

async function profitLossTable() {
  const tableHead = ['Item Description', 'Units Sold', 'Revenue', 'Units Voided', 'COGS', 'Gross Profit', 'Status'];

  let commonData = {
    tableId: "profitLoss-table",
    tableHeader: tableHead,
    tableData: []
  };

  const queryType = 'SELECT';
  const query = `SELECT 
                        p.name AS product_name,
                        SUM(s.quantity_sold) AS units_sold,
                        COALESCE(SUM(s.quantity_sold * p.saling_price), 0) AS revenue,
                        COALESCE(SUM(s.quantity_sold * p.purchase_price), 0) AS sold_cogs,
                        SUM(v.void_quantity) AS units_void,
                        COALESCE(SUM(v.void_quantity * p.purchase_price), 0) AS voided_cogs,
                        COALESCE(SUM(s.quantity_sold * p.purchase_price), 0) + COALESCE(SUM(v.void_quantity * p.purchase_price), 0) AS total_cogs,
                        COALESCE(SUM(s.quantity_sold * p.saling_price), 0) - (COALESCE(SUM(s.quantity_sold * p.purchase_price), 0) + COALESCE(SUM(v.void_quantity * p.purchase_price), 0)) AS gross_profit,
                        CASE 
                            WHEN COALESCE(SUM(s.quantity_sold * p.saling_price), 0) - (COALESCE(SUM(s.quantity_sold * p.purchase_price), 0) + COALESCE(SUM(v.void_quantity * p.purchase_price), 0)) > 0 THEN 'Profit'
                            ELSE 'Loss'
                        END AS status
                    FROM 
                        products p
                    LEFT JOIN 
                        sales s ON p.id = s.product_id
                    LEFT JOIN 
                        voided_products v ON p.id = v.product_id
                    GROUP BY 
                        p.name
                    ORDER BY 
                        product_name`;
  const expenseRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const expenseObjData = JSON.parse(expenseRawData);

  const expenseData = expenseObjData.map(stat => [
    stat.product_name,
    stat.units_sold,
    formatNumber(stat.revenue),
    stat.units_void,
    formatNumber(stat.total_cogs),
    formatNumber(stat.gross_profit),
    stat.status
  ]);

  commonData.tableData = expenseData;

  const tableObjFunc = new CreateTableFromData(commonData);

  tableObjFunc.renderTable();

  const profitLossTable = document.getElementById(commonData.tableId);
  profitLossTable.querySelectorAll("tbody tr").forEach(tr => {
    formatStatus(tr);
  })
}



function formatStatus(tr) {
  const statusElement = tr.cells[6];
  if (statusElement.textContent === 'Profit') {
    statusElement.innerHTML = `<span class="status inProgress" style="background-color:green">Profit</span>`;
  }

  if (statusElement.textContent === 'Loss') {
    statusElement.innerHTML = `<span class="status delivered" style="background-color:red">Loss</span>`;

  }
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