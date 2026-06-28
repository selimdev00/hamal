import { createContext, useContext, useId, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Muted, Readout, Row, SpecimenCard, Stack, SubLabel, Text } from "ui";

/**
 * SPEC 18 — Compound components. <Tabs> owns the active index in a local
 * context; Tabs.List / Tabs.Tab / Tabs.Panel read it implicitly, so the
 * parent composes <Tabs><Tab/><Panel/></Tabs> without prop drilling.
 */

const TabsContext = createContext(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* must render inside <Tabs>");
  return ctx;
}

function Tabs({ defaultIndex = 0, children }) {
  const [active, setActive] = useState(defaultIndex);
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ active, setActive, baseId }}>
      <Stack $gap="var(--sp-3)">{children}</Stack>
    </TabsContext.Provider>
  );
}

const ListShell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
`;

function TabsList({ children }) {
  const { setActive } = useTabs();
  const listRef = useRef(null);

  function onKeyDown(e) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;

    const tabs = Array.from(
      listRef.current?.querySelectorAll('[role="tab"]') ?? [],
    );
    if (tabs.length === 0) return;

    const current = tabs.indexOf(document.activeElement);
    const from = current === -1 ? 0 : current;

    let next;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else if (e.key === "ArrowRight") next = (from + 1) % tabs.length;
    else next = (from - 1 + tabs.length) % tabs.length;

    e.preventDefault();
    setActive(next);
    tabs[next].focus();
  }

  return (
    <ListShell
      ref={listRef}
      role="tablist"
      aria-label="Bench Notes sections"
      onKeyDown={onKeyDown}
    >
      {children}
    </ListShell>
  );
}

function TabsTab({ index, children }) {
  const { active, setActive, baseId } = useTabs();
  const selected = active === index;
  return (
    <Button
      type="button"
      role="tab"
      id={`${baseId}-tab-${index}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${index}`}
      tabIndex={selected ? 0 : -1}
      $variant={selected ? "primary" : "ghost"}
      onClick={() => setActive(index)}
    >
      {children}
    </Button>
  );
}

const PanelShell = styled.div`
  border: 1px solid var(--border);
  border-radius: var(--r-panel);
  background: var(--surface-2);
  padding: var(--sp-4);
`;

function TabsPanel({ index, children }) {
  const { active, baseId } = useTabs();
  if (active !== index) return null;
  return (
    <PanelShell
      role="tabpanel"
      id={`${baseId}-panel-${index}`}
      aria-labelledby={`${baseId}-tab-${index}`}
      tabIndex={0}
    >
      {children}
    </PanelShell>
  );
}

function ActiveReadout() {
  const { active } = useTabs();
  return (
    <Row $gap="var(--sp-2)">
      <Text as="span">
        active index <Readout>{active}</Readout>
      </Text>
      <Muted as="span">{SECTIONS[active]}</Muted>
    </Row>
  );
}

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

const SECTIONS = ["Probe log", "Bias point", "Bring-up"];

export default function TestCompoundComponents() {
  return (
    <SpecimenCard
      index={18}
      name="Compound components"
      category="Patterns"
      instruments={["Context", "compound API"]}
      blurb="Compound components share implicit state through context, giving a clean <Tabs><Tab/><Panel/></Tabs> API with no prop drilling."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">Tabs</SubLabel>

        <Tabs defaultIndex={0}>
          <ActiveReadout />

          <Tabs.List>
            {SECTIONS.map((label, i) => (
              <Tabs.Tab key={label} index={i}>
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Tabs.Panel index={0}>
              <Stack $gap="var(--sp-2)">
                <SubLabel as="h3">Probe log</SubLabel>
                <Text>
                  Channel 1 on the rail node, channel 2 on the gate. Ripple sits
                  near 18 mV peak-to-peak under the 220 mA load step.
                </Text>
                <Muted>Captured with the 10x passive probe, 20 MHz limit on.</Muted>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel index={1}>
              <Stack $gap="var(--sp-2)">
                <SubLabel as="h3">Bias point</SubLabel>
                <Text>
                  Collector current settles at 1.2 mA with the base divider at
                  47k over 10k. Quiescent point holds across the 0 to 45 C sweep.
                </Text>
                <Muted>Re-check after the regulator swap on the next build.</Muted>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel index={2}>
              <Stack $gap="var(--sp-2)">
                <SubLabel as="h3">Bring-up</SubLabel>
                <Text>
                  First power-on drew 38 mA idle, no magic smoke. Crystal starts
                  clean and the bootloader enumerates over the serial bridge.
                </Text>
                <Muted>Pending: confirm the watchdog reset path before sign-off.</Muted>
              </Stack>
            </Tabs.Panel>
        </Tabs>
      </Stack>
    </SpecimenCard>
  );
}
