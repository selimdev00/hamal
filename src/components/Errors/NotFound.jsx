import styled from "styled-components";
import { Link } from "react-router-dom";

import { Button } from "ui";

const Wrap = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--sp-4);
  padding: clamp(40px, 10vw, 120px) clamp(16px, 4vw, 40px);
`;

const Spec = styled.p`
  font-family: var(--font-mono);
  font-size: var(--step-4);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--fg-muted);
`;

const Line = styled.h1`
  font-size: var(--step-2);
  font-weight: 600;
  color: var(--fg);
`;

const Sub = styled.p`
  font-size: var(--step-0);
  color: var(--fg-muted);
  max-width: 44ch;
`;

export default function NotFound() {
  return (
    <Wrap>
      <Spec>SPEC 404</Spec>
      <Line>This page isn't in the catalogue.</Line>
      <Sub>
        The specimen you requested was never registered, or the page was torn out.
      </Sub>
      <Button as={Link} to="/" $variant="primary" style={{ textDecoration: "none" }}>
        Return to index
      </Button>
    </Wrap>
  );
}
