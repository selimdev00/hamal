import styled from "styled-components";

import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg-sunken);
`;

const Main = styled.main`
  flex-grow: 1;
  width: 100%;
  outline: none;
`;

const SkipLink = styled.a.attrs({ className: "skip-link" })``;

function DefaultLayout({ children }) {
  return (
    <Shell>
      <SkipLink href="#main">Skip to content</SkipLink>
      <Header />
      <Main id="main" tabIndex={-1}>
        {children}
      </Main>
      <Footer />
    </Shell>
  );
}

export default DefaultLayout;
