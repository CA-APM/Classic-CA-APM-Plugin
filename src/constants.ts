export const SELECT_OPTIONS = [
    { label: 'source_name', value: 'source_name' },
    { label: 'agent_host', value: 'agent_host' },
    { label: 'agent_process', value: 'agent_process' },
    { label: 'agent_name', value: 'agent_name' },
    { label: 'domain_name', value: 'domain_name' },
    { label: 'metric_path', value: 'metric_path' },
    { label: 'metric_attribute', value: 'metric_attribute' },
    { label: 'attribute_type', value: 'attribute_type' },
    { label: 'frequency', value: 'frequency' },
    { label: 'ts', value: 'ts' },
    { label: 'min_value', value: 'min_value' },
    { label: 'max_value', value: 'max_value' },
    { label: 'agg_value', value: 'agg_value' },
    { label: 'value_count', value: 'value_count' },
    { label: '*', value: '*' },
  ];

  export const METRICCOLUMN_OPTIONS = [
    { label: 'source_name', value: 'source_name' },
    { label: 'agent_host', value: 'agent_host' },
    { label: 'agent_process', value: 'agent_process' },
    { label: 'agent_name', value: 'agent_name' },
    { label: 'domain_name', value: 'domain_name' },
    { label: 'metric_path', value: 'metric_path' },
    { label: 'metric_attribute', value: 'metric_attribute' },
  ];
export const TABLE_OPTIONS = [
    { label: 'metric_data', value: 'metric_data' },
];
  
export const WHERE_OPTIONS = [
    { label: 'agent_host', value: 'expression' },
    { label: 'agent_process', value: 'expression' },
    { label: 'agent_name', value: 'expression' },
    { label: 'domain_name', value: 'expression'},
    { label: 'metric_path', value: 'expression'},
    { label: 'metric_attribute', value: 'expression'},
    { label: 'attribute_type', value: 'expressionwithoutlike' },
    { label: 'frequency', value: 'expressionwithoutlike' },
    { label: 'ts', value: 'expressionwithoutlike' },
    { label: 'min_value', value: 'expressionwithoutlike' },
    { label: 'max_value', value: 'expressionwithoutlike' },
    { label: 'agg_value', value: 'expressionwithoutlike' },
    { label: 'value_count', value: 'expressionwithoutlike' },
  ];

  export const GROUPBY_OPTIONS = [
    { label: 'source_name', value: 'source_name' },
    { label: 'agent_host', value: 'agent_host' },
    { label: 'agent_process', value: 'agent_process' },
    { label: 'agent_name', value: 'agent_name' },
    { label: 'domain_name', value: 'domain_name' },
    { label: 'metric_path', value: 'metric_path' },
    { label: 'metric_attribute', value: 'metric_attribute' },
  ];

export const FORMAT_OPTIONS = [
    { label: 'Time Series', value: 'time_series' },
    { label: 'Table', value: 'table' },
  ]; 

  export const WHERE_CONDITION_OPTIONS = [
    { label: '<', value: '<' },
    { label: '<=', value: '<=' },
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '=', value: '=' },
    { label: 'LIKE', value: 'LIKE' },
    { label: 'BETWEEN', value: 'BETWEEN' }
  ];