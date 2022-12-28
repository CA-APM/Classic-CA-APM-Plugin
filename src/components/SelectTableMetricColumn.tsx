import {
    Icon,
    Select,
    InlineLabel
} from '@grafana/ui';
import { METRICCOLUMN_OPTIONS } from '../constants';

import React, { useState, useEffect } from 'react';

export const SelectTableMetricColumn = ({ query, updatedMetricColumnsQuery, theme }) => {
    const [chosenValue, setChosenValue] = useState(query.metricColumns);
    const [options, setOptions] = useState([{ label: 'Loading ...', value: '' }]);

    useEffect(() => {
        let results = [];
        console.log('SelectTableColumns - UseEffect');
        let unmounted = false;

        async function getTableColumnOptions() {
            
            if (!unmounted) {
                   results = METRICCOLUMN_OPTIONS;
                    console.log('Setting tableColumn options: ', results);

                    if (chosenValue) {
                        if (chosenValue.length > 0) {
                            results = results.concat(chosenValue);
                        }
                    }

                    setOptions(results);
                
            }
        }

        getTableColumnOptions();

        return () => {
            unmounted = true;
        };
    }, [chosenValue,theme]);

    return (
        <>
            
            <InlineLabel width={21} tooltip="Columns to be used as metric name for the value column">
                Metric columns
              </InlineLabel>
              <div className="gf-form-label">
                    <Select
                        isMulti={true}
                        options={options}
                        isClearable={true}
                        maxMenuHeight={200}
                        value={chosenValue}
                        isSearchable={true}
                        menuPlacement="bottom"
                        allowCustomValue={true}
                        defaultValue={chosenValue}
                        backspaceRemovesValue={true}
                        prefix={<Icon name="columns" />}
                        width={100}
                        onChange={(v) => {
                            setChosenValue(v);
                            updatedMetricColumnsQuery(v);
                        }}
                        onCreateOption={(v) => {
                            let newQuery: any[] = [];

                            if (typeof chosenValue !== 'undefined') {
                                newQuery = [...chosenValue];
                                newQuery[newQuery.length] = { label: v, value: v };
                            } else {
                                newQuery = [{ label: v, value: v }];
                            }

                            setChosenValue(newQuery);
                            updatedMetricColumnsQuery(newQuery);
                        }}
                    />
                    </div>
               
        </>
    );
};