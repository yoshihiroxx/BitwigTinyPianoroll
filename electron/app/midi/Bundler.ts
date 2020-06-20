export default interface Bundler {
  bundle: ArrayBuffer;
  build: () => ArrayBuffer;
}
