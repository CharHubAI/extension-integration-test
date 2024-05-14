import {ChubExtension} from "./ChubExtension.tsx";
import {useEffect, useState} from "react";
import {DEFAULT_INITIAL, DEFAULT_MESSAGE, StageBase, StageResponse, InitialData} from "@chub-ai/stages-ts";

import InitData from './assets/test-init.json';

export interface TestExtensionRunnerProps<ExtensionType extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType>, InitStateType, ChatStateType, MessageStateType, ConfigType> {
    factory: (data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) => ExtensionType;
}

export const TestExtensionRunner = <ExtensionType extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType>,
    InitStateType, ChatStateType, MessageStateType, ConfigType>({ factory }: TestExtensionRunnerProps<ExtensionType, InitStateType, ChatStateType, MessageStateType, ConfigType>) => {

    const [extension, _setExtension] = useState(new ChubExtension({...DEFAULT_INITIAL, ...InitData}));
    
    const [node, setNode] = useState(new Date());

    function refresh() {
        setNode(new Date());
    }

    async function delayedTest(test: any, delaySeconds: number) {
        await new Promise(f => setTimeout(f, delaySeconds * 1000));
        return test();
    }

    async function runTests() {
        await extension.setState({someKey: 'A new value, even!'});
        refresh();

        const beforePromptResponse: Partial<StageResponse<ChatStateType, MessageStateType>> = await extension.beforePrompt({
            ...DEFAULT_MESSAGE, ...{
                anonymizedId: "0",
                content: "Hello, this is what happens when a human sends a message, but before it's sent to the model.",
                isBot: false
            }
        });
        console.assert(beforePromptResponse.error == null);
        refresh();

        const afterPromptResponse: Partial<StageResponse<ChatStateType, MessageStateType>> = await extension.afterResponse({
            ...DEFAULT_MESSAGE, ...{
            promptForId: null,
            anonymizedId: "2",
            content: "Why yes hello, and this is what happens when a bot sends a response.",
            isBot: true}});
        console.assert(afterPromptResponse.error == null);
        refresh();

        const afterDelayedThing: Partial<StageResponse<ChatStateType, MessageStateType>> = await delayedTest(() => extension.beforePrompt({
            ...DEFAULT_MESSAGE, ...{
            anonymizedId: "0", content: "Hello, and now the human is prompting again.", isBot: false, promptForId: null
        }}), 5);
        console.assert(afterDelayedThing.error == null);
        refresh();
    }

    useEffect(() => {
        extension.load().then((res) => {
            console.info(`Test StageBase Runner load success result was ${res.success}`);
            if(!res.success || res.error != null) {
                console.error(`Error from extension during load, error: ${res.error}`);
            } else {
                runTests().then(() => console.info("Done running tests."));
            }
        });
    }, []);

    return <>
        <div style={{display: 'none'}}>{String(node)}{window.location.href}</div>
        {extension == null ? <div>StageBase loading...</div> : extension.render()}
    </>;
}
