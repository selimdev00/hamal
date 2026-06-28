import { memo, useCallback, useRef, useState } from "react";
import { Button, Muted, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";

/**
 * SPEC 06 — useCallback + memo. The child is wrapped in React.memo and tallies
 * its own render count via a ref. The parent feeds it a stable onPing callback
 * (memoised with useCallback) plus an unrelated counter that does NOT reach the
 * child. Bumping that counter re-renders the parent but leaves the memo child
 * untouched, because the callback identity never changes.
 */

const PingProbe = memo(function PingProbe({ onPing, pings }) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <Stack $gap="var(--sp-2)">
      <Row>
        <Button $variant="primary" onClick={onPing}>
          Ping probe
        </Button>
        <Text as="span">
          pings logged <Readout>{pings}</Readout>
        </Text>
      </Row>
      <Text as="span">
        child render count <Readout>{renders.current}</Readout>
      </Text>
    </Stack>
  );
});

export default function TestUseCallback() {
  const [pings, setPings] = useState(0);
  const [noise, setNoise] = useState(0);

  // Stable identity across parent renders: noise changes never recreate this.
  const handlePing = useCallback(() => {
    setPings((n) => n + 1);
  }, []);

  return (
    <SpecimenCard
      index={6}
      name="useCallback + memo"
      category="Hooks"
      instruments={["useCallback", "React.memo", "useRef"]}
      blurb="useCallback keeps a function identity stable across renders, so a React.memo child does not re-render when unrelated parent state changes."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">memoised child</SubLabel>
        <PingProbe onPing={handlePing} pings={pings} />
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">unrelated parent state</SubLabel>
        <Row>
          <Button $variant="ghost" onClick={() => setNoise((n) => n + 1)}>
            Bump noise
          </Button>
          <Text as="span">
            noise counter <Readout>{noise}</Readout>
          </Text>
        </Row>
        <Muted>
          Bumping noise re-renders this parent, but the child render count holds
          steady because handlePing keeps a stable identity. Drop the useCallback
          deps or remove the wrapper and the same bump would tick the child count
          up on every press.
        </Muted>
      </Stack>
    </SpecimenCard>
  );
}
