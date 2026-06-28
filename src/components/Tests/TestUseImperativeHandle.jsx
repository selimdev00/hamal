import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button, Field, LiveRegion, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";

/**
 * SPEC 09 — useImperativeHandle. A child built with forwardRef +
 * useImperativeHandle exposes a narrow API ({ focus, clear }) over its own
 * input. The parent holds a ref to that API and drives it with two buttons,
 * never touching the raw DOM node.
 */

const Probe = forwardRef(function Probe({ onClear }, ref) {
  const inputRef = useRef(null);
  const [value, setValue] = useState("");

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        inputRef.current?.focus();
      },
      clear() {
        setValue("");
        inputRef.current?.focus();
        onClear?.();
      },
    }),
    [onClear],
  );

  return (
    <Field
      label="probe input"
      placeholder="type, then drive me from the parent"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      inputRef={inputRef}
    />
  );
});

export default function TestUseImperativeHandle() {
  const probeRef = useRef(null);
  const [calls, setCalls] = useState(0);
  const [note, setNote] = useState("");

  const callFocus = () => {
    probeRef.current?.focus();
    setCalls((c) => c + 1);
    setNote("parent called probe.focus() through the ref");
  };

  const callClear = () => {
    probeRef.current?.clear();
    setCalls((c) => c + 1);
    setNote("parent called probe.clear() through the ref");
  };

  return (
    <SpecimenCard
      index={9}
      name="useImperativeHandle"
      category="Hooks"
      instruments={["useImperativeHandle", "forwardRef", "useRef"]}
      blurb="useImperativeHandle lets a parent call a child's methods through a ref - expose focus() and clear() without leaking the DOM node."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">child probe</SubLabel>
        <Probe ref={probeRef} />
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">parent actuators</SubLabel>
        <Row>
          <Button $variant="primary" onClick={callFocus}>
            ref.current.focus()
          </Button>
          <Button $variant="ghost" onClick={callClear}>
            ref.current.clear()
          </Button>
        </Row>
        <Text as="span">
          API calls dispatched <Readout>{calls}</Readout>
        </Text>
        <LiveRegion>{note}</LiveRegion>
      </Stack>
    </SpecimenCard>
  );
}
