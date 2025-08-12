import { AboutPage } from "../../features/About/AboutPage";
import { ExperiencePage } from "../../features/Experience/ExperiencePage";
import { createBrowserRouter } from  "react-router-dom";
import App from "../layout/App";
import { SkillsPage } from "../../features/Skills/SkillsPage";
import { ProjectPage } from "../../features/Project/ProjectPage";
import { JobMatchPage } from "../../features/JobMatch/JobMatchPage";

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
      { path: "jobmatch", element: <JobMatchPage /> },
    ],
  },
]);