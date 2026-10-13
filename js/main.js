const API = "http://localhost:5000/api";

// ---------- Place label colors ----------
function tagClass(text) {
  return "tag-" + text.toLowerCase().trim().replace(/\s+/g, "-");
}

document.querySelectorAll(".tag").forEach((tag) => {
  tag.classList.add(tagClass(tag.textContent));
});

// ---------- "Start Exploring" button ----------
const readBtn = document.getElementById("read-btn");

if (readBtn) {
  readBtn.addEventListener("click", () => {
    document.getElementById("posts").scrollIntoView({ behavior: "smooth" });
  });
}

// ---------- Highlight the current page in the menu ----------
const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// ---------- Footer year ----------
const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ---------- Hamburger menu ----------
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }
  });
}

// ---------- Login form ----------
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const message = document.getElementById("form-message");

    emailError.textContent = "";
    passwordError.textContent = "";
    message.textContent = "";
    message.style.color = "";

    let valid = true;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      emailError.textContent = "Enter a valid email, like you@example.com";
      valid = false;
    }

    if (password.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters";
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        message.style.color = "#dc2626";
        message.textContent = data.message || "Something went wrong";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("loggedInUser", data.user.email);

      message.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch {
      message.style.color = "#dc2626";
      message.textContent = "Cannot reach the server. Is the backend running?";
    }
  });
}

// ---------- Register form ----------
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm-password").value;

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmError = document.getElementById("confirm-error");
    const message = document.getElementById("form-message");

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    message.textContent = "";
    message.style.color = "";

    let valid = true;

    if (name.length < 2) {
      nameError.textContent = "Please enter your name";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      emailError.textContent = "Enter a valid email, like you@example.com";
      valid = false;
    }

    if (password.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters";
      valid = false;
    }

    if (confirm !== password) {
      confirmError.textContent = "Passwords do not match";
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch(API + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        message.style.color = "#dc2626";
        message.textContent = data.message || "Something went wrong";
        return;
      }

      message.textContent = "Account created! Redirecting to login...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } catch {
      message.style.color = "#dc2626";
      message.textContent = "Cannot reach the server. Is the backend running?";
    }
  });
}

// ---------- Create Blog form ----------
const blogForm = document.getElementById("create-blog-form");

if (blogForm) {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
  }

  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value.trim();
    const content = document.getElementById("content").value.trim();

    const titleError = document.getElementById("title-error");
    const categoryError = document.getElementById("category-error");
    const imageError = document.getElementById("image-error");
    const contentError = document.getElementById("content-error");
    const message = document.getElementById("form-message");

    titleError.textContent = "";
    categoryError.textContent = "";
    imageError.textContent = "";
    contentError.textContent = "";
    message.textContent = "";
    message.style.color = "";

    let valid = true;

    if (title.length < 5) {
      titleError.textContent = "Title must be at least 5 characters";
      valid = false;
    }

    if (category === "") {
      categoryError.textContent = "Please choose a category";
      valid = false;
    }

    if (image !== "") {
      try {
        new URL(image);
      } catch {
        imageError.textContent = "Enter a valid web address, starting with https://";
        valid = false;
      }
    }

    if (content.length < 50) {
      contentError.textContent = "Your story needs at least 50 characters";
      valid = false;
    }

    if (!valid) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(API + "/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, category, image, content }),
      });
      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        message.style.color = "#dc2626";
        message.textContent = "Your session expired. Please log in again.";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
        return;
      }

      if (!res.ok) {
        message.style.color = "#dc2626";
        message.textContent = data.message || "Something went wrong";
        return;
      }

      message.textContent = "Story published!";
      blogForm.reset();
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch {
      message.style.color = "#dc2626";
      message.textContent = "Cannot reach the server. Is the backend running?";
    }
  });
}

// ---------- Dashboard ----------
const dashPosts = document.getElementById("dash-posts");

