import React from "react";
import { Accordion, Form } from "react-bootstrap";

export function EmptyListAccordion({
    myKey,
    values,
    changeSpecialOptions,
    children
}: {
    myKey: string;
    values: string[];
    changeSpecialOptions: (optionChanged: string, optionText: string) => void;
    children: JSX.Element;
}): JSX.Element {
    return (
        <Accordion.Item eventKey={myKey}>
            <Accordion.Header>{myKey}</Accordion.Header>
            <Accordion.Body
                style={{
                    display: "grid",
                    justifyItems: "center",
                    justifyContent: "center"
                }}
            >
                {children}
                <Form>
                    <Form.Group>
                        <Form.Label>
                            <h2>{myKey}</h2>
                        </Form.Label>
                        <Form.Control
                            defaultValue={values.toString()}
                            as="textarea"
                            onChange={(e) =>
                                changeSpecialOptions(myKey, e.target.value)
                            }
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    );
}
