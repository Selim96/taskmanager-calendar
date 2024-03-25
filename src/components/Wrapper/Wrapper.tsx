import * as React from "react";
import { CSSProperties } from "react";

const sharedStyle: CSSProperties = {
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  
};

type Props = {
  children: React.ReactNode;
  style?: CSSProperties;
};

const Wrapper = React.forwardRef<HTMLDivElement, Props>(
  ({ style, ...props }, ref) => {
    return <div ref={ref} style={{ ...sharedStyle, ...style }} {...props} />;
  }
);

export default Wrapper;
