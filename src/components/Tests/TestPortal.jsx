import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Button, Chip, LiveRegion, Row, SpecimenCard, Stack, SubLabel, Text, Title } from "ui";
import useBoolean from "hooks/useBoolean";

/**
 * SPEC 21 — createPortal (modal). The dialog node is rendered into
 * document.body via createPortal, so it escapes the card's overflow and
 * z-index while staying in this component's React tree (state + handlers
 * still flow normally).
 */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-5);
  background: hsl(var(--shadow-color) / 0.45);
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  width: min(420px, 100%);
  padding: var(--sp-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  box-shadow:
    0 1px 2px hsl(var(--shadow-color) / 0.12),
    0 24px 48px -16px hsl(var(--shadow-color) / 0.35);

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px var(--focus-ring),
      0 24px 48px -16px hsl(var(--shadow-color) / 0.35);
  }
`;

export default function TestPortal() {
  const [isOpen, { setTrue: open, setFalse: close }] = useBoolean();
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    // move focus into the dialog once it is mounted into document.body
    panelRef.current?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return (
    <SpecimenCard
      index={21}
      name="createPortal (modal)"
      category="Patterns"
      status={isOpen ? "on" : "off"}
      instruments={["createPortal", "useEffect"]}
      blurb="createPortal renders the dialog into document.body, escaping parent overflow and z-index while staying in the React tree."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">mount point</SubLabel>
        <Text as="span">
          target is <Chip>document.body</Chip>, not this card.
        </Text>
        <Row>
          <Button $variant="primary" onClick={open}>
            Open dialog
          </Button>
        </Row>
        <LiveRegion>
          dialog is {isOpen ? "mounted into document.body" : "closed"}
        </LiveRegion>
      </Stack>

      {isOpen &&
        createPortal(
          <Overlay onClick={close}>
            <Panel
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => event.stopPropagation()}
            >
              <Title as="h3" id={titleId}>
                Portaled dialog
              </Title>
              <Text>
                This panel lives at the end of document.body, yet its open
                state and handlers still belong to the specimen. Press Escape
                or click the backdrop to close.
              </Text>
              <Row>
                <Button $variant="ghost" onClick={close}>
                  Close
                </Button>
              </Row>
            </Panel>
          </Overlay>,
          document.body,
        )}
    </SpecimenCard>
  );
}
