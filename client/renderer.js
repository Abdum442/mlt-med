const responseElement = document.getElementById('response');
const content = document.getElementById("content");

// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

var dropdown = document.getElementsByClassName("dropdown-btn");

for (var i = 0; i < dropdown.length; i++) {
  (function (index) {
    dropdown[index].addEventListener("click", function (event) {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      var toggler = this.querySelector(".chevron-icon ion-icon");

      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
        toggler.setAttribute("name", "chevron-forward-outline");
      } else {
        for (var j = 0; j < dropdown.length; j++){
          (function (idx) {
            if (idx !== index) {
              var dContent = dropdown[idx].nextElementSibling;
              var tog = dropdown[idx].querySelector(".chevron-icon ion-icon");
              if (dContent && dContent.style.display === "block") {
                dContent.style.display = "none";
                tog.setAttribute("name", "chevron-forward-outline");
              }
              
              
            }
            
          })(j)
        }
        dropdownContent.style.display = "block";
        toggler.setAttribute("name", "chevron-down-outline");
      }
    });
  })(i);
}

const fullName = localStorage.getItem('fullname');
const isPic = localStorage.getItem('has_pic');

console.log('user name : ', fullName)


const userName = document.querySelector(".user-profile .dropdown .user-name");
userName.textContent = fullName;

const userAvatar = document.querySelector(".user-profile .dropdown .user-avatar");


const words = fullName.split(' ');

const initials = words.map((word) => word.charAt(0).toUpperCase()).join('');

if(isPic){
  userAvatar.innerHTML = `<span class="initials">${initials}</span>`
}



