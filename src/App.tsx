import React, { useState } from "react";
import YAML from "yaml";
import "./App.css";
import { Button, Form, Accordion } from "react-bootstrap";
import FileSaver from "file-saver";
import { FullObjectAccordion } from "./AccordionComponents/FullObjectAccordion";
import { HybridListAccordion } from "./AccordionComponents/HybridListAccordion";

function App(): JSX.Element {
    const [yamlFile, setYamlFile] = useState<File | undefined>(YAML.parse("")); //Not Needed
    const [yamlText, setYamlText] = useState<string>("");
    const [yaml, setYaml] = useState<Record<string, unknown>>({});
    const [outputYaml, setOutputYaml] = useState<Record<string, unknown>>({});
    const specialCases: string[] = [
        "bizhawk_shuffler_games",
        "game_backlog_game_selection",
        "game_backlog_actions",
        "custom_objective_list",
        "retroachievements_games",
        "game_medley_game_selection",
        "archipelago_multiworld_randomizer_custom_game_selection"
    ];

    function resetOptions(optionChanged: string) {
        const newOptions = { ...outputYaml[outputYaml["game"]] }; //=Keymaster's Keep field
        const newArray: string[] = [];
        newOptions[optionChanged] = [...newArray];
        console.log(optionChanged, newOptions[optionChanged]);
        setOutputYaml({ ...outputYaml, "Keymaster's Keep": { ...newOptions } });
    }

    function changeSpecialOptions(optionChanged: string, optionText: string) {
        const newOptions = { ...outputYaml[outputYaml["game"]] }; //=Keymaster's Keep field
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
        const newOptions = { ...outputYaml[outputYaml["game"]] }; //=Keymaster's Keep field
        const currentObject = { ...newOptions[optionCategory] }; //Specific Object (i.e: "artifacts_of_resolve_total")
        if (currentObject[optionChanged] != null) {
            currentObject[optionChanged] = parseInt(optionText);
        }
        newOptions[optionCategory] = { ...currentObject };
        console.log(optionChanged, newOptions[optionChanged]);
        setOutputYaml({ ...outputYaml, "Keymaster's Keep": { ...newOptions } });
    }

    function changeArrayOptions(optionChanged: string, optionText: string) {
        const newOptions = { ...outputYaml[outputYaml["game"]] }; //=Keymaster's Keep field
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

    function checkForSpecialCases(name: string): boolean {
        return specialCases.includes(name);
    }

    function readFile(file: File) {
        //Thanks stackoverflow
        if (file) {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        }
    }

    function initializeOutputYaml(yaml: Record<string, unknown>) {
        const outputYaml = { ...yaml };
        if (yaml["Keymaster's Keep"]) {
            const oldOptions: Record<string, unknown> = {
                ...yaml["Keymaster's Keep"]
            };
            const newOptions = {};
            Object.entries(oldOptions).map(([key, value]) =>
                value.length
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
            readFile(yaml)
                ?.then((content: string) => {
                    setYaml(YAML.parse(content));
                    initializeOutputYaml(YAML.parse(content));
                    console.log(YAML.parse(content));
                    setYamlText(YAML.stringify(YAML.parse(content)));
                })
                .catch((error) => console.log(error));
        }
    }
    return (
        <div className="App">
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
            <header className="App-header">Your Uploaded YAML file:</header>
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
                                        defaultValue={outputYaml["name"]}
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
                        Object.entries(yaml[yaml["game"]]).map(([key, value]) =>
                            value.length != undefined ? (
                                <HybridListAccordion
                                    myKey={key}
                                    values={value}
                                    changeSpecialOptions={changeSpecialOptions}
                                    changeArrayOptions={changeArrayOptions}
                                    resetOptions={resetOptions}
                                    key={key}
                                ></HybridListAccordion>
                            ) : (
                                <FullObjectAccordion
                                    myKey={key}
                                    values={value}
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
                        new Blob([YAML.stringify(outputYaml)], {
                            type: "text/yaml"
                        }),
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
