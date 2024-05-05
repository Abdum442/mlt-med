

function createRetailerTabs () {
  const mainContainer = document.createElement('div');
  mainContainer.id = 'main-container';
  mainContainer.className = 'mainContainer'

  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab';
  
  mainContainer.appendChild(tabContainer);

  const viewTab = document.createElement('button')
  viewTab.className = 'tab-link active';
  viewTab.id = 'view-tab';
  viewTab.textContent = 'View';



  const addTab = document.createElement('button')
  addTab.className = 'tab-link';
  addTab.id = 'add-tab';
  addTab.textContent = 'Add';



  tabContainer.appendChild(viewTab);
  tabContainer.appendChild(addTab);

  const viewContent = document.createElement('div');
  viewContent.id = 'view-content';
  viewContent.className = 'tab-content';
  viewContent.innerHTML = `<h2>Retailer Customers</h2>`
  viewContent.style.display = 'block';

  const addContent = document.createElement('div');
  addContent.id = 'add-content';
  addContent.className = 'tab-content';
  addContent.innerHTML = `<h2>Customer Registration</h2>`


  viewTab.addEventListener('click', function (event) {
    disableTabs();
    viewTab.className += " active";
    viewContent.style.display = 'block';

  })
  addTab.addEventListener('click', function (event) {
    disableTabs();
    addTab.className += " active";
    addContent.style.display = 'block';
  })

  mainContainer.appendChild(viewContent);
  mainContainer.appendChild(addContent);

  function disableTabs() {
    let i, tabContents, tabLinks;
    tabContents = document.getElementsByClassName('tab-content');
    for (i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = 'none';
    }
    tabLinks = document.getElementsByClassName('tab-link');
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(' active', '');
    }
  }
  return mainContainer;
}

const retailerTabs = {
  createRetailerTabs
};

export { retailerTabs };