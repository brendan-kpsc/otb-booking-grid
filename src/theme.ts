import { createTheme } from "@mui/material/styles";

const mainTheme = createTheme({
    palette: {
        primary: {
            main: '#742774',     // Purple navbar color
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#2C3E50',
            contrastText: '#000000',
          },
          background: {
            default: '#FFFFFF',  // Page background
            paper: '#F5F5F5',    // Cards or paper elements
          },
          text: {
            primary: '#333333',  // Main text
            secondary: '#555555' // Subdued text
          }
    }
});

export default mainTheme;