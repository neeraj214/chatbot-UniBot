import * as React from "react";

// This is a simple implementation of the Slot pattern
// It allows passing a component as a prop and having that component
// receive the props of the Slot component
const Slot = React.forwardRef(({ children, ...props }, ref) => {
  if (!children) {
    return null;
  }

  // If children is a valid element, clone it and pass the props and ref
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref: ref ? mergeRefs([ref, (children.ref || null)]) : children.ref,
    });
  }

  // If children is not a valid element, just render it
  return children;
});

// Helper function to merge refs
const mergeRefs = (refs) => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
};

Slot.displayName = "Slot";

export { Slot };

// Note: We don't need to add Slot to React namespace as it's not recommended
// and causes errors because imports are immutable