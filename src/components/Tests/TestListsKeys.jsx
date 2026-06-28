import { useState } from "react";
import styled from "styled-components";
import {
  Button,
  Chip,
  Field,
  LiveRegion,
  Muted,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
} from "ui";

/**
 * SPEC 20 — Lists & keys. Each row carries an UNCONTROLLED text input, so the
 * value you type lives in the DOM node, not in React state. We render the same
 * list twice: once keyed by array index (the input desyncs after a reorder)
 * and once keyed by a stable item.id (the input stays attached to its row).
 */

const SEED = [
  { id: "r1", label: "R1 - 10k" },
  { id: "r2", label: "R2 - 4k7" },
  { id: "c1", label: "C1 - 100nF" },
  { id: "d1", label: "D1 - 1N4148" },
];

const Bank = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border: 1px solid var(--border);
  border-radius: var(--r-panel);
  background: var(--surface-2);
`;

const RowLine = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--sp-3);

  > :first-child {
    flex: 1 1 auto;
    min-width: 0;
  }
`;

const Tag = styled.span`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-muted);
  white-space: nowrap;
  padding-bottom: 0.6em;
`;

function KeyedBank({ items, keyMode }) {
  return (
    <Bank>
      {items.map((item, i) => (
        <RowLine key={keyMode === "index" ? i : item.id}>
          <Field
            label={`measured reading for ${item.label}`}
            hideLabel
            placeholder={`type a reading for ${item.label}`}
            defaultValue=""
          />
          <Tag>{item.label}</Tag>
        </RowLine>
      ))}
    </Bank>
  );
}

export default function TestListsKeys() {
  const [items, setItems] = useState(SEED);
  const [nextId, setNextId] = useState(1);
  const [note, setNote] = useState("Type a reading into each row, then reorder.");

  function shuffle() {
    setItems((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setNote("Shuffled. Index-keyed readings stayed in place; id-keyed followed their rows.");
  }

  function prepend() {
    const id = `x${nextId}`;
    setNextId((n) => n + 1);
    setItems((prev) => [{ id, label: `New ${nextId} - probe` }, ...prev]);
    setNote("Prepended a row. Under index keys the typed readings stayed pinned to their slots while the labels shifted down, so each reading now sits beside the wrong part (and the new blank input landed at the bottom). With stable ids each reading moved with its row.");
  }

  function reset() {
    setItems(SEED);
    setNextId(1);
    setNote("Reset to the original bank.");
  }

  return (
    <SpecimenCard
      index={20}
      name="Lists & keys"
      category="Patterns"
      instruments={["keys", "reconciliation"]}
      blurb="Keys tell React which item is which. Index keys break when the list reorders; stable ids keep DOM state attached to the right row."
    >
      <Stack $gap="var(--sp-2)">
        <Row>
          <Button $variant="primary" onClick={shuffle}>
            Shuffle
          </Button>
          <Button $variant="ghost" onClick={prepend}>
            Prepend
          </Button>
          <Button $variant="ghost" onClick={reset}>
            Reset
          </Button>
          <Readout>{items.length} rows</Readout>
        </Row>
        <LiveRegion>{note}</LiveRegion>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">key={"{"}index{"}"} - buggy</SubLabel>
        <Muted>
          React reuses the input node at each position. After a reorder the typed text stays put
          while the <Chip>label</Chip> beside it changes, so the reading now belongs to the wrong
          component.
        </Muted>
        <KeyedBank items={items} keyMode="index" />
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">key={"{"}item.id{"}"} - correct</SubLabel>
        <Muted>
          A stable id lets reconciliation move the existing node with its row instead of recycling
          it by position, so each reading stays attached to the part it was measured on.
        </Muted>
        <KeyedBank items={items} keyMode="id" />
      </Stack>
    </SpecimenCard>
  );
}
