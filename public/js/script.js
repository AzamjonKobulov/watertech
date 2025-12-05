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

// Active link functionality
function setActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const isHomePage =
    currentPath === "/" ||
    currentPath.endsWith("/index.html") ||
    window.location.href.includes("index.html");

  const activeLink = Array.from(navLinks).find((link) => {
    const linkHref = link.getAttribute("href");

    // Home page link
    if (
      isHomePage &&
      (linkHref === "./index.html" ||
        linkHref === "/" ||
        linkHref === "index.html")
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

    // Regular page links
    if (
      linkHref !== "/" &&
      linkHref !== "#" &&
      linkHref !== "./index.html" &&
      !linkHref.startsWith("#")
    ) {
      return currentPath.includes(linkHref);
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setActiveLink);
} else {
  setActiveLink();
}
window.addEventListener("hashchange", setActiveLink);

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
