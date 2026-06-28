import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/main.scss";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

import { ThemeProvider } from "contexts/Theme";
import { AuthProvider } from "contexts/Auth";
import HomePage from "pages/Home";
import AboutPage from "pages/About";
import NotFound from "components/Errors/NotFound";
import DefaultLayout from "layouts/Default";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DefaultLayout>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
);

reportWebVitals();
