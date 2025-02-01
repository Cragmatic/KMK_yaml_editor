import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FullListAccordion } from "./FullListAccordion";
import { EmptyListAccordion } from "./EmptyListAccordion";

export function HybridListAccordion({
    myKey,
    values,
    changeSpecialOptions,
    changeArrayOptions,
    resetOptions
}: {
    myKey: string;
    values: string[];
    changeSpecialOptions: (optionChanged: string, optionText: string) => void;
    changeArrayOptions: (key: string, value: string) => void;
    resetOptions: (optionChanged: string) => void;
}): JSX.Element {
    const [textFlag, setTextFlag] = useState(false);
    function updateStuff() {
        if (textFlag) {
            resetOptions(myKey);
        } else {
            changeSpecialOptions(myKey, values.toString());
        }
        setTextFlag(!textFlag);
    }
    return (
        <>
            {textFlag && (
                <EmptyListAccordion
                    myKey={myKey}
                    values={values}
                    changeSpecialOptions={changeSpecialOptions}
                    key={myKey}
                >
                    <Button onClick={() => updateStuff()}>Swap Modes</Button>
                </EmptyListAccordion>
            )}
            {!textFlag && (
                <FullListAccordion
                    myKey={myKey}
                    values={values}
                    changeArrayOptions={changeArrayOptions}
                    key={myKey}
                >
                    <Button onClick={() => updateStuff()}>Swap Modes</Button>
                </FullListAccordion>
            )}
        </>
    );
}
