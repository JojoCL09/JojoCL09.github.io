
(function () {
  const KEY = "mlpwAchievementsV1";

  const pages = [
    "index.html",
    "blog.html",
    "articles.html",
    "about.html",
    "links.html",
    "guestbook.html",
    "achievements.html"
  ];

  const info = {
    first: {
      icon: "🌸",
      name: "First Visit",
      description: "Welcome to My Little Pink World! ♡"
    },
    articles: {
      icon: "📚",
      name: "Article Explorer",
      description: "You explored the articles! ♡"
    },
    explorer: {
      icon: "🗺️",
      name: "Little Explorer",
      description: "You visited three different pages! ♡"
    }
  };

  let data;

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    data = {
      firstVisit: saved.firstVisit === true,
      articleExplorer: saved.articleExplorer === true,
      pages: Array.isArray(saved.pages)
        ? saved.pages.filter(p => pages.includes(p))
        : []
    };
  } catch {
    data = { firstVisit: false, articleExplorer: false, pages: [] };
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
  }

  const currentPage =
    location.pathname.split("/").pop() || "index.html";

  const unlocked = [];

  if (pages.includes(currentPage)) {
    if (!data.firstVisit) {
      data.firstVisit = true;
      unlocked.push("first");
    }

    if (currentPage === "articles.html" && !data.articleExplorer) {
      data.articleExplorer = true;
      unlocked.push("articles");
    }

    const hadExplorer = data.pages.length >= 3;

    if (!data.pages.includes(currentPage)) {
      data.pages.push(currentPage);
    }

    if (!hadExplorer && data.pages.length >= 3) {
      unlocked.push("explorer");
    }
  }

  save();

  // Update the badge cards on achievements.html, if present.
  function render() {
    const explorer = data.pages.length >= 3;
    const badges = [
      ["first", data.firstVisit],
      ["articles", data.articleExplorer],
      ["explorer", explorer]
    ];

    let collected = 0;

    badges.forEach(([id, earned]) => {
      const card = document.getElementById("card-" + id);
      const status = document.getElementById("status-" + id);

      if (!card || !status) return;

      card.classList.toggle("locked", !earned);
      status.textContent = earned ? "✓ Collected ♡" : "🔒 Locked";

      if (earned) collected++;
    });

    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");
    const progressTrack = document.getElementById("progressTrack");
    const progressMessage = document.getElementById("progressMessage");

    if (progressText) {
      progressText.textContent = collected + " of 3 badges collected";
    }

    if (progressFill) {
      progressFill.style.width = (collected / 3 * 100) + "%";
    }

    if (progressTrack) {
      progressTrack.setAttribute("aria-valuenow", String(collected));
    }

    if (progressMessage) {
      progressMessage.textContent = collected === 3
        ? "All badges collected! You're a pink world star ♡"
        : "Keep exploring to collect more little badges ♡";
    }
  }

  render();

  // Show achievement popups on whichever page earned them.
  const popup = document.getElementById("achievementPopup");
  const closeButton = document.getElementById("achievementPopupClose");

  if (popup && closeButton && unlocked.length) {
    let next = 0;

    function showNext() {
      if (next >= unlocked.length) {
        popup.hidden = true;
        return;
      }

      const badge = info[unlocked[next]];
      document.getElementById("achievementPopupIcon").textContent = badge.icon;
      document.getElementById("achievementPopupName").textContent = badge.name;
      document.getElementById("achievementPopupDescription").textContent =
        badge.description;

      popup.hidden = false;
      closeButton.focus();
    }

    function closePopup() {
      popup.hidden = true;
      next++;
      showNext();
    }

    closeButton.addEventListener("click", closePopup);

    popup.addEventListener("click", function (event) {
      if (event.target === popup) closePopup();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !popup.hidden) closePopup();
    });

    showNext();
  }

  // Reset button exists only on the achievements page.
  const resetButton = document.getElementById("resetButton");

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (!window.confirm("Reset all your little badges? ♡")) return;

      try {
        localStorage.removeItem(KEY);
        data = {
          firstVisit: true,
          articleExplorer: false,
          pages: ["achievements.html"]
        };
        save();
        render();

        const message = document.getElementById("resetMessage");
        if (message) message.textContent = "Your badges have been reset ♡";
      } catch {
        const message = document.getElementById("resetMessage");
        if (message) message.textContent = "Could not reset badges. Please try again.";
      }
    });
  }
})();
