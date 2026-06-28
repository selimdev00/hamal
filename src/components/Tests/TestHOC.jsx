import { Muted, Row, SpecimenCard, Stack, SubLabel } from "ui";
import Person from "components/HOC/Person";

/**
 * SPEC 16 — Higher-order component. MoneyProvider wraps Person and hands it a
 * money value plus an addMoney callback. Each wrapped instance owns its own
 * useState, so the two wallets below increment independently.
 */
export default function TestHOC() {
  return (
    <SpecimenCard
      index={16}
      name="Higher-order component"
      category="Patterns"
      instruments={["HOC", "MoneyProvider"]}
      blurb="MoneyProvider wraps Person and injects a wallet. The pattern still works; a custom hook would read cleaner today."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">wrapped instances</SubLabel>
        <Muted>
          MoneyProvider is the HOC: it holds the wallet state and injects money
          + addMoney into each Person. A useMoney() hook would read cleaner.
        </Muted>
        <Row $gap="var(--sp-3)">
          <Person name="Ada" />
        </Row>
        <Row $gap="var(--sp-3)">
          <Person name="Linus" />
        </Row>
      </Stack>
    </SpecimenCard>
  );
}
