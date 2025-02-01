/* eslint-disable no-extra-parens */
import React from "react";
import { Accordion, Form } from "react-bootstrap";
export function FullObjectAccordion({
    myKey,
    values,
    changeObjectOptions
}: {
    myKey: string;
    values: Record<string, unknown>;
    changeObjectOptions: (key: string, key2: string, newValue: string) => void;
}): JSX.Element {
    return (
        <Accordion.Item eventKey={myKey}>
            <Accordion.Header>{myKey}</Accordion.Header>
            <Accordion.Body>
                <h2>{myKey}</h2>
                <div
                    style={{
                        display: "grid",
                        justifyItems: "center",
                        justifyContent: "center",
                        grid: "auto-flow / repeat(2, 30%)"
                    }}
                >
                    {Object.entries(values).map(([key2, value2]) => (
                        <Form key={myKey + key2}>
                            <Form.Group>
                                <Form.Label>
                                    <h3>{key2}</h3>
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    onChange={(e) =>
                                        changeObjectOptions(
                                            myKey,
                                            key2,
                                            e.target.value
                                        )
                                    }
                                    defaultValue={(
                                        value2 as string[]
                                    ).toString()}
                                ></Form.Control>
                            </Form.Group>
                        </Form>
                    ))}
                </div>
            </Accordion.Body>
        </Accordion.Item>
    );
}
