import * as _ from 'lodash';
import {
  DataSourceApi,
  DataSourceInstanceSettings,
  DataQueryRequest,
  DataQueryResponse,
  LoadingState,
} from '@grafana/data';
import { DXAPMDataSourceOptions, APMDataQuery } from './types';
import { getDataSourceSrv, getBackendSrv, BackendSrvRequest } from '@grafana/runtime';
//import { isNull } from 'lodash';

export class DataSource extends DataSourceApi<APMDataQuery, DXAPMDataSourceOptions> {
  type: string;
  url: string;
  name: string;
  headers: any;
  dataSourceSrv: any;
  templateSrv: any;

  constructor(instanceSettings: DataSourceInstanceSettings<DXAPMDataSourceOptions>) {
    super(instanceSettings);
    this.dataSourceSrv = getDataSourceSrv();
    this.templateSrv = this.dataSourceSrv.templateSrv;
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
  }

  async query(options: DataQueryRequest<APMDataQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range.from.unix() * 1000;
    const to = range.to.unix() * 1000;
    const frequency = this.getFrequency(options.range);

    const promises = _.map(options.targets, (t) => {
      if (t.hide) {
        return [];
      }
      let target = _.cloneDeep(t);
      return this.queryTable(target, from, to, frequency);
    });

    return Promise.all(_.flatten(promises))
      .then(_.flatten)
      .then((data) => {
        return {
          data,
          state: LoadingState.Done,
          key: options.requestId,
        };
      });
  }

