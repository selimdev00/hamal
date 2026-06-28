import { forwardRef, useId } from "react";
import { Field } from "ui";

/**
 * Labeled, accessible text field. Forwards its ref to the underlying <input>
 * (used by the imperative-focus specimen). If `label` is omitted, the
 * placeholder is mirrored into a visually-hidden label so the control is
 * never unlabeled.
 */
const FormInput = forwardRef(function FormInput({ label, hideLabel, ...props }, ref) {
  const id = useId();
  const resolvedLabel = label || props.placeholder || "Text input";

  return (
    <Field
      id={id}
      label={resolvedLabel}
      hideLabel={hideLabel ?? !label}
      inputRef={ref}
      {...props}
    />
  );
});

export default FormInput;
