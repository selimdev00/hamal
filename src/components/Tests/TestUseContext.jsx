import { Button, Chip, LiveRegion, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";
import { useTheme } from "contexts/Theme";

/**
 * SPEC 02 — useContext + theme. A single theme value lives in ThemeContext.
 * This specimen reads it with useTheme() (a thin useContext wrapper) and writes
 * it back via setTheme/toggle. No props are threaded down to get here.
 */
export default function TestUseContext() {
  const { theme, setTheme, toggle } = useTheme();

  return (
    <SpecimenCard
      index={2}
      name="useContext + theme"
      category="Hooks"
      status={theme === "dark" ? "on" : "off"}
      instruments={["useContext", "useTheme", "createContext"]}
      blurb="A theme value lives in context; any specimen can read it with useContext, no prop drilling."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">reading</SubLabel>
        <Row>
          <Text as="span">
            context reports <Readout>{theme}</Readout>
          </Text>
        </Row>
        <Text>
          The value comes straight from <Chip>ThemeContext</Chip> via{" "}
          <Chip>useContext</Chip>. This card never received a theme prop - any
          component under the provider reads the same value with no prop
          drilling.
        </Text>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">writing</SubLabel>
        <Row>
          <Button
            $variant={theme === "light" ? "primary" : "ghost"}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            light
          </Button>
          <Button
            $variant={theme === "dark" ? "primary" : "ghost"}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            dark
          </Button>
          <Button $variant="ghost" onClick={toggle}>
            toggle
          </Button>
        </Row>
        <LiveRegion>
          active theme is <Readout>{theme}</Readout>
        </LiveRegion>
      </Stack>
    </SpecimenCard>
  );
}
