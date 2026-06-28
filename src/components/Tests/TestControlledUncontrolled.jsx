import { useRef, useState } from "react";
import { Button, Field, LiveRegion, Muted, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";

/**
 * SPEC 19 — Controlled vs uncontrolled inputs. Two inputs side by side.
 * Left: React state owns the value, re-rendering a live Readout on every
 * keystroke. Right: the DOM owns the value via defaultValue + a ref; the
 * value is only sampled when "Read value" is pressed.
 */
export default function TestControlledUncontrolled() {
  const [controlled, setControlled] = useState("");
  const uncontrolledRef = useRef(null);
  const [sampled, setSampled] = useState(null);

  function readUncontrolled() {
    setSampled(uncontrolledRef.current?.value ?? "");
  }

  return (
    <SpecimenCard
      index={19}
      name="Controlled vs uncontrolled"
      category="Patterns"
      instruments={["useState", "useRef", "defaultValue"]}
      blurb="Controlled inputs live in React state every keystroke; uncontrolled inputs keep their value in the DOM and you read it on demand."
    >
      <Row $gap="var(--sp-5)">
        <Stack $gap="var(--sp-2)">
          <SubLabel as="h3">Controlled (useState)</SubLabel>
          <Field
            label="Controlled value"
            placeholder="type here"
            value={controlled}
            onChange={(e) => setControlled(e.target.value)}
          />
          <Text as="span">
            state reads <Readout>{controlled === "" ? "(empty)" : controlled}</Readout>
          </Text>
        </Stack>

        <Stack $gap="var(--sp-2)">
          <SubLabel as="h3">Uncontrolled (defaultValue + ref)</SubLabel>
          <Field
            label="Uncontrolled value"
            placeholder="type here"
            defaultValue=""
            inputRef={uncontrolledRef}
          />
          <Row>
            <Button $variant="primary" onClick={readUncontrolled}>
              Read value
            </Button>
            <Text as="span">
              ref reads{" "}
              <Readout>
                {sampled === null ? "(not read yet)" : sampled === "" ? "(empty)" : sampled}
              </Readout>
            </Text>
          </Row>
        </Stack>
      </Row>

      <LiveRegion>
        {sampled === null
          ? "Controlled value updates as you type. Press Read value to sample the uncontrolled input."
          : `Sampled uncontrolled value: ${sampled === "" ? "(empty)" : sampled}`}
      </LiveRegion>

      <Muted>
        Controlled: React owns the value and re-renders on every keystroke. Uncontrolled: the DOM
        owns the value and you read it on demand through the ref.
      </Muted>
    </SpecimenCard>
  );
}
