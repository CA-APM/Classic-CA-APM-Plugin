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
  metricColumns: {"agent_host":"agent_host", "agent_process":"agent_process", "agent_name":"agent_name", "metric_path":"metric_path", "metric_attribute":"metric_attribute"},
  group: {"agent_host":"agent_host", "agent_process":"agent_process", "agent_name":"agent_name", "metric_path":"metric_path", "metric_attribute":"metric_attribute"},
  where: [
    {
      1: null,
      2: null,
      3: null,
      4: null,
    },
  ],
  select: {"*":"*"},
  table: "metric_data",
  format: 'time_series',
  rawQuery: true,
  rawSql: "",
  hide: false
};