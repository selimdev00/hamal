import styled from "styled-components";
import { Link } from "react-router-dom";

const Page = styled.div`
  max-width: 72ch;
  margin: 0 auto;
  padding: clamp(40px, 8vw, 96px) clamp(16px, 4vw, 40px);
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
`;

const Kicker = styled.p`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--fg-faint);
`;

const Title = styled.h1`
  font-size: var(--step-3);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--fg);
`;

const Lead = styled.p`
  font-size: var(--step-1);
  line-height: 1.6;
  color: var(--fg);
`;

const Section = styled.section`
  display: grid;
  gap: var(--sp-2);
  padding-top: var(--sp-5);
  border-top: 1px solid var(--border);

  @media (min-width: 640px) {
    grid-template-columns: 9rem 1fr;
    gap: var(--sp-5);
  }
`;

const Label = styled.h2`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--observe-ink);
`;

const Body = styled.p`
  font-size: var(--step-0);
  line-height: 1.6;
  color: var(--fg-muted);
  max-width: 62ch;

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--observe-quiet);
    color: var(--observe-ink);
    padding: 1px 5px;
    border-radius: var(--r-chip);
  }
`;

const Back = styled(Link)`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-ink);
  text-decoration: none;
  width: fit-content;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 2px;

  &:hover {
    color: var(--fg);
  }
`;

export default function AboutPage() {
  return (
    <Page>
      <header>
        <Kicker>Colophon</Kicker>
        <Title>Bench Notes</Title>
      </header>

      <Lead>
        Bench Notes is a working logbook of React internals - twenty-eight specimens you can
        actuate and measure in the browser. Each one isolates a single mechanism: a custom hook,
        a higher-order component, a reducer, an escape hatch out of the render cycle.
      </Lead>

      <Section>
        <Label>Scope</Label>
        <Body>
          Core and concurrent hooks, the HOC and render-prop patterns, compound components,
          controlled vs. uncontrolled refs, <code>useReducer</code> with and without Immer, an
          external store, portals and error boundaries, the class lifecycle next to its{" "}
          <code>useEffect</code> equivalent, and two browser-level controls people always trip
          on: debounce and throttle.
        </Body>
      </Section>

      <Section>
        <Label>Stack</Label>
        <Body>
          React 18, React Router 6, styled-components, an OKLCH design system, no UI framework.
          Build tooling is the original ejected Create React App.
        </Body>
      </Section>

      <Section>
        <Label>Reading</Label>
        <Body>
          Open a specimen, read its instruments row, then drive the bench and watch the readout.
          The lifecycle specimens log to the console - open devtools to follow along.
        </Body>
      </Section>

      <Back to="/">← Back to index</Back>
    </Page>
  );
}
