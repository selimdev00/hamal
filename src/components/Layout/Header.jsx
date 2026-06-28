import styled from "styled-components";
import { NavLink } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { useTheme } from "contexts/Theme";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-3) var(--sp-5);
  padding: var(--sp-3) clamp(16px, 4vw, 40px);
  background: color-mix(in oklab, var(--surface) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    padding: var(--sp-4) clamp(16px, 4vw, 40px);
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  min-width: 0;
`;

const Mark = styled.span`
  width: 12px;
  height: 12px;
  border-radius: var(--r-pill);
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-quiet);
  flex: 0 0 auto;
  align-self: center;
`;

const Wordmark = styled.span`
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(0.95rem, 3vw, 1.05rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg);
  white-space: nowrap;
`;

const Subtag = styled.span`
  font-family: var(--font-mono);
  font-size: var(--step--2);
  color: var(--fg-faint);
  white-space: nowrap;

  @media (max-width: 479px) {
    display: none;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-3) var(--sp-4);
  margin-left: auto;
`;

const AuthReadout = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-muted);
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: var(--r-pill);
  background: ${(p) => (p.$on ? "var(--on)" : "var(--off)")};
  box-shadow: ${(p) => (p.$on ? "0 0 0 3px var(--observe-quiet)" : "none")};
  transition: background 200ms var(--ease);
`;

const Nav = styled.nav`
  ul {
    display: flex;
    gap: var(--sp-4);
    list-style: none;
  }
`;

const NavItem = styled(NavLink)`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--fg-muted);
  text-decoration: none;
  padding: 4px 2px;
  border-bottom: 2px solid transparent;
  transition:
    color 160ms var(--ease),
    border-color 160ms var(--ease);

  &:hover {
    color: var(--fg);
  }

  &.active {
    color: var(--fg);
    border-bottom-color: var(--accent);
  }
`;

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  background: var(--surface-2);
  cursor: pointer;

  span {
    font-family: var(--font-mono);
    font-size: var(--step--2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 9px;
    border-radius: var(--r-pill);
    color: var(--fg-faint);
    transition:
      background 200ms var(--ease),
      color 200ms var(--ease);
  }

  span[data-active="true"] {
    background: var(--accent);
    color: var(--accent-ink);
  }
`;

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <Bar>
      <Brand>
        <Mark aria-hidden="true" />
        <Wordmark>Bench Notes</Wordmark>
        <Subtag>react internals logbook</Subtag>
      </Brand>

      <Right>
        <AuthReadout>
          <Dot $on={isAuthenticated} aria-hidden="true" />
          auth {isAuthenticated ? "on" : "off"}
        </AuthReadout>

        <Nav aria-label="Primary">
          <ul>
            <li>
              <NavItem to="/" end>
                Index
              </NavItem>
            </li>
            <li>
              <NavItem to="/about">Colophon</NavItem>
            </li>
          </ul>
        </Nav>

        <Toggle
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
          aria-pressed={dark}
        >
          <span data-active={!dark}>Light</span>
          <span data-active={dark}>Dark</span>
        </Toggle>
      </Right>
    </Bar>
  );
}
