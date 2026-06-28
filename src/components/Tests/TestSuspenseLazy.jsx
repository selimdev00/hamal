import { lazy, Suspense, useState } from "react";
import {
  Button,
  Chip,
  CodePanel,
  EmptyFrame,
  LiveRegion,
  Muted,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";

/**
 * SPEC 15 — Suspense + lazy. React.lazy splits the inner component into its own
 * chunk; Suspense renders a fallback until that chunk resolves. The 900ms delay
 * is deliberate so the fallback is observable on every load.
 */

function InnerModule() {
  return (
    <Stack $gap="var(--sp-2)">
      <Text as="span">
        module mounted: <Readout>true</Readout>
      </Text>
      <Muted>
        This subtree shipped in a separate chunk and only ran after the promise
        resolved.
      </Muted>
    </Stack>
  );
}

const Lazy = lazy(
  () =>
    new Promise((res) => setTimeout(() => res({ default: InnerModule }), 900)),
);

export default function TestSuspenseLazy() {
  const [loaded, setLoaded] = useState(false);

  return (
    <SpecimenCard
      index={15}
      name="Suspense + lazy"
      category="Concurrent"
      status={loaded ? "on" : "off"}
      instruments={["React.lazy", "Suspense"]}
      blurb="React.lazy code-splits a component; Suspense shows a fallback until the chunk resolves. The delay makes the fallback visible."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">module</SubLabel>
        <Row>
          <Button
            $variant="primary"
            onClick={() => setLoaded(true)}
            disabled={loaded}
          >
            Load module
          </Button>
          <Button
            $variant="ghost"
            onClick={() => setLoaded(false)}
            disabled={!loaded}
          >
            Unload
          </Button>
        </Row>

        <LiveRegion>
          {loaded
            ? "chunk requested - fallback shows until it resolves"
            : "module not mounted"}
        </LiveRegion>

        {loaded ? (
          <Suspense fallback={<EmptyFrame>loading module...</EmptyFrame>}>
            <Lazy />
          </Suspense>
        ) : (
          <EmptyFrame>module unloaded</EmptyFrame>
        )}
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">wiring</SubLabel>
        <Text as="span">
          <Chip>lazy()</Chip> takes a factory that resolves to{" "}
          <Chip>{"{ default }"}</Chip>; <Chip>Suspense</Chip> catches the pending
          state.
        </Text>
        <CodePanel>{`const Lazy = lazy(() =>
  new Promise((res) =>
    setTimeout(() => res({ default: InnerModule }), 900)
  )
);

<Suspense fallback={<EmptyFrame>loading module...</EmptyFrame>}>
  <Lazy />
</Suspense>`}</CodePanel>
      </Stack>
    </SpecimenCard>
  );
}
