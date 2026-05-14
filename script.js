document.addEventListener("DOMContentLoaded", function () {
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.textContent = "Welcome to my portfolio page!";
    welcomeMessage.style.display = "block";
  }

  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      themeToggleBtn.textContent = document.body.classList.contains("dark-mode")
        ? "Switch to Light Mode"
        : "Switch to Dark Mode";
    });
  }

  function setupToggle(buttonId, contentId, visibleText, hiddenText) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    if (button && content) {
      button.addEventListener("click", function () {
        content.classList.toggle("hidden-section");
        const isHidden = content.classList.contains("hidden-section");
        button.textContent = isHidden ? visibleText : hiddenText;
      });
    }
  }

  setupToggle("toggleSkillsBtn", "skillsList", "Show Skills", "Hide Skills");
  setupToggle("toggleCertificationsBtn", "certificationsContent", "Show Certifications", "Hide Certifications");
  setupToggle("toggleProjectsBtn", "projectsContent", "Show Projects", "Hide Projects");
  
  const projectButtons = document.querySelectorAll(".project-details-btn");
  projectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const targetId = button.getAttribute("data-target");
      const detailsBox = document.getElementById(targetId);
      
      if (detailsBox) {
        const isOpen = detailsBox.classList.contains("open");
        detailsBox.classList.toggle("open");
        button.textContent = isOpen ? "Show Details" : "Hide Details";
      }
    });
  });

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        formMessage.textContent = "Please fill in all required fields.";
        formMessage.className = "form-message error";
        return;
      }

      if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.className = "form-message error";
        return;
      }

      formMessage.textContent = "Your message has been submitted successfully.";
      formMessage.className = "form-message success";
      contactForm.reset();
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const tabSections = document.querySelectorAll('.tab-section');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      
      tabSections.forEach(section => section.style.display = 'none');
      navLinks.forEach(nav => nav.classList.remove('active-link'));
      
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = 'block';
        this.classList.add('active-link');
      }
    });
  });

  // Update this value if the public GitHub handle changes.
  const githubUsername = "danielragheb";
  const fallbackProjects = [
    {
      name: "DHL Workflow Improvement System",
      description: "Academic project focused on improving handoffs between sales, pricing, operations, and billing through clearer digital workflow design.",
      language: "Systems Analysis",
      detailTarget: "dhl-details"
    },
    {
      name: "DocLog Document Archiving Concept",
      description: "Structured archive and retrieval concept using barcode-based organization, search, filtering, and document categorization.",
      language: "UX Planning",
      detailTarget: "doclog-details"
    },
    {
      name: "Backend Learning Projects",
      description: "Practice projects that build Python, API thinking, cybersecurity fundamentals, and backend problem-solving habits.",
      language: "Python",
      detailTarget: "backend-details"
    },
    {
      name: "Portfolio API Integration",
      description: "Responsive CV-style portfolio with GitHub REST API loading, graceful fallback content, navigation tabs, and dark mode.",
      language: "JavaScript"
    }
  ];

  function setGitHubStatus(statusEl, message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `github-status ${type}`;
    statusEl.hidden = !message;
  }

  function createProjectCard(project) {
    const card = document.createElement("div");
    card.className = "mini-card github-repo-card";

    const body = document.createElement("div");
    const title = document.createElement("h3");
    const description = document.createElement("p");

    title.textContent = project.name;
    description.textContent = project.description || "No description provided.";
    body.append(title, description);

    const footer = document.createElement("div");

    const meta = document.createElement("div");
    meta.className = "repo-meta";

    if (project.language) {
      const language = document.createElement("span");
      language.className = "repo-language";
      language.textContent = project.language;
      meta.appendChild(language);
    }

    if (Number.isInteger(project.stars)) {
      const stars = document.createElement("span");
      stars.className = "repo-stars";
      stars.textContent = `Stars: ${project.stars}`;
      meta.appendChild(stars);
    }

    if (meta.childElementCount > 0) {
      footer.appendChild(meta);
    }

    if (project.url || project.detailTarget) {
      const actions = document.createElement("div");
      actions.className = "repo-card-actions";

      if (project.url) {
        const link = document.createElement("a");
        link.href = project.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "action-btn";
        link.textContent = "View Source Code";
        actions.appendChild(link);
      } else {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "action-btn";
        button.textContent = "View Details";
        button.addEventListener("click", function () {
          const detailsBox = document.getElementById(project.detailTarget);
          const detailsButton = document.querySelector(`[data-target="${project.detailTarget}"]`);

          if (detailsBox && !detailsBox.classList.contains("open")) {
            detailsBox.classList.add("open");
            if (detailsButton) detailsButton.textContent = "Hide Details";
          }

          if (detailsBox) {
            detailsBox.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
        actions.appendChild(button);
      }

      footer.appendChild(actions);
    }

    card.append(body, footer);
    return card;
  }

  function renderProjects(containerEl, projects) {
    containerEl.replaceChildren();
    projects.forEach(function (project) {
      containerEl.appendChild(createProjectCard(project));
    });
  }

  async function fetchGitHubProjects() {
    const loadingEl = document.getElementById("github-loading");
    const statusEl = document.getElementById("github-status");
    const containerEl = document.getElementById("github-projects-container");

    if (!containerEl) return;

    try {
      const apiUrl = `https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=6`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`GitHub request failed with status ${response.status}`);
      }

      const repos = await response.json();
      const topRepos = repos
        .filter(function (repo) {
          return !repo.fork;
        })
        .slice(0, 4)
        .map(function (repo) {
          return {
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            url: repo.html_url
          };
        });

      if (loadingEl) loadingEl.style.display = "none";

      if (topRepos.length === 0) {
        renderProjects(containerEl, fallbackProjects);
        setGitHubStatus(statusEl, "No public GitHub repositories were found, so featured projects are shown instead.", "warning");
        return;
      }

      renderProjects(containerEl, topRepos);
      setGitHubStatus(statusEl, `Loaded latest public repositories from GitHub: @${githubUsername}.`, "success");
    } catch (error) {
      if (loadingEl) loadingEl.style.display = "none";
      renderProjects(containerEl, fallbackProjects);
      setGitHubStatus(statusEl, "Showing featured projects while live GitHub repositories are unavailable.", "warning");
      console.warn(error);
    }
  }

  fetchGitHubProjects();
});
