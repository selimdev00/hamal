import { useEffect, useId, useRef, useState } from "react";
import styled, { css } from "styled-components";

/* ============================================================
   Bench Notes — design system primitives
   Every specimen consumes these. Tokens come from main.scss.
   ============================================================ */

/* ---------- layout ---------- */

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${(p) => p.$gap || "var(--sp-4)"};
  min-width: 0;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(p) => p.$gap || "var(--sp-3)"};
  min-width: 0;

  > * {
    min-width: 0;
  }
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid var(--border);
  width: 100%;
  margin: var(--sp-1) 0;
`;

/* ---------- type ---------- */

export const Title = styled.h2`
  font-family: var(--font-sans);
  font-size: var(--step-1);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--fg);
`;

export const SubLabel = styled.span`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-muted);
`;

export const Text = styled.p`
  font-size: var(--step-0);
  line-height: 1.55;
  color: var(--fg);
  overflow-wrap: anywhere;
`;

export const Muted = styled.p`
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--fg-muted);
  overflow-wrap: anywhere;
`;

/* an observed live value: mono, tabular, viridian */
export const Readout = styled.span`
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: ${(p) => p.$size || "var(--step-0)"};
  color: var(--observe);
  font-weight: 600;
`;

/* inline API token chip */
export const Chip = styled.code`
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  line-height: 1;
  padding: 3px 6px;
  border-radius: var(--r-chip);
  background: var(--observe-quiet);
  color: var(--observe-ink);
  white-space: nowrap;
`;

/* block code panel */
export const CodePanel = styled.pre`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  line-height: 1.5;
  padding: var(--sp-3);
  border-radius: var(--r-panel);
  background: var(--surface-3);
  color: var(--fg);
  border: 1px solid var(--border);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;

/* ---------- controls ---------- */

const variantStyles = {
  primary: css`
    background: var(--accent);
    color: var(--accent-ink);
    border-color: var(--accent);
    &:hover {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--fg);
    border-color: var(--border-strong);
    &:hover {
      background: var(--surface-2);
    }
  `,
  danger: css`
    background: transparent;
    color: var(--danger-ink);
    border-color: var(--danger);
    &:hover {
      background: var(--danger-quiet);
    }
  `,
};

export const Button = styled.button`
  font-family: var(--font-sans);
  font-size: var(--step-0);
  font-weight: 500;
  line-height: 1;
  min-height: 44px;
  min-width: 44px;
  padding: 0.5em 1em;
  border: 1px solid transparent;
  border-radius: var(--r-control);
  cursor: pointer;
  transition:
    background 120ms ease-out,
    border-color 120ms ease-out,
    transform 80ms ease-out;
  ${(p) => variantStyles[p.$variant] || variantStyles.primary}

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const fieldBase = css`
  font-family: var(--font-mono);
  font-size: max(16px, var(--step-0));
  min-height: 44px;
  width: 100%;
  padding: 0.5em 0.75em;
  background: var(--surface);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: var(--r-control);
  transition:
    border-color 120ms ease-out,
    box-shadow 120ms ease-out;

  &:focus-visible {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--focus-ring);
  }

  &::placeholder {
    color: var(--fg-faint);
  }
`;

export const Input = styled.input`
  ${fieldBase}
`;

export const Select = styled.select`
  ${fieldBase}
  cursor: pointer;
`;

export const Check = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  margin: 0;
  border: 1px solid var(--border-strong);
  border-radius: var(--r-chip);
  background: var(--surface);
  cursor: pointer;
  display: inline-grid;
  place-content: center;
  transition:
    background 120ms ease-out,
    border-color 120ms ease-out;

  &::before {
    content: "";
    width: 11px;
    height: 11px;
    transform: scale(0);
    transition: transform 120ms var(--ease);
    box-shadow: inset 1em 1em var(--accent-ink);
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked {
    background: var(--observe);
    border-color: var(--observe);
  }

  &:checked::before {
    transform: scale(1);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--focus-ring);
  }
`;

/* labeled field components (always accessible) */

const FieldShell = styled.label`
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  min-width: 0;
  flex: 1 1 auto;
`;

const FieldLabel = styled.span`
  font-family: var(--font-mono);
  font-size: var(--step--2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-faint);

  ${(p) =>
    p.$hidden &&
    css`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `}
`;

export function Field({ label, hideLabel = false, inputRef, ...props }) {
  return (
    <FieldShell>
      <FieldLabel $hidden={hideLabel}>{label}</FieldLabel>
      <Input ref={inputRef} {...props} />
    </FieldShell>
  );
}

