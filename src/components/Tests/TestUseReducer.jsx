import { useReducer } from "react";
import { Button, Field, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";
import userReducer from "reducers/userReducer";

/**
 * SPEC 03 — useReducer. One reducer owns a small user record. Inputs are
 * controlled and read e.target.value; age steps through increment/decrement
 * actions. Every action returns fresh state.
 */
export default function TestUseReducer() {
  const [state, dispatch] = useReducer(userReducer, {
    firstName: "Ada",
    lastName: "Lovelace",
    age: 36,
  });

  return (
    <SpecimenCard
      index={3}
      name="useReducer (form)"
      category="Hooks"
      instruments={["useReducer"]}
      blurb="One reducer drives a small user record - edit the fields, step the age. Every action returns fresh state."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">user record</SubLabel>
        <Row>
          <Field
            label="First name"
            value={state.firstName}
            onChange={(e) =>
              dispatch({ type: "changeFirstName", firstName: e.target.value })
            }
          />
          <Field
            label="Last name"
            value={state.lastName}
            onChange={(e) =>
              dispatch({ type: "changeLastName", lastName: e.target.value })
            }
          />
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">age</SubLabel>
        <Row>
          <Text as="span">
            age reads <Readout>{state.age}</Readout>
          </Text>
          <Button $variant="primary" onClick={() => dispatch({ type: "increment" })}>
            Increment
          </Button>
          <Button $variant="ghost" onClick={() => dispatch({ type: "decrement" })}>
            Decrement
          </Button>
        </Row>
      </Stack>
    </SpecimenCard>
  );
}
