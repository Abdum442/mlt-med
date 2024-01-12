import { CreateTableFromData } from "../assets/js/tableConstructor.js";
import { purchaseForm } from '../assets/js/purchaseForm.js';

let tableHeader = ['Name', 'Price', 'Payment', 'Status'];

let tableData = [['Star Refrigerator', '$1200', 'Paid', 'Delivered'],
                 ['Dell Laptop', '$110', 'Due', 'Pending'],
                 ['Apple Watch', '$1200', 'Paid', 'Return'],
                 ['Addidas Shoes', '$620', 'Due', 'In Progress'],
                 ['Star Refrigerator', '$1200', 'Paid', 'Delivered'],
                 ['Dell Laptop', '$110', 'Due', 'Pending'],
                 ['Apple Watch', '$1200', 'Paid', 'Return'],
                 ['Addidas Shoes', '$620', 'Due', 'In Progress'],
                ['Star Refrigerator', '$1200', 'Paid', 'Delivered'],
                ['Dell Laptop', '$110', 'Due', 'Pending'],
                ['Apple Watch', '$1200', 'Paid', 'Return'],
                ['Addidas Shoes', '$620', 'Due', 'In Progress'],
                ['Star Refrigerator', '$1200', 'Paid', 'Delivered'],
                ['Dell Laptop', '$110', 'Due', 'Pending'],
                ['Apple Watch', '$1200', 'Paid', 'Return'],
                ['Addidas Shoes', '$620', 'Due', 'In Progress'],
                ['Star Refrigerator', '$1200', 'Paid', 'Delivered'],
                ['Dell Laptop', '$110', 'Due', 'Pending'],
                ['Apple Watch', '$1200', 'Paid', 'Return'],
                ['Addidas Shoes', '$620', 'Due', 'In Progress'],
                ['Star Refrigerator', '$1200', 'Paid', 'Delivered'],
                ['Dell Laptop', '$110', 'Due', 'Pending'],
                ['Apple Watch', '$1200', 'Paid', 'Return'],
                ['Addidas Shoes', '$620', 'Due', 'In Progress']];

const data = {
  tableId : "recent_orders",
  tableHeader: tableHeader,
  tableData : tableData
};

const mainContainer = document.getElementById("recent_orders");

const supplierBtn = document.getElementById("supplier");

supplierBtn.addEventListener("click", function (event) {
  const recentOrders = new CreateTableFromData(data);

  recentOrders.renderTable();
  const title = '<h2>Supplier Companies</h2>';
  mainContainer.insertAdjacentHTML('afterbegin', title)

})

const addSupplierBtn = document.getElementById("addSupplier");

addSupplierBtn.addEventListener("click", function(event) {

  // Use the functions from the purchaseForm object
  purchaseForm.showPurchaseForm();
  // purchaseForm.savePurchase();
  // purchaseForm.exitForm();
})






// function click_btn(clicked_btn){
//   clicked_btn.querySelector('.drop-content').classList.toggle("show");
// }





window.onclick = function(event){
  if (!event.target.matches(".drop-btn")){
    let dropdowns = document.getElementsByClassName("drop-content");
    let i;
    for(i = 0; i < dropdowns.length; i++){
      let openDropdown = dropdowns[i];
      if(openDropdown.classList.contains('show')){
        openDropdown.classList.remove('show');
      }
    }
  }
}




