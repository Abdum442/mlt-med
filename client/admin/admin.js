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



