import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  CheckboxField,
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
 * SPEC 26 — Data fetching. A self-contained useFetch hook models the full
 * async lifecycle (idle, loading, error, success) over a fake request. No real
 * network: fakeFetch resolves a sample record after a short delay, or rejects
 * when forced. AbortController cleanup runs on unmount or re-run so a stale
 * resolution never lands on the current state.
 */

const SAMPLE = {
  id: "BN-0x2A",
  channel: 3,
  voltage: 4.97,
  current: 0.21,
  sampledAt: "t+1.2s",
};

/* Simulated async request. Honors an AbortSignal; rejects when shouldFail. */
function fakeFetch({ signal, shouldFail }) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      if (shouldFail) {
        reject(new Error("sensor read timed out"));
      } else {
        resolve({ ...SAMPLE, voltage: +(4.8 + Math.random() * 0.4).toFixed(2) });
      }
    }, 900);

    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function useFetch() {
  const [state, setState] = useState({ status: "idle", data: null, error: null });
  const controllerRef = useRef(null);

  const run = useCallback((shouldFail) => {
    // cancel any in-flight request before starting a new one
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ status: "loading", data: null, error: null });

    fakeFetch({ signal: controller.signal, shouldFail })
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ status: "success", data, error: null });
      })
      .catch((err) => {
        if (err?.name === "AbortError" || controller.signal.aborted) return;
        setState({ status: "error", data: null, error: err.message });
      });
  }, []);

  // cleanup: abort the live request when the specimen unmounts
  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, run };
}

export default function TestUseFetch() {
  const { status, data, error, run } = useFetch();
  const [forceError, setForceError] = useState(false);

  return (
    <SpecimenCard
      index={26}
      name="Data fetching"
      category="Async"
      status={status === "success" ? "on" : "off"}
      fault={status === "error"}
      instruments={["useEffect", "AbortController", "custom hook"]}
      blurb="A custom useFetch hook models the full async lifecycle: idle, loading, error, success - with AbortController cleanup on unmount."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">request</SubLabel>
        <Row>
          <Button $variant="primary" onClick={() => run(forceError)} disabled={status === "loading"}>
            {status === "loading" ? "Running..." : "Run request"}
          </Button>
          <Text as="span">
            status <Readout>{status}</Readout>
          </Text>
        </Row>
        <CheckboxField
          label="Force error on next run"
          checked={forceError}
          onChange={(e) => setForceError(e.target.checked)}
        />
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">result</SubLabel>

        {status === "idle" && <EmptyFrame>no request yet</EmptyFrame>}

        {status === "loading" && (
          <LiveRegion>fetching sample from sensor...</LiveRegion>
        )}

        {status === "error" && (
          <Stack $gap="var(--sp-2)">
            <LiveRegion $tone="danger" $assertive>
              request failed: {error}
            </LiveRegion>
            <Row>
              <Button $variant="danger" onClick={() => run(forceError)}>
                Retry
              </Button>
            </Row>
          </Stack>
        )}

        {status === "success" && data && (
          <Stack $gap="var(--sp-2)">
            <LiveRegion>record received</LiveRegion>
            <Row $gap="var(--sp-2)">
              <Chip>id</Chip>
              <Readout>{data.id}</Readout>
            </Row>
            <Row $gap="var(--sp-2)">
              <Chip>channel</Chip>
              <Readout>{data.channel}</Readout>
            </Row>
            <Row $gap="var(--sp-2)">
              <Chip>voltage</Chip>
              <Readout>{data.voltage} V</Readout>
            </Row>
            <Row $gap="var(--sp-2)">
              <Chip>current</Chip>
              <Readout>{data.current} A</Readout>
            </Row>
          </Stack>
        )}
      </Stack>
    </SpecimenCard>
  );
}
