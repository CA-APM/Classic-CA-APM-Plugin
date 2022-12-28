import { InlineFieldRow, InlineField, Select, Input, ToolbarButton, RadioButtonGroup } from '@grafana/ui';
import React, { useState, useEffect } from 'react';
import { WHERE_OPTIONS,WHERE_CONDITION_OPTIONS } from '../constants';



export const SelectWhereParam = ({ query, updatedWhereQuery,theme }) => {
  const [columnOptions, setColumnOptions] = useState([{ label: 'Loading ...', value: '' }]);



  useEffect(() => {
    let results = [];
    let unmounted = false;

    async function getTableColumnOptions() {
      results = WHERE_OPTIONS;
      if (!unmounted) {
          setColumnOptions(results);
      }
    }
    getTableColumnOptions();
    return () => {
      unmounted = true;
    };
  }, [theme]);

  const values = [...query.where];
  const deleteRow = (index) => {
    let newValue = values;
    newValue.splice(index, 1);
    updatedWhereQuery(newValue);
  };

  const addRow = () => {
    let newValue = values;
    newValue.push({
      1: null,
      2: null,
      3: null,
      4: { label: 'AND', value: 'AND' },
    });
    updatedWhereQuery( newValue);
  };

  const updateValue = (index, key, updateValue) => {
    let newValue = values;
    newValue[index][key] = updateValue;
    updatedWhereQuery(newValue);
  };

  const radioOptions = [
    { label: 'AND', value: 'AND' }
  ];
  
  const fields: JSX.Element[] = [];
  let length = values.constructor.toString().indexOf('Array') !== -1 ? query.where.length : 0;
  for (let i = 0; i < length; i++) {
    fields.push(
      <>
        <InlineFieldRow>
          {i !== 0 && (
            <InlineField  >
              <RadioButtonGroup 
                options={radioOptions}
                value={typeof values[i][4] !== 'undefined' ? values[i][4].value : null}
                onChange={(v) => updateValue(i, 4, { label: v, value: v })}
              />
            </InlineField>
          )}
          <InlineField  label={i === 0 ? 'WHERE' : undefined} labelWidth={i === 0 ? 14 : undefined} >
            <Select
              width={40}
              options={columnOptions}
              value={typeof values[i][1] !== 'undefined' ? values[i][1] : null}
              defaultValue={typeof values[i][1] !== 'undefined' ? values[i][1] : null}
              isSearchable={true}
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              allowCustomValue={true}
              onChange={(v) => updateValue(i, 1, v)}
              onCreateOption={(v) => updateValue(i, 1, { label: v, value: v })}
              maxMenuHeight={200}
            />
          </InlineField>
          <InlineField>
            <Select
              width={20}
              options={WHERE_CONDITION_OPTIONS}
              value={typeof values[i][2] !== 'undefined' ? values[i][2] : null}
              defaultValue={typeof values[i][2] !== 'undefined' ? values[i][2] : null}
              isClearable={true}
              backspaceRemovesValue={true}
              allowCustomValue={true}
              onChange={(v) => updateValue(i, 2, v)}
              onCreateOption={(v) => updateValue(i, 2, { label: v, value: v })}
              maxMenuHeight={200}
            />
          </InlineField>
          <InlineField>
            <Input
              width={40}
              defaultValue={typeof values[i][3] !== 'undefined' ? values[i][3] : ''}
              onBlur={(e) => updateValue(i, 3, e.target.value)}
              onChange={(v) => updateValue(i, 3, v)}
              height={200}
            />
          </InlineField>
          {i > 0 && (
            <InlineField>
              <ToolbarButton icon="trash-alt" variant="destructive" iconOnly={true} onClick={() => deleteRow(i)} />
            </InlineField>
          )}
        </InlineFieldRow>
        {i === length - 1 && (
          <InlineFieldRow>
            <InlineField>
              <ToolbarButton icon="plus" variant="primary" onClick={() => addRow()} />
            </InlineField>
          </InlineFieldRow>
        )}
      </>
    );
  }
  return <>{fields}</>;
};