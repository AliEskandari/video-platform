import React from "react";
import { Alert as BAlert } from "react-bootstrap";

export default function Alert({ text, ...props }) {
  return (
    <BAlert {...props} className="text-center" variant="primary">
      {text}
    </BAlert>
  );
}
