/**
 * MyTutor CMS Studio — JavaScript entry point.
 */
import {createRoot} from "react-dom/client";
import {ThemeToggle} from "../../../lms/static/js/components/ThemeToggle";
import "../css/cms.css";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[id^='react-theme-toggle']").forEach(el => {
    createRoot(el).render(<ThemeToggle />);
  });
});
