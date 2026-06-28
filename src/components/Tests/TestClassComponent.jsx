import { Component, createRef } from "react";

import ThemeContext from "contexts/Theme";

import {
  Button,
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

import PropTypes from "prop-types";

/**
 * SPEC 27 — Class lifecycle. Intentionally a class component: the point is to
 * watch mount, update, snapshot, and unmount fire in order. Every transition is
 * logged to the console; SPEC 28 mirrors the same wiring with hooks.
 */
class TestClassComponent extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
  };

  static defaultProps = {
    title: "Default title",
    content: "Default content",
  };

  constructor(props) {
    super(props);

    this.roomRef = createRef();
    this.serverRef = createRef();
  }

  state = {
    count: 0,
    name: "Class Component",
    serverUrl: "http://localhost:3000",
    roomId: 1,
    note: "Mounted. Lifecycle logs are streaming to the console.",
  };

  setupConnection = () => {
    console.log(
      `[${this.state.name}]: Connected to server: ${this.state.serverUrl}, room: ${this.state.roomId}`,
    );
  };

  cancelConnection = ({ roomId, serverUrl }) => {
    console.log(
      `[${this.state.name}]: Disconnected from server: ${serverUrl}, room: ${roomId}`,
    );
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentWillUnmount() {
    this.cancelConnection(this.state);
  }

  getSnapshotBeforeUpdate() {
    return this.roomRef.current ? this.roomRef.current.value : null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.count !== this.state.count) {
      console.log(
        `[${this.state.name}]: Count changed from ${prevState.count} to ${this.state.count}`,
      );
    }

    if (
      prevState.roomId !== this.state.roomId ||
      prevState.serverUrl !== this.state.serverUrl
    ) {
      this.cancelConnection(prevState);
      this.setupConnection();
    }

    console.log(`[${this.state.name}]: Snapshot (before update) ${snapshot}`);
    console.log(
      `[${this.state.name}]: Snapshot (after update) ${
        this.roomRef.current ? this.roomRef.current.value : null
      }`,
    );
  }

  addCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  removeCount = () => {
    this.setState({ count: this.state.count - 1 });
  };

  changeRoomId = (event) => {
    const roomId = Number(event.target.value);

    this.setState({ roomId, note: `Room set to ${roomId}.` }, () => {
      console.log(`[${this.state.name}]: Room changed to ${this.state.roomId}`);
    });
  };

  applyServer = () => {
    const node = this.serverRef.current;
    const serverUrl = node ? node.value.trim() : "";

    if (!serverUrl) {
      this.setState({ note: "Enter a server URL before applying." });
      return;
    }

    this.setState({ serverUrl, note: `Server set to ${serverUrl}.` });
  };

  render() {
    const { theme } = this.context;

    return (
      <SpecimenCard
        index={27}
        name="Class lifecycle"
        category="Lifecycle"
        status="on"
        instruments={["Component", "contextType", "getSnapshotBeforeUpdate"]}
        blurb="The class lifecycle in full: mount, update, snapshot, unmount - logged to the console. This card stays mounted; SPEC 28 mirrors it with hooks."
      >
        <Stack $gap="var(--sp-2)">
          <SubLabel as="h3">Server</SubLabel>
          <Row>
            <Field
              label="Server URL"
              type="text"
              placeholder="http://localhost:3000"
              inputRef={this.serverRef}
            />
            <Button $variant="primary" onClick={this.applyServer}>
              Apply server
            </Button>
          </Row>
          <Text as="span">
            current <Readout>{this.state.serverUrl}</Readout>
          </Text>
        </Stack>

        <Stack $gap="var(--sp-2)">
          <SubLabel as="h3">Room</SubLabel>
          <SelectField
            label="Room"
            selectRef={this.roomRef}
            value={this.state.roomId}
            onChange={this.changeRoomId}
          >
            <option value="1">General</option>
            <option value="2">Develops</option>
            <option value="3">Designers</option>
          </SelectField>
          <Text as="span">
            room id <Readout>{this.state.roomId}</Readout>
          </Text>
        </Stack>

        <Stack $gap="var(--sp-2)">
          <SubLabel as="h3">Count</SubLabel>
          <Row>
            <Button $variant="ghost" onClick={this.removeCount}>
              -
            </Button>
            <Readout $size="var(--step-1)">{this.state.count}</Readout>
            <Button $variant="primary" onClick={this.addCount}>
              +
            </Button>
          </Row>
        </Stack>

        <Stack $gap="var(--sp-2)">
          <SubLabel as="h3">Context</SubLabel>
          <Text as="span">
            theme reads <Readout>{theme}</Readout> via static contextType
          </Text>
        </Stack>

        <LiveRegion>{this.state.note}</LiveRegion>
      </SpecimenCard>
    );
  }
}

export default TestClassComponent;
