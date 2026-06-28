import { useState } from "react";
import {
  Button,
  CodePanel,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";

/**
 * SPEC 17 — Render props. A <Toggle> owns the on/off state and hands it to a
 * function child via toggle.children({ on, toggle }). The consumer decides the
 * UI: here the same toggle drives a Button label flip and a status Readout.
 */
function Toggle({ initial = false, children }) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((prev) => !prev);
  return children({ on, toggle });
}

export default function TestRenderProps() {
  return (
    <SpecimenCard
      index={17}
      name="Render props"
      category="Patterns"
      instruments={["render prop", "children as function"]}
      blurb="A render prop hands state to a function child, so one stateful component can drive completely different UIs."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">One Toggle, two presentations</SubLabel>
        <Text as="span">
          A single <Readout>Toggle</Readout> owns the state and passes{" "}
          <Readout>{`{ on, toggle }`}</Readout> to its function child. That one
          child renders both a Button and a status line from the same values, so
          they always agree.
        </Text>

        <Toggle>
          {({ on, toggle }) => (
            <Stack $gap="var(--sp-3)">
              <Row $gap="var(--sp-4)">
                <Button $variant={on ? "primary" : "ghost"} onClick={toggle}>
                  {on ? "Probe live" : "Probe idle"}
                </Button>
                <Text as="span">
                  button label flips with <Readout>{on ? "on" : "off"}</Readout>
                </Text>
              </Row>
              <Readout>
                status line: channel is {on ? "live" : "idle"}
              </Readout>
            </Stack>
          )}
        </Toggle>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">Shape</SubLabel>
        <CodePanel>{`function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((v) => !v);
  return children({ on, toggle });
}

<Toggle>{({ on, toggle }) => <Button onClick={toggle}>{on ? "on" : "off"}</Button>}</Toggle>`}</CodePanel>
      </Stack>
    </SpecimenCard>
  );
}
