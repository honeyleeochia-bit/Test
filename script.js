document.addEventListener("DOMContentLoaded", () => {

  let accessToken = null;

  // DOM
  const loginBtn = document.getElementById("fbLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const statusEl = document.getElementById("status");
  const tokenBox = document.getElementById("tokenBox");
  const profileBox = document.getElementById("profile");
  const pagesList = document.getElementById("pages");
  const loadPagesBtn = document.getElementById("loadPagesBtn");

  // Login
  loginBtn.addEventListener("click", () => {
    if (typeof FB === "undefined") {
      alert("Facebook SDK not loaded.");
      return;
    }

    FB.login(response => {
      if (response.status === "connected") {
        accessToken = response.authResponse.accessToken;
        statusEl.textContent = "Logged in successfully.";
        tokenBox.textContent = "Access token received.";
        logoutBtn.disabled = false;
        fetchUserProfile();
      } else {
        statusEl.textContent = "Login failed or cancelled.";
      }
    }, {
      scope: "public_profile,pages_show_list",
      auth_type: "rerequest"
    });
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    FB.logout(() => {
      accessToken = null;
      statusEl.textContent = "Logged out.";
      tokenBox.textContent = "";
      profileBox.textContent = "";
      pagesList.innerHTML = "";
      logoutBtn.disabled = true;
    });
  });

  // Fetch profile
  function fetchUserProfile() {
    fetch(`https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`)
      .then(res => res.json())
      .then(data => {
        profileBox.textContent = JSON.stringify(data, null, 2);
      })
      .catch(() => {
        profileBox.textContent = "Failed to fetch profile.";
      });
  }

  // Load Pages
  loadPagesBtn.addEventListener("click", () => {
    if (!accessToken) {
      alert("Please login first.");
      return;
    }

    pagesList.innerHTML = "<li>Loading pages...</li>";

    fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`)
      .then(res => res.json())
      .then(data => {
        pagesList.innerHTML = "";

        if (!data.data || data.data.length === 0) {
          pagesList.innerHTML = "<li>No pages found. Create a Facebook Page first.</li>";
          return;
        }

        data.data.forEach(page => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${page.name}</strong><br>ID: ${page.id}`;
          pagesList.appendChild(li);
        });
      })
      .catch(() => {
        pagesList.innerHTML = "<li>Failed to load pages.</li>";
      });
  });

});
