import { useState } from "react";
import styled from "styled-components";
import { Button, Chip, LiveRegion, Row, SpecimenCard, Stack, SubLabel } from "ui";

const OuterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-panel);
  cursor: pointer;

  &:focus-visible {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--focus-ring);
  }
`;

/**
 * SPEC 23 — Event propagation. Clicking either inner button fires its own
 * handler. "Play video" calls stopPropagation, so the outer panel handler
 * stays quiet; "Play music" lets the event bubble, so the outer fires too.
 */
export default function TestStopPropagation() {
  const [message, setMessage] = useState("");

  const fireOuter = () => setMessage("outer handler fired (bubbled)");

  return (
    <SpecimenCard
      index={23}
      name="Event propagation"
      category="Browser"
      instruments={["stopPropagation", "bubbling"]}
      blurb="Click the inner button. With stopPropagation the outer handler stays quiet; without it, the event bubbles up."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">outer region</SubLabel>
        <OuterPanel
          role="button"
          tabIndex={0}
          aria-label="Outer container - click to fire the outer handler"
          onClick={fireOuter}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fireOuter();
            }
          }}
        >
          <Row>
            <Button
              $variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                setMessage("inner fired - propagation stopped");
              }}
            >
              Play video
            </Button>
            <Button
              $variant="ghost"
              onClick={() => setMessage("inner fired - bubbled to outer")}
            >
              Play music
            </Button>
            <Chip>bubbling</Chip>
          </Row>
        </OuterPanel>
      </Stack>

      <LiveRegion $assertive>{message || "no event fired yet"}</LiveRegion>
    </SpecimenCard>
  );
}
