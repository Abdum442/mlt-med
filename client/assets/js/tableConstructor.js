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
			 		                <select class  ="form-control" name="state" id="maxRows">
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
    const renderData = this.filteredData.slice(start_index, end_index + 1);

    renderData.forEach(row_data => {
      const tr = document.createElement('tr');
      row_data.forEach(data => {
        const td = document.createElement('td');
        td.innerHTML = data;
        tr.appendChild(td);
      })
      const edit_btn = clickable_dropdown_btn();
      const edit_td = document.createElement('td');
      edit_td.innerHTML = edit_btn;
      tr.appendChild(edit_td);
      table_body.appendChild(tr);

      edit_td.querySelector('.dropdown-btn .drop-btn').addEventListener('click', function (event) {
        edit_td.querySelector('.dropdown-btn .drop-btn').nextElementSibling.classList.toggle('show');
        // Prevent the click event from propagating if necessary
        event.stopPropagation();
      });
    })
    const showRowsCount = document.querySelector('.rows_count');

    showRowsCount.innerHTML = `<span>Showing ${start_index + 1} to ${end_index} of ${this.filteredData.length} entries <span>`;
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
    const action_td = document.createElement('td');
    action_td.innerHTML = "Action";
    tr.appendChild(action_td);
    table.appendChild(thead);

    table.appendChild(tbody);

    tableContainer.innerHTML = headWrap;

    tableContainer.appendChild(table);

    tableContainer.insertAdjacentHTML('beforeend', footWrap);



    const maxRowsContainer = document.getElementById('maxRows')
    const paginationContainer = document.querySelector('.pagination');


    let count = 0;

    maxRowsContainer.addEventListener('change', (event) => {
      event.preventDefault();


      count += 1;
      console.log('Count : ', count);

      const total_rows = this.filteredData.length;

      const max_rows = parseInt(maxRowsContainer.value);
      const no_pages = Math.ceil(total_rows / max_rows);

      make_table(tbody, 0, max_rows);


      paginationContainer.innerHTML = '';
      if (no_pages > 1) {
        for (let i = 1; i <= no_pages; i++) {
          paginationContainer.innerHTML += `<a href="#">${i}</a>`
        }
        paginationContainer.querySelector('a:first-child').classList.add('active');
      }
      paginationContainer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function (event) {
          event.preventDefault();

          const current_page = parseInt(a.innerHTML);

          const start_index = max_rows * (current_page - 1);
          const end_index = max_rows * current_page - 1;


          make_table(tbody, start_index, end_index);

          paginationContainer.querySelectorAll('a').forEach(function (a) {
            a.classList.remove('active');
          })
          this.classList.add('active');


        })
      })
    })

    maxRowsContainer.dispatchEvent(new Event('change'));

    this.searchFilter();

  }

  this.searchFilter = function () {

    const searchInputElement = document.getElementById("search_input_all");

    const table_data = this.tableData;

    searchInputElement.addEventListener('keyup', (event) => {

      const filter = event.target.value.toLowerCase();
      if (filter) {
        this.filteredData = table_data.filter(row => row.some(item => item.toLowerCase().includes(filter)));

        make_table(document.querySelector('tbody'), 0, this.maxRows);

        document.querySelector('.pagination').innerHTML = '';
        const no_pages = Math.ceil(this.filteredData.length / this.maxRows)
        if (no_pages > 1) {
          for (let i = 1; i <= no_pages; i++) {
            document.querySelector('.pagination').innerHTML += `<a href="#">${i}</a>`
          }
          document.querySelector('.pagination').querySelector('a:first-child').classList.add('active');
        }
      } else {
        document.getElementById('maxRows').dispatchEvent(new Event('change'));
      }

    })

  }


}

const clickable_dropdown_btn = function(){
  let btn = `<div class="dropdown-btn">
              <button class="drop-btn"><span>Edit</span> <ion-icon name="chevron-down-outline"></button>
              <div class="drop-content">
                <a href="#">Modify</a>
                <a href="#">Delete</a>
              </div>
            </div>`;
  return btn;
}


export { CreateTableFromData };