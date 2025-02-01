/* eslint-disable no-extra-parens */
import React, { useState } from "react";
import YAML from "yaml";
import "./App.css";
import { Button, Form, Accordion } from "react-bootstrap";
import FileSaver from "file-saver";
import { FullObjectAccordion } from "./AccordionComponents/FullObjectAccordion";
import { HybridListAccordion } from "./AccordionComponents/HybridListAccordion";

function App(): JSX.Element {
    //    const [yamlFile, setYamlFile] = useState<File | undefined>(YAML.parse("")); //Not Needed
    //    const [yamlText, setYamlText] = useState<string>("");
    const [yaml, setYaml] = useState<Record<string, unknown>>({});
    const [outputYaml, setOutputYaml] = useState<Record<string, unknown>>({});

    function resetOptions(optionChanged: string) {
        const game = outputYaml["game"] as string; //It's known that the game field will be a string.
        const oldOptions = outputYaml[game] as Record<string, unknown>; //Similarly, we know that this will be an Object
        const newOptions = { ...oldOptions }; //Game field = Keymaster's Keep field
        const newArray: string[] = [];

        newOptions[optionChanged] = [...newArray];
        console.log(optionChanged, newOptions[optionChanged]);
        setOutputYaml({ ...outputYaml, "Keymaster's Keep": { ...newOptions } });
    }

    function changeSpecialOptions(optionChanged: string, optionText: string) {
        const game = outputYaml["game"] as string; //It's known that the game field will be a string.
        const oldOptions = outputYaml[game] as Record<string, unknown>; //Similarly, we know that this will be an Object
        const newOptions = { ...oldOptions }; //Game field = Keymaster's Keep field
        const newArray = optionText.split(","); //=What we'll override the old value with

        newOptions[optionChanged] = [...newArray];
        console.log(optionChanged, newOptions[optionChanged]);
        setOutputYaml({ ...outputYaml, "Keymaster's Keep": { ...newOptions } });
    }

    function changeObjectOptions(
        optionCategory: string,
        optionChanged: string,
        optionText: string
    ) {
        //console.log(optionCategory, optionChanged, optionText);
        const game = outputYaml["game"] as string; //It's known that the game field will be a string.
        const oldOptions = outputYaml[game] as Record<string, unknown>; //Similarly, we know that this will be an Object
        const newOptions = { ...oldOptions }; //=Keymaster's Keep field
        const oldObject = newOptions[optionCategory] as Record<string, unknown>;
        const currentObject = { ...oldObject }; //Specific Object (i.e: "artifacts_of_resolve_total")
        if (currentObject[optionChanged] != null) {
            currentObject[optionChanged] = parseInt(optionText);
        }
        newOptions[optionCategory] = { ...currentObject };
        console.log(optionChanged, newOptions[optionChanged]);
        setOutputYaml({ ...outputYaml, "Keymaster's Keep": { ...newOptions } });
    }

    function changeArrayOptions(optionChanged: string, optionText: string) {
        const game = outputYaml["game"] as string; //It's known that the game field will be a string.
        const oldOptions = outputYaml[game] as Record<string, string[]>; //Similarly, we know that this will be an Object
        const newOptions = { ...oldOptions }; //Game field = Keymaster's Keep field
        const currentArray: string[] = [...newOptions[optionChanged]]; //Specific Array (i.e: "game_selection")
        if (currentArray.includes(optionText)) {
            currentArray.splice(
                currentArray.findIndex((value) => value == optionText),
                1
            );
        } else {
            currentArray.push(optionText);
        }
        newOptions[optionChanged] = [...currentArray];
        console.log(optionChanged, newOptions[optionChanged]);
        setOutputYaml({ ...outputYaml, "Keymaster's Keep": { ...newOptions } });
    }

    function readFile(file: File) {
        //Thanks stackoverflow
        if (file) {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = (event) =>
                    event.target && event.target.result
                        ? resolve(event.target.result)
                        : console.log("FAILURE");
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        }
    }

    function initializeOutputYaml(
        yaml: Record<string, Record<string, unknown>>
    ) {
        const outputYaml = { ...yaml };
        if (yaml["Keymaster's Keep"]) {
            const oldOptions: Record<string, unknown> = {
                ...yaml["Keymaster's Keep"]
            };
            const newOptions: Record<string, unknown> = {};
            Object.entries(oldOptions).map(([key, value]) =>
                (value as string[]).length
                    ? (newOptions[key] = [])
                    : (newOptions[key] = value)
            );
            outputYaml["Keymaster's Keep"] = { ...newOptions };
            setOutputYaml(outputYaml);
        }
    }

    function updateYaml(yaml: File | undefined): void {
        //Again, thanks stackoverflow
        if (yaml) {
            const stringFile = readFile(yaml) as Promise<string>;
            if (stringFile) {
                stringFile
                    .then((content: string) => {
                        setYaml(YAML.parse(content));
                        initializeOutputYaml(YAML.parse(content));
                        //console.log(YAML.parse(content));
                        //setYamlText(YAML.stringify(YAML.parse(content)));
                    })
                    .catch((error) => console.log(error));
            }
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                {"Keymaster's keep template YAML editor:"}
            </header>
            <input
                type="file"
                key={"yaml"}
                id={"yaml"}
                name={"yaml"}
                accept="*.yaml"
                onChange={(e) =>
                    updateYaml(e.target.files ? e.target.files[0] : undefined)
                }
            ></input>
            <div>
                <Accordion alwaysOpen>
                    <Accordion.Item eventKey={"name"}>
                        <Accordion.Header>name</Accordion.Header>
                        <Accordion.Body>
                            <Form key={"name"}>
                                <Form.Group>
                                    <Form.Label>
                                        <h3>{"name"}</h3>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        onChange={(e) =>
                                            setOutputYaml({
                                                ...outputYaml,
                                                name: e.target.value
                                            })
                                        }
                                        defaultValue={
                                            outputYaml["name"] as string
                                        }
                                    ></Form.Control>
                                </Form.Group>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey={"desc"}>
                        <Accordion.Header>description</Accordion.Header>
                        <Accordion.Body>
                            {"description: " + yaml["description"]}
                        </Accordion.Body>
                    </Accordion.Item>
                    {yaml["game"] &&
                        Object.entries(
                            yaml[yaml["game"] as string] as Record<
                                string,
                                unknown
                            >
                        ).map(([key, value]) =>
                            (value as string[]).length != undefined ? (
                                <HybridListAccordion
                                    myKey={key}
                                    values={value as string[]}
                                    changeSpecialOptions={changeSpecialOptions}
                                    changeArrayOptions={changeArrayOptions}
                                    resetOptions={resetOptions}
                                    key={key}
                                ></HybridListAccordion>
                            ) : (
                                <FullObjectAccordion
                                    myKey={key}
                                    values={value as Record<string, unknown>}
                                    changeObjectOptions={changeObjectOptions}
                                    key={key}
                                ></FullObjectAccordion>
                            )
                        )}
                </Accordion>
            </div>
            <Button
                onClick={() =>
                    FileSaver.saveAs(
                        new Blob(
                            [
                                YAML.stringify(outputYaml, {
                                    collectionStyle: "flow"
                                })
                            ],
                            {
                                type: "text/yaml"
                            }
                        ),
                        "NewYAML.yaml"
                    )
                }
            >
                Save your new YAML file!
            </Button>
        </div>
    );
}

export default App;
