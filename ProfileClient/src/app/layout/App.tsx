import { Box } from "@mui/material";
import { NavigationBar } from "./NavigationBar";
import { Outlet, ScrollRestoration } from "react-router-dom";

export default function App() {
  return (
    <>
      <ScrollRestoration />
      
      <NavigationBar />
      
      <Box
        component="main"
        sx={{
          width: "96%",
          mx: "auto",
          mt: { xs: 8, sm: 12 }, // offset for fixed AppBar height
          py: 4,
        }}
      >
        <Outlet />
      </Box>
    </>
  )
}