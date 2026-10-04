// Give each place label its own color class
function tagClass(text) {
  return "tag-" + text.toLowerCase().trim().replace(/\s+/g, "-");
}

document.querySelectorAll(".tag").forEach((tag) => {
  tag.classList.add(tagClass(tag.textContent));
});
// 1. "Start Exploring" button scrolls down to the posts
const readBtn = document.getElementById("read-btn");

if (readBtn) {
  readBtn.addEventListener("click", () => {
    document.getElementById("posts").scrollIntoView({ behavior: "smooth" });
  });
}

// 2. Highlight the navbar link for the page you're on
const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// 3. Keep the footer year up to date automatically
const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Hamburger menu
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  // close the menu when clicking anywhere outside it
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }
  });
}
// Place details popup
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

  // clicking the dark background closes the popup
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
}

// open the popup when a place label on a card is clicked
document.addEventListener("click", (e) => {
  const tag = e.target.closest(".card .tag");
  if (tag) openPopup(tag.closest(".card"));
});

// Escape key closes the popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});

// Login form
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the page from reloading

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const message = document.getElementById("form-message");

    // clear old messages
    emailError.textContent = "";
    passwordError.textContent = "";
    message.textContent = "";

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

    // demo only: remember that the user is "logged in"
    localStorage.setItem("loggedInUser", email);
    message.textContent = "Login successful! Welcome back.";

    // enable this once dashboard.html exists (Day 4):
    // window.location.href = "dashboard.html";
  });
}

// Register form
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
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

    // clear old messages
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    message.textContent = "";

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

    // demo only: save name and email (never the password)
    localStorage.setItem("userName", name);
    localStorage.setItem("loggedInUser", email);

    message.textContent = "Account created! Redirecting to login...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
}
// Create Blog form
const blogForm = document.getElementById("create-blog-form");

if (blogForm) {
  blogForm.addEventListener("submit", (e) => {
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

    // clear old messages
    titleError.textContent = "";
    categoryError.textContent = "";
    imageError.textContent = "";
    contentError.textContent = "";
    message.textContent = "";

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

    // build the new post
    const post = {
      id: Date.now(),
      title: title,
      category: category,
      image: image,
      content: content,
      author: localStorage.getItem("userName") || "Guest",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    // load old posts, add the new one, save again
    let posts = [];
    try {
      posts = JSON.parse(localStorage.getItem("posts")) || [];
    } catch {
      posts = [];
    }

    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));

    message.textContent = "Story published!";
    blogForm.reset();

    // enable this once dashboard.html exists (Day 4):
    // window.location.href = "dashboard.html";
  });
}

// Dashboard
const dashPosts = document.getElementById("dash-posts");

if (dashPosts) {
  const greeting = document.getElementById("greeting");
  const postCount = document.getElementById("post-count");
  const emptyMsg = document.getElementById("empty-msg");

  // greet the user by name
  const userName = localStorage.getItem("userName");
  greeting.textContent = userName ? "Welcome, " + userName + "!" : "Welcome!";

  setTimeout(() => {
  window.location.href = "dashboard.html";
}, 1000);

  // read saved posts safely
  function getPosts() {
    try {
      return JSON.parse(localStorage.getItem("posts")) || [];
    } catch {
      return [];
    }
  }

  // build and show all the cards
  function renderPosts() {
    const posts = getPosts();

    dashPosts.innerHTML = "";
    postCount.textContent = posts.length;
    emptyMsg.hidden = posts.length > 0;

    // newest first
    posts.slice().reverse().forEach((post) => {
      const card = document.createElement("article");
      card.className = "card";

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

  // remove one post by its id
  function deletePost(id) {
    if (!confirm("Delete this story?")) return;

    const remaining = getPosts().filter((post) => post.id !== id);
    localStorage.setItem("posts", JSON.stringify(remaining));
    renderPosts();
  }

  renderPosts();
}
