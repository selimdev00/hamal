import styled from "styled-components";

const Bar = styled.footer`
  display: grid;
  gap: var(--sp-3) var(--sp-6);
  padding: var(--sp-6) clamp(16px, 4vw, 40px);
  background: var(--bg-sunken);
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-muted);
  text-align: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    text-align: left;
  }
`;

const Cell = styled.p`
  margin: 0;
  overflow-wrap: anywhere;

  &:last-child {
    @media (min-width: 768px) {
      text-align: right;
    }
  }
`;

const Strong = styled.span`
  color: var(--fg);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Src = styled.a`
  color: var(--observe-ink);
  text-decoration: none;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom-color: currentColor;
  }
`;

export default function Footer() {
  return (
    <Bar>
      <Cell>
        <Strong>Bench Notes</Strong> · a react internals logbook
      </Cell>
      <Cell>react 18 · react-router 6 · styled-components</Cell>
      <Cell>
        © 2024 ·{" "}
        <Src
          href="https://github.com/selimdev00/learn-react-deeper"
          target="_blank"
          rel="noreferrer"
        >
          view source
        </Src>
      </Cell>
    </Bar>
  );
}
