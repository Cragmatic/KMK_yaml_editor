import React, { useState } from "react";
import YAML from "yaml";
import "./App.css";
import { Button, Form, ListGroup } from "react-bootstrap";
import FileSaver from "file-saver";

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

    function changeSpecialOptions(optionChanged: string, optionText: string) {
        const newOptions = { ...outputYaml[outputYaml["game"]] }; //=Keymaster's Keep field
        const currentArray = optionText.split(","); //=What we'll override the old value with
        newOptions[optionChanged] = [...currentArray];
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
        console.log(newOptions);
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
                <ListGroup>
                    <ListGroup.Item key={"name"}>
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
                    </ListGroup.Item>
                    <ListGroup.Item key={"desc"}>
                        {"description: " + yaml["description"]}
                    </ListGroup.Item>
                    {yaml["game"] &&
                        Object.entries(yaml[yaml["game"]]).map(([key, value]) =>
                            checkForSpecialCases(key) ? (
                                <ListGroup.Item
                                    key={key}
                                    style={{
                                        display: "grid",
                                        justifyItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>
                                                <h2>{key}</h2>
                                            </Form.Label>
                                            <Form.Control
                                                defaultValue={value.toString()}
                                                as="textarea"
                                                onChange={(e) =>
                                                    changeSpecialOptions(
                                                        key,
                                                        e.target.value
                                                    )
                                                }
                                            ></Form.Control>
                                        </Form.Group>
                                    </Form>
                                </ListGroup.Item>
                            ) : value.length ? (
                                <ListGroup.Item key={key}>
                                    <h2>{key}</h2>
                                    <Form
                                        style={{
                                            display: "grid",
                                            grid:
                                                value.length < 5
                                                    ? "auto-flow 100px / repeat(" +
                                                      (value.length % 5) +
                                                      ", 1fr)"
                                                    : "auto-flow 100px / repeat(5, 1fr)",
                                            justifyItems: "center",
                                            alignItems: "baseline"
                                        }}
                                    >
                                        {value.map((value: string) => (
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
                                                onClick={() =>
                                                    changeArrayOptions(
                                                        key,
                                                        value
                                                    )
                                                }
                                            ></Form.Check>
                                        ))}
                                    </Form>
                                </ListGroup.Item>
                            ) : (
                                <div>
                                    <h2>{key}</h2>
                                    <ListGroup.Item
                                        key={key}
                                        style={{
                                            display: "grid",
                                            justifyItems: "center",
                                            justifyContent: "center",
                                            grid: "auto-flow / repeat(2, 30%)"
                                        }}
                                    >
                                        {typeof value == "object" && value ? (
                                            Object.entries(value).map(
                                                ([key2, value2]) => (
                                                    <Form key={key2}>
                                                        <Form.Group>
                                                            <Form.Label>
                                                                <h3>{key2}</h3>
                                                            </Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                onChange={(e) =>
                                                                    changeObjectOptions(
                                                                        key,
                                                                        key2,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                {value2}
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Form>
                                                )
                                            )
                                        ) : (
                                            <div></div>
                                        )}
                                    </ListGroup.Item>
                                </div>
                            )
                        )}
                </ListGroup>
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
