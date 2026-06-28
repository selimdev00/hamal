import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  CodePanel,
  Field,
  LiveRegion,
  Readout,
  Row,
  SelectField,
  SpecimenCard,
  Stack,
  SubLabel,
  Text,
} from "ui";
import ThemeContext from "contexts/Theme";

const name = "Effect lifecycle";

function createConnection(serverUrl, roomId) {
  // A real implementation would actually open a socket to the server.
  return {
    connect() {
      console.log(`[${name}]: connected to ${serverUrl}, room ${roomId}`);
    },
    disconnect() {
      console.log(`[${name}]: disconnected from ${serverUrl}, room ${roomId}`);
    },
  };
}

const ROOMS = [
  { value: 1, label: "General" },
  { value: 2, label: "Develops" },
  { value: 3, label: "Designers" },
];

export default function TestFunctionComponent() {
  const { theme } = useContext(ThemeContext);

  const [count, setCount] = useState(0);
  const [serverUrl, setServerUrl] = useState("http://localhost:3000");
  const [roomId, setRoomId] = useState(1);

  const serverRef = useRef(null);
  const roomRef = useRef(null);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  const roomLabel = ROOMS.find((r) => r.value === roomId)?.label ?? "-";

  return (
    <SpecimenCard
      index={28}
      name={name}
      category="Lifecycle"
      status="on"
      instruments={["useEffect", "useContext", "cleanup"]}
      blurb="The same connection lifecycle as the class card, expressed as one useEffect with a cleanup. Less code, same guarantees."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">connection</SubLabel>
        <CodePanel>{`useEffect(() => {
  const c = createConnection(serverUrl, roomId);
  c.connect();
  return () => c.disconnect();
}, [serverUrl, roomId]);`}</CodePanel>
        <LiveRegion>
          live on <Readout>{serverUrl}</Readout> / room{" "}
          <Readout>{roomLabel}</Readout>
        </LiveRegion>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">server</SubLabel>
        <Row $gap="var(--sp-2)">
          <Field
            label="Server URL"
            inputRef={serverRef}
            type="text"
            defaultValue={serverUrl}
          />
          <Button
            $variant="primary"
            onClick={() => setServerUrl(serverRef.current.value)}
          >
            Apply
          </Button>
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">room</SubLabel>
        <SelectField
          label="Room"
          selectRef={roomRef}
          value={roomId}
          onChange={() => setRoomId(Number(roomRef.current.value))}
        >
          {ROOMS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </SelectField>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">state</SubLabel>
        <Row>
          <Button $variant="ghost" onClick={() => setCount((c) => c - 1)}>
            -
          </Button>
          <Readout>{count}</Readout>
          <Button $variant="ghost" onClick={() => setCount((c) => c + 1)}>
            +
          </Button>
        </Row>
        <Text as="span">
          theme context reads <Readout>{theme}</Readout>
        </Text>
      </Stack>
    </SpecimenCard>
  );
}
