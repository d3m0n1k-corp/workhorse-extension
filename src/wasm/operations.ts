export function list_converters() {
    const converter_list_json = window.list_converters();
    const conv_list: ConverterDiscoveryResponse = JSON.parse(converter_list_json);
    if (conv_list.Error) {
        console.error(conv_list.Error);
    }
    return conv_list;
}

export function execute_converter(conv_name: string, input: string, config: string) {
    const result_json = window.execute_converter(conv_name, input, config);
    var result: ConverterExecutionResponse = JSON.parse(result_json);
    if (result.Error) {
        console.error(result.Error);
    }
    return result;
}