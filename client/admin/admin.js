import { CreateTableFromData } from "../assets/js/tableConstructor.js";

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

const recentOrders = new CreateTableFromData(data);

recentOrders.renderTable();