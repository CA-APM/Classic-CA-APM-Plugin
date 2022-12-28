import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { APMDataQuery, DXAPMDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, APMDataQuery, DXAPMDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);