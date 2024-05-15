import {ReactRunner} from "@chub-ai/stages-ts";
import {ChubExtension} from "./ChubExtension";
import {TestExtensionRunner} from "./TestRunner";

function App() {
  const isDev = import.meta.env.MODE === 'development';
  console.info(`Running in ${import.meta.env.MODE}`);

  return isDev ? <TestExtensionRunner factory={ (data: any) => new ChubExtension(data) }/> :
      <ReactRunner factory={(data: any) => new ChubExtension(data)} />;
}

export default App
