import React, { forwardRef } from "react";

interface InputXProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputX = forwardRef<HTMLInputElement, InputXProps>((props, ref) => {
  return <input ref={ref} className="inputx" {...props} />;
});

InputX.displayName = "InputX";

export default InputX;
