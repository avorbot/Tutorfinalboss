/**
 * MyTutor LMS — Main JavaScript entry point.
 * React components are mounted into Django template placeholders.
 */
import {createRoot} from "react-dom/client";
import {Navbar} from "./components/Navbar";
import {ThemeToggle} from "./components/ThemeToggle";
import "../css/theme.css";

function mount(id, Component, props = {}) {
  const el = document.getElementById(id);
  if (el) {
    const propsData = el.dataset.props ? JSON.parse(el.dataset.props) : props;
    createRoot(el).render(<Component {...propsData} />);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mount("react-navbar", Navbar);
  document.querySelectorAll("[id^='react-theme-toggle']").forEach(el => {
    createRoot(el).render(<ThemeToggle />);
  });
});
