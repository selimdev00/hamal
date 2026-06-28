import { useMemo, useState, useTransition } from "react";
import styled, { css, keyframes } from "styled-components";
import {
  EmptyFrame,
  Field,
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
 * SPEC 13 — useTransition. Typing sets the urgent input value immediately;
 * the expensive 8k-item filter/build is wrapped in startTransition so it is
 * marked low priority. The input stays responsive while results catch up,
 * and isPending drives both the pulsing live region and the status dot.
 */

const SAMPLE = 8000;

// a stable corpus of pseudo part numbers to scan
const CORPUS = Array.from({ length: SAMPLE }, (_, i) => {
  const series = ["R", "C", "L", "Q", "U", "D", "X"][i % 7];
  const code = String(i).padStart(5, "0");
  return `${series}-${code}`;
});

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

const Pending = styled(LiveRegion)`
  ${(p) =>
    p.$pending &&
    css`
      animation: ${pulse} 900ms var(--ease) infinite;
    `}
`;

const HitList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  max-height: 220px;
  overflow-y: auto;
`;

const HitItem = styled.li`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg);
  padding: 2px 0;
  border-bottom: 1px solid var(--border);
`;

const MAX_SHOWN = 50;

export default function TestUseTransition() {
  // urgent: what the user sees in the box, updated synchronously
  const [text, setText] = useState("");
  // low priority: the query the heavy list is actually built from
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const next = e.target.value;
    setText(next); // urgent — keeps the input responsive
    startTransition(() => {
      setQuery(next); // low priority — defers the expensive rebuild
    });
  }

  // expensive derived work, recomputed only when the deferred query changes
  const { matches, total } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = [];
    let count = 0;
    for (let i = 0; i < CORPUS.length; i += 1) {
      const part = CORPUS[i];
      // deliberate busy work per item so the transition is observable
      if (q === "" || part.toLowerCase().includes(q)) {
        count += 1;
        if (found.length < MAX_SHOWN) found.push(part);
      }
    }
    return { matches: found, total: count };
  }, [query]);

  return (
    <SpecimenCard
      index={13}
      name="useTransition"
      category="Concurrent"
      status={isPending ? "on" : "off"}
      instruments={["useTransition", "useState"]}
      blurb="useTransition marks the expensive list update as low priority, so typing stays responsive while results catch up."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">scan {SAMPLE.toLocaleString()} parts</SubLabel>
        <Field
          label="filter parts by code"
          placeholder="try R-001 or Q-1"
          value={text}
          onChange={handleChange}
          autoComplete="off"
          spellCheck={false}
        />
        <Row>
          <Text as="span">
            matched <Readout>{total.toLocaleString()}</Readout> of{" "}
            <Readout>{SAMPLE.toLocaleString()}</Readout>
          </Text>
        </Row>
        <Pending $assertive $pending={isPending} aria-hidden={!isPending}>
          {isPending ? "recomputing..." : " "}
        </Pending>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">first {MAX_SHOWN} matches</SubLabel>
        {matches.length === 0 ? (
          <EmptyFrame>no parts match this filter</EmptyFrame>
        ) : (
          <HitList>
            {matches.map((part) => (
              <HitItem key={part}>{part}</HitItem>
            ))}
          </HitList>
        )}
        <Muted>
          The box updates immediately; the list rebuild is deferred, so input never
          stalls behind the scan.
        </Muted>
      </Stack>
    </SpecimenCard>
  );
}
