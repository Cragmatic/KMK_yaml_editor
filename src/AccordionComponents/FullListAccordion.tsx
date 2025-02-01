import React from "react";
import { Accordion, Form } from "react-bootstrap";

export function FullListAccordion({
    myKey,
    values,
    changeArrayOptions,
    children
}: {
    myKey: string;
    values: string[];
    changeArrayOptions: (key: string, value: string) => void;
    children: JSX.Element;
}): JSX.Element {
    return (
        <Accordion.Item eventKey={myKey}>
            <Accordion.Header>{myKey}</Accordion.Header>
            <Accordion.Body>
                {children}
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
                            id={myKey + value + "-" + "checkbox"}
                            label={value}
                            key={myKey + value}
                            onClick={() => changeArrayOptions(myKey, value)}
                        ></Form.Check>
                    ))}
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    );
}
