import { AboutPage } from "../../features/AboutPage";
import { ExperiencePage } from "../../features/ExperiencePage";
import { createBrowserRouter } from  "react-router-dom";
import App from "../layout/App";
import { SkillsPage } from "../../features/SkillsPage";
import { ProjectPage } from "../../features/ProjectPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <AboutPage /> },
      { path: "about", element: <AboutPage /> }, 
      { path: "experience", element: <ExperiencePage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "projects", element: <ProjectPage /> },
    ],
  },
]);