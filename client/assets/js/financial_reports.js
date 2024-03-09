import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const taxReportsBtn = document.getElementById('taxReportsBtn');
const profitLossBtn = document.getElementById('profitLossBtn');
const pageTitle = document.querySelector('#recent_orders .cardHeader h2');


const taxReportTableHeader = ['ID', 'Item', 'Tax Collected', 'Tax Withheld'];
const profitLossTableHeader = ['ID', 'Item', 'Total Cost', 'Revenue', 'Unsold Cost', 'Void Cost', 'Profit/Loss'];

let commonData = {
  tableId: "mainContainer",
  tableHeader: [],
  tableData: []
};

taxReportsBtn.addEventListener('click', updateTaxReports);
profitLossBtn.addEventListener('click', updateProfitLoss);

function updateTaxReports() {
  pageTitle.innerHTML = 'Tax Report'
  const salesData = JSON.parse(localStorage.getItem('sales-data'));
  const purchaseData = JSON.parse(localStorage.getItem('purchase-data'))

  const taxReportTableData = JSON.parse(localStorage.getItem('products-data')).map(product =>{
    let tax_collected = 0; let tax_payable = 0.00;
    for (const sales of salesData) {
      if(product.id == sales.product_id){

        tax_collected += Number(sales.tax_withheld);
      }
    }
    for (const purchase of purchaseData) {
      if (product.id == purchase.product_id){
        tax_payable = Number(purchase.tax_withheld);
      }
    }
    console.log('tax_payable: ', tax_payable);
    return [product.id, product.name, tax_collected.toFixed(2).toLocaleString(), tax_payable.toFixed(2).toLocaleString()];
  });
  commonData.tableHeader = taxReportTableHeader;
  commonData.tableData = taxReportTableData;

  const taxReportTable = new CreateTableFromData(commonData);
  taxReportTable.renderTable();
}

function updateProfitLoss() {
  pageTitle.innerHTML = "Profit/Loss Report"
  const salesData = JSON.parse(localStorage.getItem('sales-data'));
  const purchaseData = JSON.parse(localStorage.getItem('purchase-data'));
  const stockData = JSON.parse(localStorage.getItem('stock-data'));
  const productData = JSON.parse(localStorage.getItem('products-data'));

  const profitLossTableData = productData.map(product => {
    let cost; let total_sold = 0; let unsold_qty; let void_qty = 0;
    for(const purchase of purchaseData) {
      if (product.id == purchase.product_id) {
        cost = parseFloat(purchase.amount_paid);
      }
    }
    for (const stock of stockData) {
      if (product.id == stock.product_id) {
        unsold_qty = parseInt(stock.quantity) * parseFloat(product.purchase_price);
      }
    }
    for (const sales of salesData) {
      if (product.id == sales.product_id) {
        total_sold += parseFloat(sales.amount_received);
      }
    }
    const profit_loss = total_sold + unsold_qty - cost;
    return [product.id, product.name, isNaN(cost) ? 0.00 : cost.toLocaleString(), isNaN(total_sold) ? 0.00 : total_sold.toLocaleString(), 
      isNaN(unsold_qty) ? 0.00 : unsold_qty.toLocaleString(), isNaN(void_qty) ? 0.00 : void_qty.toLocaleString(), isNaN(profit_loss) ? 0.00 : profit_loss.toLocaleString()];
  });

  commonData.tableHeader = profitLossTableHeader;
  commonData.tableData = profitLossTableData;

  const profitLossTable = new CreateTableFromData(commonData);
  profitLossTable.renderTable();

}


