import { useReducer, useRef, useState } from "react";
import {
  Button,
  CheckboxField,
  EmptyFrame,
  Field,
  LiveRegion,
  Readout,
  Row,
  SpecimenCard,
  Stack,
  SubLabel,
} from "ui";

/**
 * SPEC 10 — useReducer (todos). A todo list expressed as a pure reducer:
 * add / toggle / remove. Ids come from a monotonic ref counter (never
 * state.length), so list keys stay stable and toggles hit the right row.
 */
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, { id: action.id, text: action.text, done: false }];
    case "toggle":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      );
    case "remove":
      return state.filter((todo) => todo.id !== action.id);
    default:
      throw new Error("Unknown action");
  }
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

const SEED = [{ id: 1, text: "buy milk", done: false }];

export default function TestTodosWithReducer() {
  const [todos, dispatch] = useReducer(reducer, SEED);
  const nextId = useRef(2); // seed used id 1
  const inputRef = useRef(null);
  const [note, setNote] = useState("seeded with one entry");

  function add() {
    const text = inputRef.current.value.trim();
    if (!text) {
      setNote("type a todo before adding");
      return;
    }
    const id = nextId.current++;
    dispatch({ type: "add", id, text });
    inputRef.current.value = "";
    inputRef.current.focus();
    setNote(`added "${text}"`);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  }

  return (
    <SpecimenCard
      index={10}
      name="useReducer (todos)"
      category="State"
      status={todos.length > 0 ? "on" : "off"}
      instruments={["useReducer"]}
      blurb="A todo list as a pure reducer: add, toggle, remove. Stable ids keep toggles hitting the right row."
    >
      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">add</SubLabel>
        <Row $gap="var(--sp-2)">
          <Field
            label="New todo"
            hideLabel
            placeholder="buy milk"
            inputRef={inputRef}
            onKeyDown={onKeyDown}
          />
          <Button $variant="primary" onClick={add}>
            Add
          </Button>
        </Row>
      </Stack>

      <Stack $gap="var(--sp-2)">
        <SubLabel as="h3">list</SubLabel>
        {todos.length === 0 ? (
          <EmptyFrame>- no entries - add one above</EmptyFrame>
        ) : (
          <Stack as="ul" $gap="var(--sp-1)" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {todos.map((todo, i) => (
              <Row as="li" key={todo.id} $gap="var(--sp-3)">
                <Readout $size="var(--step--1)">{pad2(i + 1)}</Readout>
                <CheckboxField
                  label={todo.text}
                  checked={todo.done}
                  done={todo.done}
                  onChange={() => dispatch({ type: "toggle", id: todo.id })}
                  aria-label={`Toggle ${todo.text}`}
                />
                <Button
                  $variant="danger"
                  onClick={() => {
                    dispatch({ type: "remove", id: todo.id });
                    setNote(`removed "${todo.text}"`);
                  }}
                  style={{ marginLeft: "auto" }}
                >
                  Remove
                </Button>
              </Row>
            ))}
          </Stack>
        )}
      </Stack>

      <LiveRegion>{note}</LiveRegion>
    </SpecimenCard>
  );
}
