import { Button, Readout, Text } from "ui";
import MoneyProvider from "components/HOC/MoneyProvider";

const Person = ({ name, money, addMoney }) => {
  return (
    <>
      <Text as="span">
        {name} has $<Readout>{money}</Readout>
      </Text>

      <Button $variant="primary" onClick={addMoney}>
        Add money
      </Button>
    </>
  );
};

export default MoneyProvider(Person);
