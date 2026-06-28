import styled from "styled-components";

import TestCustomHook from "components/Tests/TestCustomHook";
import TestUseContext from "components/Tests/TestUseContext";
import TestUseReducer from "components/Tests/TestUseReducer";
import TestWithUseRef from "components/Tests/TestWithUseRef";
import TestUseMemo from "components/Tests/TestUseMemo";
import TestUseCallback from "components/Tests/TestUseCallback";
import TestUseLayoutEffect from "components/Tests/TestUseLayoutEffect";
import TestUseId from "components/Tests/TestUseId";
import TestUseImperativeHandle from "components/Tests/TestUseImperativeHandle";
import TestTodosWithReducer from "components/Tests/TestTodosWithReducer";
import TestTodosWithImmerReducer from "components/Tests/TestTodosWithImmerReducer";
import TestUseSyncExternalStore from "components/Tests/TestUseSyncExternalStore";
import TestUseTransition from "components/Tests/TestUseTransition";
import TestUseDeferredValue from "components/Tests/TestUseDeferredValue";
import TestSuspenseLazy from "components/Tests/TestSuspenseLazy";
import TestHOC from "components/Tests/TestHOC";
import TestRenderProps from "components/Tests/TestRenderProps";
import TestCompoundComponents from "components/Tests/TestCompoundComponents";
import TestControlledUncontrolled from "components/Tests/TestControlledUncontrolled";
import TestListsKeys from "components/Tests/TestListsKeys";
import TestPortal from "components/Tests/TestPortal";
import TestErrorBoundaryDemo from "components/Tests/TestErrorBoundaryDemo";
import TestStopPropagation from "components/Tests/TestStopPropagation";
import TestDebounce from "components/Tests/TestDebounce";
import TestThrottling from "components/Tests/TestThrottling";
import TestUseFetch from "components/Tests/TestUseFetch";
import TestClassComponent from "components/Tests/TestClassComponent";
import TestFunctionComponent from "components/Tests/TestFunctionComponent";

const Page = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 40px) clamp(48px, 8vw, 96px);
`;

const Cover = styled.header`
  padding: clamp(48px, 9vw, 104px) 0 clamp(32px, 5vw, 56px);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  border-bottom: 1px solid var(--border);
`;

const Kicker = styled.p`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--fg-faint);
`;

const CoverTitle = styled.h1`
  font-size: var(--step-4);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.015em;
  color: var(--fg);
  max-width: 20ch;
`;

const Lead = styled.p`
  font-size: var(--step-1);
  line-height: 1.55;
  color: var(--fg-muted);
  max-width: 60ch;
`;

const Meta = styled.p`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
  letter-spacing: 0.04em;
`;

const Group = styled.section`
  margin-top: clamp(40px, 6vw, 72px);
`;

const GroupHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--sp-3);
  padding-bottom: var(--sp-4);
  margin-bottom: var(--sp-5);
  border-bottom: 1px solid var(--border);
`;

const GroupName = styled.h2`
  font-family: var(--font-mono);
  font-size: var(--step-0);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--fg);
`;

const GroupCount = styled.span`
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
  margin-left: auto;
`;

const Grid = styled.div`
  column-gap: var(--sp-5);
  columns: 1;

  @media (min-width: 768px) {
    columns: 2;
  }

  > * {
    break-inside: avoid;
    margin-bottom: var(--sp-5);
  }
`;

const GROUPS = [
  {
    name: "Core hooks",
    items: [
      TestCustomHook,
      TestUseContext,
      TestUseReducer,
      TestWithUseRef,
      TestUseMemo,
      TestUseCallback,
      TestUseLayoutEffect,
      TestUseId,
      TestUseImperativeHandle,
    ],
  },
  {
    name: "State",
    items: [TestTodosWithReducer, TestTodosWithImmerReducer, TestUseSyncExternalStore],
  },
  {
    name: "Concurrent",
    items: [TestUseTransition, TestUseDeferredValue, TestSuspenseLazy],
  },
  {
    name: "Patterns",
    items: [
      TestHOC,
      TestRenderProps,
      TestCompoundComponents,
      TestControlledUncontrolled,
      TestListsKeys,
      TestPortal,
      TestErrorBoundaryDemo,
    ],
  },
  {
    name: "Browser",
    items: [TestStopPropagation, TestDebounce, TestThrottling],
  },
  {
    name: "Async",
    items: [TestUseFetch],
  },
  {
    name: "Lifecycle",
    items: [TestClassComponent, TestFunctionComponent],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

export default function HomePage() {
  return (
    <Page>
      <Cover>
        <Kicker>React internals logbook</Kicker>
        <CoverTitle>Bench Notes</CoverTitle>
        <Lead>
          A catalogue of React mechanisms you can actuate and measure. Each specimen isolates
          one idea - a hook, a pattern, an escape hatch - and runs live in the browser.
        </Lead>
        <Meta>{TOTAL} specimens · drive the bench, watch the readout</Meta>
      </Cover>

      {GROUPS.map((group, gi) => (
        <Group key={group.name} aria-label={group.name}>
          <GroupHead>
            <GroupName>{group.name}</GroupName>
            <GroupCount>
              {String(group.items.length).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
            </GroupCount>
          </GroupHead>
          <Grid>
            {group.items.map((Specimen, i) => (
              <Specimen key={`${gi}-${i}`} />
            ))}
          </Grid>
        </Group>
      ))}
    </Page>
  );
}
