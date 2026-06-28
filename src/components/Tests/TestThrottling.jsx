import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Button,
  Chip,
  CodePanel,
  LiveRegion,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";

const DURATION = 1000;

/* throttle: fire on the leading edge, then ignore calls for `duration`ms. */
function throttle(func, duration) {
  let shouldWait = false;

  return function (...args) {
    if (!shouldWait) {
      func.apply(this, args);
      shouldWait = true;

      setTimeout(() => {
        shouldWait = false;
      }, duration);
    }
  };
}

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.65); }
  100% { opacity: 1; transform: scale(1); }
`;

const Pulse = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: var(--r-pill);
  background: var(--observe);
  animation: ${pulse} 1s var(--ease) infinite;
`;

const SOURCE = `function throttle(fn, ms) {
  let shouldWait = false;
  return (...args) => {
    if (shouldWait) return;     // inside the window: drop the call
    fn(...args);                // leading edge: fire now
    shouldWait = true;
    setTimeout(() => {          // open the gate again after ms
      shouldWait = false;
    }, ms);
  };
}`;

export default function TestThrottling() {
  const [clicks, setClicks] = useState(0);
  const [fires, setFires] = useState(0);
  const [inWindow, setInWindow] = useState(false);

  const cooldownTimer = useRef(null);

  // The throttled wrapper lives in a ref, so it survives re-renders.
  const throttledRef = useRef(null);
  if (throttledRef.current === null) {
    throttledRef.current = throttle(() => {
      setFires((n) => n + 1);
      setInWindow(true);
      cooldownTimer.current = setTimeout(() => setInWindow(false), DURATION);
    }, DURATION);
  }

  useEffect(() => () => clearTimeout(cooldownTimer.current), []);

  function handleClick() {
    setClicks((n) => n + 1);
    throttledRef.current();
  }

  function reset() {
    clearTimeout(cooldownTimer.current);
    setClicks(0);
    setFires(0);
    setInWindow(false);
  }

  const dropped = clicks - fires;

  return (
    <SpecimenCard
      index={25}
      name="Throttle"
      category="Browser"
      status={inWindow ? "on" : "off"}
      instruments={["throttle", "useRef"]}
      blurb="Same drill, throttled to once per second. The gap between clicks and fires is the throttle window."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">bench</SubLabel>
        <Text as="span">
          Click fast. The handler is wrapped in <Chip>throttle(fn, 1000)</Chip>, kept stable in a{" "}
          <Chip>useRef</Chip>, so it runs at most once per second on the leading edge.
        </Text>
        <Row>
          <Button $variant="primary" onClick={handleClick}>
            Click to call
          </Button>
          <Button $variant="ghost" onClick={reset}>
            Reset
          </Button>
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">readouts</SubLabel>
        <Row $gap="var(--sp-4)">
          <Text as="span">
            clicks <Readout $size="var(--step-1)">{clicks}</Readout>
          </Text>
          <Text as="span">
            actual fires <Readout $size="var(--step-1)">{fires}</Readout>
          </Text>
          <Text as="span">
            dropped <Readout $size="var(--step-1)">{dropped}</Readout>
          </Text>
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">window</SubLabel>
        {inWindow ? (
          <LiveRegion as="div">
            <Row $gap="var(--sp-2)">
              <Pulse aria-hidden="true" />
              <span>in window... locked for about a second, extra clicks drop</span>
            </Row>
          </LiveRegion>
        ) : (
          <LiveRegion>ready - the next click fires immediately</LiveRegion>
        )}
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">source</SubLabel>
        <CodePanel>{SOURCE}</CodePanel>
      </Stack>
    </SpecimenCard>
  );
}
