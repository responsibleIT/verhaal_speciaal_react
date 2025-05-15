declare module "*.svg" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const content: string;

  export { ReactComponent };
  export default content;
}
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

