import React, { PureComponent,ChangeEvent } from "react";

import {Legend, Field, Input, Icon, Tooltip  } from "@grafana/ui";
import {DataSourcePluginOptionsEditorProps,SelectableValue} from "@grafana/data";
import { DXAPMDataSourceOptions }  from "./types";

interface Props extends DataSourcePluginOptionsEditorProps<DXAPMDataSourceOptions> {}

interface State {

}

export class ConfigEditor extends PureComponent<Props, State> {

  onDXAPMOptionsChange = (eventItem: ChangeEvent<HTMLInputElement> | SelectableValue, key: keyof DXAPMDataSourceOptions) => {
    const { options, onOptionsChange } = this.props;
    const jsonData = {
      ...options.jsonData,
      [key]: eventItem.currentTarget.value,
    };

    onOptionsChange({ ...options, jsonData });

  };

  render() {
    const { options } = this.props;
     const { jsonData } = options;
    return (
      <div className="settings">
        <Legend>DX APM configuration</Legend>

        <Field
          className={'width-30'}
          horizontal
          required
          label="URL"
          description="DX APM Gateway URL."
        >
          <Input
            css={''}
            width={30}
            value={jsonData.url}
            placeholder={'https://apmgw.dxi-na1.saas.broadcom.com'}
            onChange={(event) => this.onDXAPMOptionsChange(event, 'url')}
          />
        </Field>

        <Field
          className={'width-30'}
          horizontal
          required
          label="API Key"
          description="The API Key to access the metric data"
        >
          <Input
            type="password"
            css={''}
            width={30}
            value={jsonData.apiKey}
            suffix={
              <Tooltip
                content={
                  <p>
                    You can create tenant token by following the instructions at&nbsp;
                    <a  href="https://techdocs.broadcom.com/us/en/ca-enterprise-software/it-operations-management/dx-apm-saas/SaaS/configure-your-monitoring-environment/Generate-Security-Token.html"> https://techdocs.broadcom.com/us/en/ca-enterprise-software/it-operations-management/dx-apm-saas/SaaS/configure-your-monitoring-environment/Generate-Security-Token.html
                    </a>
                  </p>
                }
                theme={'info'}
              >
                <Icon name="info-circle" />
              </Tooltip>
            }
            onChange={(event) => this.onDXAPMOptionsChange(event, 'apiKey')}
          />
        </Field>

       
      </div>
    );
  }
}
