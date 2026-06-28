import { useId, useState } from "react";
import { Chip, Field, Input, Muted, Readout, SpecimenCard, Stack, SubLabel, Text } from "ui";

/**
 * SPEC 08 — useId. Each <SignalProbe /> calls useId() once and derives stable
 * child ids from that base. Two probes render in the same bench; their ids
 * never collide, which is the whole point of the hook.
 */
function SignalProbe({ title }) {
  const id = useId();
  const inputId = `${id}-value`;
  const helpId = `${id}-help`;
  const [value, setValue] = useState("");

  return (
    <Stack $gap="var(--sp-2)">
      <SubLabel as="h3">{title}</SubLabel>

      <Text as="span">
        base id <Readout>{id}</Readout>
      </Text>

      {/* convenience path: ui <Field> owns its own label/input pairing */}
      <Field
        label="channel name"
        placeholder="e.g. probe A"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* manual path: label htmlFor + aria-describedby wired by useId */}
      <Stack $gap="var(--sp-1)">
        <label htmlFor={inputId}>
          <SubLabel>measured value (mV)</SubLabel>
        </label>
        <Input
          id={inputId}
          aria-describedby={helpId}
          inputMode="numeric"
          placeholder="0.00"
        />
        <Muted id={helpId}>
          htmlFor and aria-describedby both point at <Chip>{inputId}</Chip> and{" "}
          <Chip>{helpId}</Chip>, derived from the same base id.
        </Muted>
      </Stack>
    </Stack>
  );
}

export default function TestUseId() {
  return (
    <SpecimenCard
      index={8}
      name="useId"
      category="Hooks"
      instruments={["useId"]}
      blurb="useId returns a stable, collision-free id for accessibility wiring - label/aria links that survive SSR and multiple instances."
    >
      <SignalProbe title="probe one" />
      <SignalProbe title="probe two" />
    </SpecimenCard>
  );
}
