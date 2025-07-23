import { Container } from "@mui/material";
import { AboutPage } from "../../features/AboutPage";
import { NavigationBar } from "./NavigationBar";

export default function App() {
  return (
    <>
      <NavigationBar />
      
      <Container maxWidth="xl" sx={{mt:12}}>
        <AboutPage />
      </Container>
    </>
  )
}