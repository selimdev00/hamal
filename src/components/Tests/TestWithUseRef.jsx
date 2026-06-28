import { useEffect, useRef, useState } from "react";
import {
  Button,
  Muted,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";
import FormInput from "components/Form/Input";

/**
 * SPEC 04 — useRef. Four mini-benches showing refs as an escape hatch from the
 * render cycle: a mutable box that does not re-render, a timer held in a ref, an
 * imperative focus handle, and a render-persistent counter.
 */
export default function TestWithUseRef() {
  /* (a) mutable box -------------------------------------------------------- */
  const count = useRef(0);
  const [, setTick] = useState(0);

  function addToBox() {
    count.current += 1; // mutate the ref only, no state update, so no re-render
  }

  function flushDisplay() {
    setTick((t) => t + 1); // dummy state update to force a render and repaint the Readout
  }

  /* (b) stopwatch ---------------------------------------------------------- */
  const intervalRef = useRef(null);
  const [startTime, setStartTime] = useState(0);
  const [now, setNow] = useState(0);
  const running = intervalRef.current !== null;

  function startTimer() {
    if (intervalRef.current) return;
    const begin = Date.now();
    setStartTime(begin);
    setNow(begin);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function stopTimer() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setNow((n) => n); // settle final tick
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStartTime(0);
    setNow(0);
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const secondsPassed = ((now - startTime) / 1000).toFixed(1);

  /* (c) imperative focus --------------------------------------------------- */
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  /* (d) render counter ----------------------------------------------------- */
  const renderCount = useRef(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <SpecimenCard
      index={4}
      name="useRef"
      category="Hooks"
      status={running ? "on" : "off"}
      instruments={["useRef", "useState", "useEffect"]}
      blurb="Refs are an escape hatch from the render cycle: mutate without re-rendering, hold a timer, focus an input."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">mutable box</SubLabel>
        <Row>
          <Button $variant="primary" onClick={addToBox}>
            Add
          </Button>
          <Button $variant="ghost" onClick={flushDisplay}>
            Re-render
          </Button>
          <Text as="span">
            displayed value <Readout>{count.current}</Readout>
          </Text>
        </Row>
        <Muted>
          Add only mutates ref.current, which does not schedule a render, so the
          Readout stays frozen at the value from the last render. Press Re-render
          to trigger a state update and watch the Readout jump to the current
          ref.current.
        </Muted>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">stopwatch</SubLabel>
        <Row>
          <Text as="span">
            elapsed <Readout>{secondsPassed}</Readout> s
          </Text>
        </Row>
        <Row>
          <Button $variant="primary" onClick={startTimer} disabled={running}>
            Start
          </Button>
          <Button $variant="ghost" onClick={stopTimer} disabled={!running}>
            Stop
          </Button>
          <Button $variant="ghost" onClick={resetTimer}>
            Reset
          </Button>
        </Row>
        <Muted>
          The interval id lives in a ref, so Start/Stop reach the same timer
          without re-rendering to store it.
        </Muted>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">imperative focus</SubLabel>
        <FormInput ref={inputRef} label="Target input" placeholder="focus lands here" />
        <Row>
          <Button $variant="primary" onClick={focusInput}>
            Focus input
          </Button>
        </Row>
        <Muted>
          A ref on the input exposes the DOM node, so the button can call
          ref.current.focus() directly.
        </Muted>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">render counter</SubLabel>
        <Row>
          <Button $variant="primary" onClick={() => setX(x + 1)}>
            Update x
          </Button>
          <Text as="span">
            x reads <Readout>{x}</Readout>
          </Text>
        </Row>
        <Muted>
          renderCount.current is incremented inside useEffect and persists across
          renders without triggering one. It has reached{" "}
          <Readout as="span">{renderCount.current}</Readout> at the moment this
          row was painted; only state updates like x cause the re-render that
          refreshes it.
        </Muted>
      </Stack>
    </SpecimenCard>
  );
}
