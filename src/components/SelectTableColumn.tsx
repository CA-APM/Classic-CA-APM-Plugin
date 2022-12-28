import {
    Icon,
    Select,
    InlineLabel
} from '@grafana/ui';
import { SELECT_OPTIONS } from '../constants';

import React, { useState, useEffect } from 'react';

export const SelectTableColumn = ({ query, updatedColumnQuery,theme }) => {
    const [chosenValue, setChosenValue] = useState(query.select);
    const [options, setOptions] = useState([{ label: 'Loading ...', value: '' }]);

    useEffect(() => {
        let results = [];
        console.log('SelectTableColumns - UseEffect');
        let unmounted = false;

        async function getTableColumnOptions() {
            
            if (!unmounted) {
                   results = SELECT_OPTIONS;
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
            
            <InlineLabel width={14} >
                SELECT
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
                        width={110}
                        onChange={(v) => {
                            setChosenValue(v);
                            updatedColumnQuery(v);
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
                            updatedColumnQuery(newQuery);
                        }}
                    />
                    </div>
               
        </>
    );
};