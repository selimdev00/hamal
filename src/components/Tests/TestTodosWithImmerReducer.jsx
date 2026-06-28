import { useRef, useState } from "react";
import { useImmerReducer } from "use-immer";
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
 * SPEC 11 — useReducer + Immer. Same todo reducer as the plain version
 * (add / toggle / remove), but written with direct draft mutation via
 * useImmerReducer. Immer freezes the draft edits into an immutable update.
 * Ids come from a monotonic ref counter, never state.length.
 */
function reducer(draft, action) {
  switch (action.type) {
    case "add": {
      draft.push({ id: action.id, text: action.text, done: false });
      break;
    }
    case "toggle": {
      const index = draft.findIndex((todo) => todo.id === action.id);
      if (index !== -1) {
        draft[index].done = !draft[index].done;
      }
      break;
    }
    case "remove": {
      const index = draft.findIndex((todo) => todo.id === action.id);
      if (index !== -1) {
        draft.splice(index, 1);
      }
      break;
    }
    default:
      throw new Error("Unknown action");
  }
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

const SEED = [{ id: 1, text: "buy milk", done: false }];

export default function TestTodosWithImmerReducer() {
  const [todos, dispatch] = useImmerReducer(reducer, SEED);
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
      index={11}
      name="useReducer + Immer"
      category="State"
      status={todos.length > 0 ? "on" : "off"}
      instruments={["useImmerReducer", "immer"]}
      blurb="The same todo reducer written with direct mutation. Immer turns the draft edits into an immutable update for you."
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
