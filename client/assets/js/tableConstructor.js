function CreateTableFromData(combined_data) {
  this.tableId = combined_data.tableId;
  this.tableHeader = combined_data.tableHeader;
  this.tableData = combined_data.tableData;
  this.filteredData = combined_data.tableData;
  this.maxRows = 10;

  const make_headWrap = function () {
    return `<div class="header_wrap">
                      <div class="num_rows">
		                    <div class="form-group">
                        <span>Show </span>
			 		                <select class="form-control" name="state" id="maxRows">
						                <option value="10">10</option>
						                <option value="20">20</option>
						                <option value="50">50</option>
						                <option value="100">100</option>
                            <option value="5000">ALL</option>
						              </select> <span> Rows</span>
			 		              </div>
                      </div>
                      <div class="tb_search">
                        <input type="text" id="search_input_all"  
                            placeholder="Search.." class="form-control">
                      </div>
                    </div>`;
  }

  const make_footWrap = function () {
    return `<div class="footer"><div class="pagination"></div>
            <div class="rows_count"><span>Showing 11 to 20 of 91 entries</span></div></div>`
  }

  const make_table = function (table_body, start_index, end_index) {
    table_body.innerHTML = '';
    const renderData = this.filteredData.slice(start_index, end_index);

    renderData.forEach(row_data => {
      const tr = document.createElement('tr');
      row_data.forEach(data => {
        const td = document.createElement('td');
        td.innerHTML = data;
        tr.appendChild(td);
      })

      // const edit_btn = clickable_dropdown_btn();
      // const edit_td = document.createElement('td');
      // edit_td.innerHTML = edit_btn;
      // tr.appendChild(edit_td);
      table_body.appendChild(tr);
    })
    
  }.bind(this);


  this.renderTable = function () {
    let tableContainer = document.getElementById(this.tableId);

    const headWrap = make_headWrap();
    const footWrap = make_footWrap();

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const tr = document.createElement('tr');
    thead.appendChild(tr);
    this.tableHeader.forEach(title => {
      const td = document.createElement('td');
      td.innerText = title;
      tr.appendChild(td);
    })

    // const action_td = document.createElement('td');
    // action_td.innerHTML = "Action";
    // tr.appendChild(action_td);
    table.appendChild(thead);

    table.appendChild(tbody);

    tableContainer.innerHTML = headWrap;

    tableContainer.appendChild(table);

    tableContainer.insertAdjacentHTML('beforeend', footWrap);

    make_table(tbody, 0, this.tableData.length);



    const maxRowsContainer = document.getElementById('maxRows')
    const paginationContainer = document.querySelector('.pagination');

    maxRowsContainer.addEventListener('change', (event) => {
      event.preventDefault();


      const total_rows = this.filteredData.length;

      const max_rows = parseInt(maxRowsContainer.value);
      let trnum = 0;
      tbody.querySelectorAll('tr').forEach(function (tr, index) {
        trnum++;

        if (trnum > max_rows) {
          tr.style.display = 'none';
        }
        if (trnum <= max_rows) {
          tr.style.display = '';
        }
      });



      const no_pages = Math.ceil(total_rows / max_rows);


      paginationContainer.innerHTML = '';
      if (no_pages > 1) {
        for (let i = 1; i <= no_pages; i++) {
          paginationContainer.innerHTML += `<a href="#">${i}</a>`
        }
        paginationContainer.querySelector('a:first-child').classList.add('active');
      }

      showRowsCount(max_rows, 1, total_rows);

      paginationContainer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function (event) {
          event.preventDefault();

          const current_page = parseInt(a.innerHTML);

          let trIndex = 0;

          paginationContainer.querySelectorAll('a').forEach(function (a) {
            a.classList.remove('active');
          });

          this.classList.add('active');

          showRowsCount(max_rows, current_page, total_rows);

          tbody.querySelectorAll('tr').forEach(function (tr) {
            trIndex++;
            if (trIndex > max_rows * current_page || trIndex <= max_rows * current_page - max_rows) {
              tr.style.display = 'none';
            } else {
              tr.style.display = '';
            }
          });
        });
      });
    });

    maxRowsContainer.dispatchEvent(new Event('change'));

    this.searchFilter();

  }

  this.searchFilter = function () {

    const searchInputElement = document.getElementById("search_input_all");

    // const table_data = this.tableData;



    searchInputElement.addEventListener('keyup', (event) => {

      const filter = event.target.value.toLowerCase();
      if (filter) {
        document.getElementById('maxRows').dispatchEvent(new Event('change'));
        document.getElementById('maxRows').value = '5000';
        document.getElementById(this.tableId).querySelector('.rows_count').innerHTML = '';
        document.getElementById(this.tableId).querySelector('.pagination').innerHTML = '';
        // this.filteredData = table_data.filter(row => row.some(item => item.toLowerCase().includes(filter)));

        // make_table(document.querySelector('tbody'), 0, this.maxRows);
        let flag;
        const numCol = this.tableData[0].length;

        const tbody = document.getElementById(this.tableId).querySelector('table tbody');

        tbody.querySelectorAll('tr').forEach(function (tr) {
          flag = 0;
          tr.querySelectorAll('td').forEach(function (td, idx) {
            if (idx < numCol){
              const td = tr.children[idx];
              const tdText = td.innerHTML.toLowerCase();
              if (tdText.includes(filter)) {
                flag = 1;
              }
            }
            if(flag === 1) {
              tr.style.display = '';
            } else {
              tr.style.display = 'none';
            }
          });
        });
      } else {
        
        document.getElementById('maxRows').dispatchEvent(new Event('change'));
        
      }

    })

  }


}

const clickable_dropdown_btn = function(table){
  let btn = `<div class="dropdown-btn">
              <button type="button" class="drop-btn"><span>Edit</span> <ion-icon name="chevron-down-outline"></button>
              <div class="drop-content">
                <a href="#" class="modify">Modify</a>
                <a href="#" class="delete">Delete</a>
              </div>
            </div>`;

  const actionTitle = '<td>Action</td>';
  table.querySelector('thead tr').insertAdjacentHTML('beforeEnd', actionTitle);
  table.querySelectorAll('tbody tr').forEach(function (tr) {
    const td = `<td>${btn}</td>`;
    tr.insertAdjacentHTML('beforeend', td);
  });
}

function showRowsCount(max_rows, page_num, total_rows){
  const end_index = max_rows * page_num > total_rows ? total_rows : max_rows * page_num;
  const start_index = max_rows * page_num - max_rows + 1;
  const rowsCount = document.querySelector('.rows_count');

  rowsCount.innerHTML = `<span>Showing ${start_index} to ${end_index} of ${total_rows} entries <span>`;
}




export { CreateTableFromData, clickable_dropdown_btn };