export function SelectField({ label, hideLabel = false, children, selectRef, ...props }) {
  return (
    <FieldShell>
      <FieldLabel $hidden={hideLabel}>{label}</FieldLabel>
      <Select ref={selectRef} {...props}>
        {children}
      </Select>
    </FieldShell>
  );
}

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  min-height: 44px;
  cursor: pointer;
  font-size: var(--step-0);
  color: var(--fg);

  ${(p) =>
    p.$done &&
    css`
      color: var(--fg-faint);
      text-decoration: line-through;
    `}
`;

export function CheckboxField({ label, checked, onChange, done = false, ...props }) {
  return (
    <CheckRow $done={done}>
      <Check checked={checked} onChange={onChange} {...props} />
      <span>{label}</span>
    </CheckRow>
  );
}

/* ---------- states ---------- */

export const EmptyFrame = styled.div`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
  text-align: center;
  padding: var(--sp-5);
  border: 1px dashed var(--border-strong);
  border-radius: var(--r-panel);
`;

export const LiveRegion = styled.p.attrs((p) => ({
  role: "status",
  "aria-live": p.$assertive ? "assertive" : "polite",
}))`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  min-height: 1.5em;
  color: ${(p) => (p.$tone === "danger" ? "var(--danger-ink)" : "var(--observe-ink)")};
  overflow-wrap: anywhere;
`;

/* ---------- status dot ---------- */

export const StatusDot = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: var(--r-pill);
  flex: 0 0 auto;
  background: ${(p) =>
    p.$on ? "var(--on)" : p.$tone === "danger" ? "var(--danger)" : "var(--off)"};
  box-shadow: ${(p) => (p.$on ? "0 0 0 3px var(--observe-quiet)" : "none")};
  transition:
    background 200ms var(--ease),
    box-shadow 200ms var(--ease);
`;

/* ---------- scroll reveal ---------- */

export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08, ...options },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView];
}

/* ---------- the signature element: SpecimenCard ---------- */

const CardRoot = styled.section`
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid ${(p) => (p.$fault ? "var(--danger)" : "var(--border)")};
  border-radius: var(--r-card);
  overflow: hidden;
  box-shadow:
    0 1px 2px hsl(var(--shadow-color) / 0.06),
    0 6px 16px -10px hsl(var(--shadow-color) / 0.12);
`;

const CardHead = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4) var(--sp-5);
  background: ${(p) => (p.$fault ? "var(--danger-quiet)" : "var(--surface-2)")};
  border-bottom: 1px solid ${(p) => (p.$fault ? "var(--danger)" : "var(--border)")};
`;

const HeadTop = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--sp-2) var(--sp-3);
`;

const SpecId = styled.span`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--fg-faint);
  letter-spacing: 0.04em;
`;

const Category = styled.span`
  font-family: var(--font-mono);
  font-size: var(--step--2);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-faint);
  margin-left: auto;
`;

const HeadControl = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--sp-2);
`;

const Instruments = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
`;

const Blurb = styled.p`
  font-size: var(--step--1);
  font-style: italic;
  color: var(--fg-muted);
  line-height: 1.5;
  max-width: 64ch;
`;

const Bench = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--sp-4);
  padding: var(--sp-5);
`;

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function SpecimenCard({
  index,
  total = 28,
  name,
  category,
  instruments = [],
  status,
  fault = false,
  blurb,
  control,
  index2, // optional staggered reveal seed
  children,
}) {
  const headingId = useId();
  const [ref, inView] = useInView();
  const delay = ((index2 ?? index ?? 0) % 4) * 40;

  return (
    <CardRoot
      as="section"
      ref={ref}
      data-reveal=""
      className={inView ? "is-visible" : ""}
      style={{ transitionDelay: `${delay}ms` }}
      aria-labelledby={headingId}
      $fault={fault}
    >
      <CardHead $fault={fault}>
        <HeadTop>
          {status !== undefined && (
            <StatusDot $on={status === "on" || status === true} $tone={fault ? "danger" : undefined} />
          )}
          <SpecId>
            SPEC {pad2(index)}/{pad2(total)}
          </SpecId>
          <Title as="h2" id={headingId}>
            {name}
          </Title>
          {control ? <HeadControl>{control}</HeadControl> : <Category>{category}</Category>}
        </HeadTop>
        {control && <Category style={{ marginLeft: 0 }}>{category}</Category>}
        {instruments.length > 0 && (
          <Instruments>
            {instruments.map((i) => (
              <Chip key={i}>{i}</Chip>
            ))}
          </Instruments>
        )}
        {blurb && <Blurb>{blurb}</Blurb>}
      </CardHead>
      <Bench>{children}</Bench>
    </CardRoot>
  );
}

/* re-export for theme + auth consumers */
export { default as useAuth } from "../hooks/useAuth";

/* small helper: visually-hidden */
export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
