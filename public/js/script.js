// Helper: reset and activate a link with animation
function activateLink(link) {
  document.querySelectorAll(".nav-link").forEach((l) => {
    l.classList.remove("nav-active", "text-brand-sky-200");
  });
  void document.body.offsetHeight;
  requestAnimationFrame(() => {
    link.classList.add("nav-active", "text-brand-sky-200");
  });
}

// Helper function to extract filename from a path
function getFilename(path) {
  // Remove query strings and hashes
  path = path.split('?')[0].split('#')[0];
  // Remove leading ./ or / and get the filename
  return path.replace(/^\.\//, '').replace(/^.*\//, '').toLowerCase();
}

// Active link functionality
function setActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const currentFilename = getFilename(currentPath);
  const isHomePage =
    currentPath === "/" ||
    currentPath.endsWith("/index.html") ||
    currentFilename === "index.html" ||
    window.location.href.includes("index.html");

  const activeLink = Array.from(navLinks).find((link) => {
    const linkHref = link.getAttribute("href");

    // Home page link
    if (
      isHomePage &&
      (linkHref === "./index.html" ||
        linkHref === "/" ||
        linkHref === "index.html" ||
        linkHref === "./")
    ) {
      return true;
    }

    // Hash links - check if hash matches
    if (linkHref === "#" && currentHash === "") {
      return false; // Don't activate hash links when there's no hash
    }
    if (linkHref.startsWith("#") && linkHref === currentHash) {
      return true;
    }

    // Regular page links - compare filenames
    if (
      linkHref !== "/" &&
      linkHref !== "#" &&
      linkHref !== "./index.html" &&
      linkHref !== "./" &&
      !linkHref.startsWith("#")
    ) {
      const linkFilename = getFilename(linkHref);
      return currentFilename === linkFilename;
    }

    return false;
  });

  if (activeLink) {
    activateLink(activeLink);
  } else if (isHomePage && navLinks.length > 0) {
    // Default: activate first link (home) on home page
    const homeLink =
      Array.from(navLinks).find(
        (link) =>
          link.getAttribute("href") === "./index.html" ||
          link.getAttribute("href") === "/" ||
          link.getAttribute("href") === "index.html"
      ) || navLinks[0];
    activateLink(homeLink);
  } else {
    // Remove active from all if no match
    navLinks.forEach((link) =>
      link.classList.remove("nav-active", "text-brand-sky-200")
    );
  }
}

// Initialize when DOM is ready
function initActiveLink() {
  // Wait a bit to ensure all elements are rendered (especially if Alpine.js is involved)
  setTimeout(() => {
    setActiveLink();
  }, 100);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initActiveLink);
} else {
  initActiveLink();
}
window.addEventListener("hashchange", setActiveLink);
window.addEventListener("popstate", setActiveLink); // Handle browser back/forward

// Click handler
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Handle hash links
    if (href === "#" || href.startsWith("#")) {
      e.preventDefault();
      if (href !== "#") {
        window.location.hash = href;
      }
      activateLink(this);
      return;
    }

    // For other links, let them navigate normally
    // The active state will be set on the new page load
  });
});
