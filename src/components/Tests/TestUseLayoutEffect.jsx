import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Chip,
  LiveRegion,
  Muted,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";

const SAMPLES = [
  "R1",
  "R1 = 10k ohm",
  "R1 = 10k ohm, tolerance plus or minus 5 percent",
  "R1 = 10k ohm, tolerance plus or minus 5 percent, 1/4 watt carbon film, bench lot 0428",
];

/* the measured node: an inline-block box so its rect tracks its text */
const MeasuredBox = styled.div`
  display: inline-block;
  max-width: 100%;
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: var(--step-0);
  line-height: 1.5;
  padding: var(--sp-3) var(--sp-4);
  background: var(--surface-3);
  border: 1px solid var(--border);
  border-radius: var(--r-panel);
  color: var(--fg);
  overflow-wrap: anywhere;
`;

/**
 * SPEC 07 - useLayoutEffect. Mutate the DOM (swap the box text), then read its
 * geometry synchronously before the browser paints. The width/height Readouts
 * update in the same frame as the text, so there is no intermediate flash.
 */
export default function TestUseLayoutEffect() {
  const [step, setStep] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    const node = boxRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
  }, [step]);

  const canGrow = step < SAMPLES.length - 1;
  const canShrink = step > 0;

  return (
    <SpecimenCard
      index={7}
      name="useLayoutEffect"
      category="Hooks"
      status="on"
      instruments={["useLayoutEffect", "useRef", "useState"]}
      blurb="useLayoutEffect reads layout synchronously after DOM mutation but before paint - measure a node and react without a flash."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">specimen under probe</SubLabel>
        <MeasuredBox ref={boxRef}>{SAMPLES[step]}</MeasuredBox>
        <Row>
          <Button
            $variant="primary"
            onClick={() => setStep((s) => Math.min(s + 1, SAMPLES.length - 1))}
            disabled={!canGrow}
          >
            grow
          </Button>
          <Button
            $variant="ghost"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={!canShrink}
          >
            shrink
          </Button>
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">measured rect</SubLabel>
        <Row>
          <Text as="span">
            width <Readout>{size.w}</Readout> px
          </Text>
          <Text as="span">
            height <Readout>{size.h}</Readout> px
          </Text>
        </Row>
        <LiveRegion>
          {`measured ${size.w} x ${size.h} px before paint`}
        </LiveRegion>
      </Stack>

      <Muted>
        The effect runs after React mutates the DOM but before the browser
        paints, so <Chip>getBoundingClientRect</Chip> reads the final geometry
        and the new measurement is committed in the same frame as the text.
        With <Chip>useEffect</Chip> the read would fire after paint, so a layout
        that depends on the measurement could show one flickering frame at the
        old size first.
      </Muted>
    </SpecimenCard>
  );
}
