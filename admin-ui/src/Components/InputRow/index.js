import React from 'react';

const styles = {
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
};

const InputRow = ({children}) => (
  <span style={styles.row}>
    {React.Children.map(children, child => {
      return React.cloneElement(child,);
    })}
  </span>
);

export default InputRow;