  async queryTable(target, from, to, frequency) {
    const requestPayload: BackendSrvRequest = {
      method: 'POST',
      url: `${this.url}/broadcomdxapm/apm/appmap/private/apmData/query`,
    };
    let queryPayload = this.getQueryPayload(target, from, to, frequency);
    console.log(queryPayload);
    requestPayload.data = queryPayload;
    return getBackendSrv()
      .datasourceRequest(requestPayload)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        return this.mapResponseToFrame(response.data, target);
      })
      .catch((error) => {
        console.error('table query error: ', error);
        throw new Error(error.data.error.message);
      });
  }

  mapResponseToFrame(result, target) {
    if (target.format === 'table') {
      const columns = [];
      const rows = [];

      if (!_.isEmpty(result.columns)) {
        const headers = result.columns;
        headers.forEach((header) => {
          columns.push({
            text: header.name,
            filterable: true,
          });
        });
        if (!_.isEmpty(result.rows)) {
          const rowvalues = result.rows;
          rowvalues.forEach((row) => {
            rows.push([...row]);
          });
        }
      }
      return {
        columns: [...columns],
        rows: [...rows],
        type: 'table',
      };
    } else {
      const seriesList = [];
      return this.processSeries(result, seriesList, target);
    }
  }

  processSeries(result, seriesList, target) {
    let metricFullPath: {
      1: number | null;
      2: number | null;
      3: number | null;
      4: number | null;
      5: number | null;
      6: number | null;
      7: number | null;
      8: number | null;
    } = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null };

    let is_agg_set = 0;
    result.columns.map((column, j) => {
      switch (column.name) {
        case 'agent_host':
          metricFullPath[2] = j;
          break;
        case 'agent_process':
          metricFullPath[3] = j;
          break;
        case 'agent_name':
          metricFullPath[4] = j;
          break;
        case 'domain_name':
          metricFullPath[1] = j;
          break;
        case 'metric_path':
          metricFullPath[5] = j;
          break;
        case 'metric_attribute':
          metricFullPath[6] = j;
          break;
        case 'agg_value':
          metricFullPath[7] = j;
          is_agg_set = 1;
          break;
        case 'max_value':
          if (!is_agg_set) {
            metricFullPath[7] = j;
          }
          break;
        case 'min_value':
          if (!is_agg_set) {
            metricFullPath[7] = j;
          }
          break;
        case 'ts':
          metricFullPath[8] = j;
          break;
        default:
          let columnName = column.name;
          if (columnName.includes('agg') && null === metricFullPath[7]) {
            metricFullPath[7] = j;
            break;
          }
      }
    });

    result.rows.map((row) => {
      let seriesName = this.getSeriesName(metricFullPath, row);
      let seriesObjdef = seriesList.find((i) => i.target === seriesName);
      if (seriesObjdef === undefined) {
        // must create a new object
        let seriesObj = { target: seriesName, datapoints: [] };
        // console.log(
        //   'seriesName: ' + seriesName + ' not found, adding ' + row[metricFullPath[7]] + ', ' + row[metricFullPath[8]]
        // );

        seriesObj.datapoints.push([row[metricFullPath[7]], row[metricFullPath[8]]]);
        seriesList.push(seriesObj);
      } else {
        // console.log(
        //   'seriesName: ' + seriesName + ' found, adding ' + row[metricFullPath[7]] + ', ' + row[metricFullPath[8]]
        // );
        seriesObjdef.datapoints.push([row[metricFullPath[7]], row[metricFullPath[8]]]);
      }
    });

    // console.log(seriesList);

    return seriesList;
  }

  getSeriesName(metricFullPath: any, row: any): any {
    let seriesName = '';
    // ignore metric_attribute (index 6) as it is alreday part of metric_path
    for (let i = 1; i <= 5; i++) {
      if (metricFullPath[i] !== undefined && metricFullPath[i] != null) {
        if (seriesName.length > 0) {
          if (i === 6) {
            seriesName += ':' + row[i];
            // put domain_name (index 4) first
          } else if (i === 4) {
            seriesName = row[i] + '|' + seriesName;
          } else {
            seriesName += '|' + row[i];
          }
        } else {
          seriesName = '' + row[i];
        }
      }
    }
    return seriesName;
  }

  getQueryPayload(target, from, to, frequency?): any {
    let sqlPayload = '';
    let rawSqlQuery = target.rawSql;
    let whereConditions = ' ts BETWEEN ' + from + ' AND ' + to + ' ';
    var index = rawSqlQuery.indexOf('WHERE');
    if (index !== -1) {
      index = index + 5;
      sqlPayload = rawSqlQuery.slice(0, index) + whereConditions + ' AND ' + rawSqlQuery.slice(index);
    } else {
      sqlPayload = rawSqlQuery + ' WHERE ' + whereConditions;
    }
    let queryPayload = `{"query":"${sqlPayload}"}`;
    return queryPayload;
  }

  getFrequency(dataRange: any): any {
    const durationMinutes = Math.ceil(dataRange.to.diff(dataRange.from) / 60000);
    switch (true) {
      case durationMinutes < 60 * 3:
        return 15;
      case durationMinutes < 60 * 6:
        return 30;
      case durationMinutes < 60 * 12:
        return 60;
      case durationMinutes < 60 * 24:
        return 60 * 2;
      case durationMinutes < 60 * 24 * 2:
        return 60 * 5;
      case durationMinutes < 60 * 24 * 7:
        return 60 * 15;
      case durationMinutes < 60 * 24 * 30:
        return 60 * 60;
      case durationMinutes < 60 * 24 * 30 * 3:
        return 60 * 60 * 6;
      case durationMinutes < 60 * 24 * 30 * 6:
        return 60 * 60 * 12;
      case durationMinutes < 60 * 24 * 30 * 12:
        return 60 * 60 * 24;
      case durationMinutes < 60 * 24 * 30 * 24:
        return 60 * 60 * 24 * 2;
      case durationMinutes < 60 * 24 * 30 * 60:
        return 60 * 60 * 24 * 4;
      default:
        return 2628000 * 12;
    }
  }

  async testDatasource() {
    const requestPayload: any = {
      url: `${this.url}/broadcomdxapm/apm/appmap/private/apmData/schema`,
      method: 'GET',
    };

    return await getBackendSrv()
      .datasourceRequest(requestPayload)
      .then(() => {
        return {
          status: 'success',
          message: 'Data source is working',
        };
      })
      .catch((err) => {
        console.log(err);
        return { status: 'error', message: `${err.status}: ${err.statusText}` };
      });
  }
}
