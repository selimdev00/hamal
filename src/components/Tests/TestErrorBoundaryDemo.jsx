import { useState } from "react";
import styled from "styled-components";
import { Button, LiveRegion, Muted, Row, SpecimenCard, Stack, StatusDot, SubLabel, Text } from "ui";
import ErrorBoundary from "components/Errors/ErrorBoundary";

/**
 * SPEC 22 — Error boundary. A render-time throw from <Bomb> is caught by
 * <ErrorBoundary>, which swaps in a fault panel instead of unmounting the
 * surrounding tree. A resetKey bump remounts the boundary to recover.
 */

const FaultPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border: 1px solid var(--danger);
  border-radius: var(--r-panel);
  background: var(--danger-quiet);
`;

function Bomb({ explode }) {
  if (explode) {
    throw new Error("Bomb exploded during render");
  }
  return (
    <Row $gap="var(--sp-2)">
      <StatusDot $on />
      <Text as="span">
        specimen mounted and rendering normally
      </Text>
    </Row>
  );
}

export default function TestErrorBoundaryDemo() {
  const [explode, setExplode] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  function reset() {
    setExplode(false);
    setResetKey((k) => k + 1);
  }

  const fallback = (
    <FaultPanel>
      <Row $gap="var(--sp-2)">
        <StatusDot $tone="danger" />
        <LiveRegion $tone="danger" $assertive>
          This specimen threw during render. Caught by the error boundary.
        </LiveRegion>
      </Row>
      <Row>
        <Button $variant="ghost" onClick={reset}>
          Reset specimen
        </Button>
      </Row>
    </FaultPanel>
  );

  return (
    <SpecimenCard
      index={22}
      name="Error boundary"
      category="Patterns"
      status="off"
      instruments={["componentDidCatch", "getDerivedStateFromError"]}
      blurb="An error boundary catches a render-time throw from its subtree and shows a fallback instead of unmounting the whole app."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">subtree</SubLabel>
        <ErrorBoundary key={resetKey} fallback={fallback}>
          <Bomb explode={explode} />
        </ErrorBoundary>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">trigger</SubLabel>
        <Row>
          <Button
            $variant="danger"
            onClick={() => setExplode(true)}
            disabled={explode}
          >
            Throw error
          </Button>
        </Row>
        <Muted>
          Throwing flips a render-time error. The boundary keeps the rest of the
          card mounted. Reset remounts the boundary with a fresh key.
        </Muted>
      </Stack>
    </SpecimenCard>
  );
}
