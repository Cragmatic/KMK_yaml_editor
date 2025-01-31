import React from "react";
import { Accordion, Form } from "react-bootstrap";

export function FullListAccordion({
    myKey,
    values,
    changeArrayOptions
}: {
    myKey: string;
    values: string[];
    changeArrayOptions: (key: string, value: string) => void;
}): JSX.Element {
    return (
        <Accordion.Item eventKey={myKey}>
            <Accordion.Header>{myKey}</Accordion.Header>
            <Accordion.Body>
                <h2>{myKey}</h2>
                <Form
                    style={{
                        display: "grid",
                        grid:
                            values.length < 5
                                ? "auto-flow 100px / repeat(" +
                                  (values.length % 5) +
                                  ", 1fr)"
                                : "auto-flow 100px / repeat(5, 1fr)",
                        justifyItems: "center",
                        alignItems: "baseline"
                    }}
                >
                    {values.map((value: string) => (
                        <Form.Check
                            style={{
                                width: "fit-content",
                                display: "grid",
                                justifyItems: "center",
                                fontWeight: "bold"
                            }}
                            type={"checkbox"}
                            id={value + "-" + "checkbox"}
                            label={value}
                            key={value}
                            onClick={() => changeArrayOptions(myKey, value)}
                        ></Form.Check>
                    ))}
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    );
}
