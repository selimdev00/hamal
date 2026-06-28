import { useDeferredValue, useMemo, useState } from "react";
import {
  Chip,
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
 * SPEC 14 — useDeferredValue (Concurrent). The input binds to `query` and
 * updates immediately; `deferred` trails behind on a deferred copy of the same
 * value. The heavy filter over ~8000 rows keys off the DEFERRED value inside
 * useMemo, so the field stays responsive while the list catches up.
 */

const CATALOG = Array.from({ length: 8000 }, (_, i) => {
  const code = String(i).padStart(4, "0");
  return `R-${code} resistor ${(i % 47) + 1}k ohm`;
});

export default function TestUseDeferredValue() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const isStale = query !== deferred;

  const matches = useMemo(() => {
    const needle = deferred.trim().toLowerCase();
    if (!needle) return CATALOG;
    return CATALOG.filter((row) => row.toLowerCase().includes(needle));
  }, [deferred]);

  const shown = matches.slice(0, 50);

  return (
    <SpecimenCard
      index={14}
      name="useDeferredValue"
      category="Concurrent"
      status={isStale ? "on" : "off"}
      instruments={["useDeferredValue", "useMemo"]}
      blurb="useDeferredValue lets the input update now and the heavy list trail behind on a deferred copy of the value."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">probe</SubLabel>
        <Field
          label="filter catalog (8000 parts)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type fast, e.g. 12k"
          spellCheck={false}
          autoComplete="off"
        />
        <Row $gap="var(--sp-4)">
          <Text as="span">
            live query <Readout>{query || "(empty)"}</Readout>
          </Text>
          <Text as="span">
            deferred <Readout>{deferred || "(empty)"}</Readout>
          </Text>
        </Row>
        <Muted aria-hidden={!isStale}>
          {isStale ? "isStale: list is rebuilding on the deferred value" : " "}
        </Muted>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">readout</SubLabel>
        <Row $gap="var(--sp-2)">
          <Chip>matches {matches.length}</Chip>
          <Chip>showing {shown.length}</Chip>
        </Row>
        <LiveRegion>
          {matches.length} parts match <Chip>{deferred.trim() || "*"}</Chip>
        </LiveRegion>
        {shown.length === 0 ? (
          <EmptyFrame>no parts match the deferred filter</EmptyFrame>
        ) : (
          <Stack $gap="var(--sp-1)" style={{ opacity: isStale ? 0.6 : 1 }}>
            {shown.map((row) => (
              <Text as="span" key={row}>
                {row}
              </Text>
            ))}
          </Stack>
        )}
      </Stack>
    </SpecimenCard>
  );
}
