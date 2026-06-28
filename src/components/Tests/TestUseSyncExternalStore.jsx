import { useSyncExternalStore } from "react";
import { Button, Chip, Divider, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";

/* ============================================================
   SPEC 12 — useSyncExternalStore. A tiny module-level store
   lives outside React. Two sibling readers subscribe to it via
   one hook and stay in sync with no context and no prop drilling.
   ============================================================ */

const store = {
  value: 0,
  listeners: new Set(),
  subscribe(cb) {
    store.listeners.add(cb);
    return () => store.listeners.delete(cb);
  },
  getSnapshot() {
    return store.value;
  },
  emit() {
    store.listeners.forEach((cb) => cb());
  },
  increment() {
    store.value += 1;
    store.emit();
  },
  reset() {
    store.value = 0;
    store.emit();
  },
};

function useStoreValue() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}

function Probe({ label }) {
  const value = useStoreValue();
  return (
    <Row $gap="var(--sp-2)">
      <SubLabel>{label}</SubLabel>
      <Text as="span">
        reads <Readout>{value}</Readout>
      </Text>
    </Row>
  );
}

export default function TestUseSyncExternalStore() {
  const value = useStoreValue();

  return (
    <SpecimenCard
      index={12}
      name="useSyncExternalStore"
      category="State"
      status={value > 0 ? "on" : "off"}
      instruments={["useSyncExternalStore"]}
      blurb="useSyncExternalStore subscribes React to an outside store - two components stay in sync without context or prop drilling."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">external store</SubLabel>
        <Text as="span">
          One module-level counter outside React. Actuators call{" "}
          <Chip>store.increment()</Chip> and <Chip>store.reset()</Chip>.
        </Text>
        <Row>
          <Button $variant="primary" onClick={() => store.increment()}>
            +1
          </Button>
          <Button $variant="ghost" onClick={() => store.reset()}>
            reset
          </Button>
        </Row>
      </Stack>

      <Divider />

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">independent readers</SubLabel>
        <Probe label="probe A" />
        <Probe label="probe B" />
        <Text as="span">
          Both probes subscribe separately, yet move together on each press -
          the store drives React directly.
        </Text>
      </Stack>
    </SpecimenCard>
  );
}
