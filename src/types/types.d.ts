declare module "solc" {
  export type StandardJsonInput = any;
  export type SolcCompilerOutput = any;
  export function compile(json: string): string;
}