if (dashPosts) {
  const greeting = document.getElementById("greeting");
  const postCount = document.getElementById("post-count");
  const emptyMsg = document.getElementById("empty-msg");
  const dashToken = localStorage.getItem("token");

  if (!dashToken) {
    window.location.href = "login.html";
  }

  const userName = localStorage.getItem("userName");
  greeting.textContent = userName ? "Welcome, " + userName + "!" : "Welcome!";

  async function loadPosts() {
    try {
      const res = await fetch(API + "/blogs/mine", {
        headers: { Authorization: "Bearer " + dashToken },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
      }

      const posts = await res.json();
      renderPosts(posts);
    } catch {
      emptyMsg.hidden = false;
      emptyMsg.textContent = "Cannot reach the server. Is the backend running?";
    }
  }

  function renderPosts(posts) {
    dashPosts.innerHTML = "";
    postCount.textContent = posts.length;
    emptyMsg.hidden = posts.length > 0;

    posts.forEach((post) => {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.details = post.content;

      if (post.image) {
        const img = document.createElement("img");
        img.src = post.image;
        img.alt = post.title;
        img.addEventListener("error", () => img.remove());
        card.appendChild(img);
      }

      const body = document.createElement("div");
      body.className = "card-body";

      const tag = document.createElement("span");
      tag.className = "tag " + tagClass(post.category);
      tag.textContent = post.category;

      const title = document.createElement("h3");
      title.textContent = post.title;

      const excerpt = document.createElement("p");
      excerpt.textContent =
        post.content.length > 120
          ? post.content.slice(0, 120) + "..."
          : post.content;

      const meta = document.createElement("small");
      meta.textContent = "By " + post.author + " · " + post.date;

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-small btn-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deletePost(post.id));

      actions.appendChild(deleteBtn);
      body.append(tag, title, excerpt, meta, actions);
      card.appendChild(body);
      dashPosts.appendChild(card);
    });
  }

  async function deletePost(id) {
    if (!confirm("Delete this story?")) return;

    try {
      const res = await fetch(API + "/blogs/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + dashToken },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Could not delete the story");
        return;
      }

      loadPosts();
    } catch {
      alert("Cannot reach the server. Is the backend running?");
    }
  }

  loadPosts();
}

// ---------- Place details popup ----------
const placeDetails = {
  "Beaches": "Quiet sands and clear water. Visit early in the morning or late in the afternoon, and pack sunscreen, a hat, and a reusable water bottle.",
  "Adventure": "For trekking, climbing, and outdoor thrills. Wear sturdy shoes, check the weather before you go, and tell someone your route.",
  "Culture": "Old streets, local food, and living traditions. Walk slowly, try street food, and learn a few local words.",
  "Nature": "Lakes, forests, and open skies. Go early for the calmest views, carry water, and leave no trace behind.",
  "Budget Travel": "Travel far without spending much. Book stays early, use public transport, and eat where the locals eat.",
  "History": "Temples, forts, and ancient places. Go at sunrise to avoid crowds, and hire a local guide to hear the stories."
};

function closePopup() {
  const overlay = document.querySelector(".popup-overlay");
  if (overlay) overlay.remove();
  document.body.style.overflow = "";
}

function openPopup(card) {
  closePopup();

  const category = card.querySelector(".tag").textContent.trim();
  const titleText = card.querySelector("h3").textContent;
  const storyText = card.dataset.details || card.querySelector("p").textContent;
  const metaText = card.querySelector("small").textContent;
  const cardImg = card.querySelector("img");

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup";

  const closeBtn = document.createElement("button");
  closeBtn.className = "popup-close";
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.addEventListener("click", closePopup);
  popup.appendChild(closeBtn);

  if (cardImg) {
    const img = document.createElement("img");
    img.src = cardImg.src;
    img.alt = cardImg.alt;
    popup.appendChild(img);
  }

  const tag = document.createElement("span");
  tag.className = "tag " + tagClass(category);
  tag.textContent = category;

  const title = document.createElement("h3");
  title.textContent = titleText;

  const story = document.createElement("p");
  story.textContent = storyText;

  const about = document.createElement("div");
  about.className = "popup-about";
  const aboutTitle = document.createElement("strong");
  aboutTitle.textContent = "About " + category;
  const aboutText = document.createElement("p");
  aboutText.textContent = placeDetails[category] || "More details coming soon.";
  about.append(aboutTitle, aboutText);

  const meta = document.createElement("small");
  meta.textContent = metaText;

  popup.append(tag, title, story, about, meta);
  overlay.appendChild(popup);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
}

document.addEventListener("click", (e) => {
  const tag = e.target.closest(".card .tag");
  if (tag) openPopup(tag.closest(".card"));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});
