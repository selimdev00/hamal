import { Button, CheckboxField, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";
import useAuth from "hooks/useAuth";
import useBoolean from "hooks/useBoolean";

/**
 * SPEC 01 — Custom hooks. Reference card: this is the canonical shape every
 * specimen follows. The component owns its own <SpecimenCard> (chrome + live
 * status dot); Home.jsx just renders <TestCustomHook /> in order.
 *
 * useAuth now reads shared AuthContext, so logging in here flips the header.
 */
export default function TestCustomHook() {
  const { isAuthenticated, login, logout } = useAuth();
  const [flag, { setTrue, setFalse, toggle }] = useBoolean();

  return (
    <SpecimenCard
      index={1}
      name="Custom hooks"
      category="Hooks"
      status={isAuthenticated ? "on" : "off"}
      instruments={["useAuth", "useBoolean", "useState"]}
      blurb="Two hand-rolled hooks. One owns auth state, one owns a boolean with a tidy action API."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">useAuth</SubLabel>
        <Row>
          <Button
            $variant={isAuthenticated ? "ghost" : "primary"}
            onClick={isAuthenticated ? logout : login}
          >
            {isAuthenticated ? "Log out" : "Log in"}
          </Button>
          <Text as="span">
            session is{" "}
            <Readout>{isAuthenticated ? "authenticated" : "anonymous"}</Readout>
          </Text>
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">useBoolean</SubLabel>
        <Row>
          <Button $variant="ghost" onClick={setTrue}>
            setTrue
          </Button>
          <Button $variant="ghost" onClick={setFalse}>
            setFalse
          </Button>
          <Button $variant="primary" onClick={toggle}>
            toggle
          </Button>
        </Row>
        <CheckboxField
          label={
            <>
              flag reads&nbsp;<Readout>{String(flag)}</Readout>
            </>
          }
          checked={flag}
          onChange={toggle}
        />
      </Stack>
    </SpecimenCard>
  );
}
