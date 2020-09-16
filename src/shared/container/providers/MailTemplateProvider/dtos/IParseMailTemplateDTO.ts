export default interface IParseMailTemplateDTO {
  file: string;
  variables: Record<string, unknown>;
}
