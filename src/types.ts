import { DataQuery, DataSourceJsonData,SelectableValue  } from "@grafana/data";

export interface DXAPMDataSourceOptions extends DataSourceJsonData {
  url: string;
  apiKey: string;
}

export type ResultFormat = 'time_series' | 'table';
export interface APMDataQuery extends DataQuery {
  metricColumns: SelectableValue<string>;
  group: SelectableValue<string>;
  where:  Array<{
    1: SelectableValue<string> | null;
    2: SelectableValue<string> | null;
    3: string | null;
    4: SelectableValue<string> | null;
  }>;
  select: SelectableValue<string>;
  table: string;
  format: ResultFormat;
  rawQuery: boolean;
  rawSql: string;
  queryText?: string;
  hide: boolean;
}

export const defaultQuery: Partial<APMDataQuery> = {

  metricColumns: [
    { label: 'source_name', value: 'source_name' },
    { label: 'agent_host', value: 'agent_host' },
    { label: 'agent_process', value: 'agent_process' },
    { label: 'agent_name', value: 'agent_name' },
    { label: 'domain_name', value: 'domain_name' },
    { label: 'metric_path', value: 'metric_path' },
    { label: 'metric_attribute', value: 'metric_attribute' },
  ],
  group:  [
    { label: 'source_name', value: 'source_name' },
    { label: 'agent_host', value: 'agent_host' },
    { label: 'agent_process', value: 'agent_process' },
    { label: 'agent_name', value: 'agent_name' },
    { label: 'domain_name', value: 'domain_name' },
    { label: 'metric_path', value: 'metric_path' },
    { label: 'metric_attribute', value: 'metric_attribute' },
  ],
    
   where: [
    {
      1: null,
      2: null,
      3: null,
      4: null,
    },
  ],
  select: [{label: "*", value: ".*"}],
  table: "metric_data",
  format: 'time_series',
  rawQuery: true,
  rawSql: "",
  hide: false
};