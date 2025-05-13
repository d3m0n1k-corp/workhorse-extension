export function list_converters() {
  const converter_list_json = window.list_converters();
  const result: WasmResponse<Converter[]> = JSON.parse(converter_list_json);
  if (result.Error) {
    console.error(result.Error);
  }
  return result;
}

export function execute_converter(
  conv_name: string,
  input: string,
  config: string,
) {
  const result_json = window.execute_converter(conv_name, input, config);
  const result: WasmResponse<string> = JSON.parse(result_json);
  if (result.Error) {
    console.error(result.Error);
  }
  return result;
}

export function chain_execute(chain: ChainRequest[], input: string) {
  const chain_json = window.chain_execute(JSON.stringify(chain), input);
  console.log('Chain JSON: ', chain_json);
  const result: WasmResponse<ChainResult[]> = JSON.parse(chain_json);
  if (result.Error) {
    console.error(result.Error);
  }
  return result;
}
