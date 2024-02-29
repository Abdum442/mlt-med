const loginBtn = document.getElementById("loginBtn");
let users;

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const userResponse = await window.electronAPI.fetchData('fetch-users-data');
  users = JSON.parse(userResponse);
})

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Perform authentication - usually an API call to a server
  const user = await authenticateUser(username, password);

  if (user) {
    // Redirect to admin or user page based on user role
    const userRole = getUserRole(user); // Fetch user role from database or server
    if (userRole === "admin") {    
      window.location.href = "admin/admin_page.html"; // Redirect to admin page
    } else if (userRole === 'user') {
      window.location.href = "user/user_page.html"; // Redirect to user page
    } else {
      alert("Invalid credentials. Please try again.");
    }
  } 
});

async function authenticateUser(username, password) {
  // Simulate authentication with hardcoded values (replace with actual logic)

  const user = users.find(u => u.username === username && u.password === password);
  localStorage.setItem('fullname', user.fullname)
  localStorage.setItem('has_pic', user.has_pic)
  return user ? user : null;
}

function getUserRole(user) {
  // Simulate getting user role from a database (replace with actual logic)
  return user.role;
}
