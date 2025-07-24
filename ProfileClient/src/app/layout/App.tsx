import { Container } from "@mui/material";
import { NavigationBar } from "./NavigationBar";
import { Outlet, ScrollRestoration } from "react-router-dom";

export default function App() {
  return (
    <>
      <ScrollRestoration />
      <NavigationBar />
      
      <Container maxWidth="xl" sx={{mt:12}}>
        <Outlet />
      </Container>
    </>
  )
}