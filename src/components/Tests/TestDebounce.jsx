import { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Button,
  Chip,
  EmptyFrame,
  LiveRegion,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";

/**
 * SPEC 24 — Debounce. The debounce factory lives OUTSIDE the component so the
 * closure (its `timeout`) survives every render. We store the produced function
 * in a useRef so the SAME debounced instance is reused - a fresh one each render
 * would never accumulate a pending timer to cancel.
 */
function debounce(func, duration) {
  let timeout;
  return function (...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, duration);
  };
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

const Pending = styled(LiveRegion)`
  color: var(--observe);
  animation: ${pulse} 900ms var(--ease) infinite;
`;

function fmtTime(ms) {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${String(
    d.getMilliseconds(),
  ).padStart(3, "0")}`;
}

export default function TestDebounce() {
  const [fires, setFires] = useState([]);
  const [clicks, setClicks] = useState(0);
  const [pending, setPending] = useState(false);

  const debounced = useRef(
    debounce(() => {
      setFires((prev) => [...prev, Date.now()]);
      setPending(false);
    }, 500),
  );

  function handleSignal() {
    setClicks((prev) => prev + 1);
    setPending(true);
    debounced.current();
  }

  return (
    <SpecimenCard
      index={24}
      name="Debounce"
      category="Browser"
      status={pending ? "on" : "off"}
      instruments={["debounce", "useRef"]}
      blurb="Hammer the button. The debounced call fires once, 500ms after you stop. useRef keeps the debounced function stable across renders."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">signal</SubLabel>
        <Row>
          <Button $variant="primary" onClick={handleSignal}>
            Signal
          </Button>
          <Text as="span">
            clicks <Readout>{clicks}</Readout>, actual fires{" "}
            <Readout>{fires.length}</Readout>
          </Text>
        </Row>
        {pending ? (
          <Pending $assertive>pending...</Pending>
        ) : (
          <LiveRegion>{fires.length > 0 ? "settled" : "idle"}</LiveRegion>
        )}
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">readouts</SubLabel>
        <Row $gap="var(--sp-4)">
          <Text as="span">
            clicks <Readout $size="var(--step-1)">{clicks}</Readout>
          </Text>
          <Text as="span">
            actual fires <Readout $size="var(--step-1)">{fires.length}</Readout>
          </Text>
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">fire log</SubLabel>
        {fires.length === 0 ? (
          <EmptyFrame>No fires yet. Click Signal and pause for 500ms.</EmptyFrame>
        ) : (
          <Row $gap="var(--sp-2)">
            {fires.map((t, i) => (
              <Chip key={`${t}-${i}`}>{fmtTime(t)}</Chip>
            ))}
          </Row>
        )}
      </Stack>
    </SpecimenCard>
  );
}
