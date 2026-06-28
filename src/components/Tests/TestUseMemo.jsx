import { useMemo, useRef, useState } from "react";
import {
  Button,
  Field,
  LiveRegion,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";

/**
 * SPEC 05 — useMemo. A labeled number field "n" feeds an intentionally slow
 * fibonacci. The result is memoized on n, so bumping the unrelated counter
 * forces a re-render WITHOUT recomputing. A ref counts factory runs to prove it.
 */
function slowFib(x) {
  if (x < 2) return x;
  return slowFib(x - 1) + slowFib(x - 2);
}

const MAX_N = 40;

export default function TestUseMemo() {
  const [raw, setRaw] = useState("35");
  const [counter, setCounter] = useState(0);

  // total renders of this component
  const renderRef = useRef(0);
  renderRef.current += 1;

  // recompute count, bumped only inside the memo factory
  const computeRef = useRef(0);

  // compute count as it stood at the start of this render, before the memo
  // factory had a chance to run - lets us tell a fresh compute from a cache hit
  const prevCompute = useRef(0);
  const computeAtRenderStart = prevCompute.current;

  const n = Math.max(0, Math.min(MAX_N, Number.parseInt(raw, 10) || 0));

  const result = useMemo(() => {
    computeRef.current += 1;
    return slowFib(n);
  }, [n]);

  // did the memo factory actually run during THIS render?
  const didRecompute = computeRef.current !== computeAtRenderStart;
  prevCompute.current = computeRef.current;

  return (
    <SpecimenCard
      index={5}
      name="useMemo"
      category="Hooks"
      instruments={["useMemo", "useState"]}
      blurb="useMemo caches an expensive result and only recomputes when its inputs change - bump the unrelated counter and the computation stays put."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">Expensive input</SubLabel>
        <Row>
          <Field
            label={`n (0 to ${MAX_N})`}
            type="number"
            min={0}
            max={MAX_N}
            inputMode="numeric"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </Row>
        <Text as="span">
          fib(<Readout>{n}</Readout>) = <Readout>{result}</Readout>
        </Text>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">Unrelated counter</SubLabel>
        <Row>
          <Button $variant="primary" onClick={() => setCounter((c) => c + 1)}>
            bump counter
          </Button>
          <Text as="span">
            counter is <Readout>{counter}</Readout>
          </Text>
        </Row>
        <Text as="span">
          Bumping the counter re-renders the card but reuses the cached fib value.
        </Text>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">Instrumentation</SubLabel>
        <Row>
          <Text as="span">
            computed <Readout>{computeRef.current}</Readout> times
          </Text>
          <Text as="span">
            rendered <Readout>{renderRef.current}</Readout> times
          </Text>
        </Row>
        <LiveRegion>
          {didRecompute
            ? "fresh compute - inputs changed"
            : "cache held - result reused"}
        </LiveRegion>
      </Stack>
    </SpecimenCard>
  );
}
