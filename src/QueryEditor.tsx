import React, { useState, useEffect, useRef } from 'react';
import { Select, InlineLabel, SegmentAsync, QueryField, ConfirmModal, useTheme } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import QueryModel from './query_model';
import { DXAPMDataSourceOptions, APMDataQuery,defaultQuery } from './types'
import { cloneDeep } from 'lodash';
import { FORMAT_OPTIONS, TABLE_OPTIONS } from './constants';
import {SelectTableMetricColumn} from './components/SelectTableMetricColumn';
import {SelectTableColumn} from './components/SelectTableColumn';
import {InputGroupBy} from './components/InputGroupBy';
import {SelectWhereParam} from './components/SelectWhereParam';
import { defaults } from 'lodash';


type Props = QueryEditorProps<DataSource, APMDataQuery, DXAPMDataSourceOptions>;

const normalizeQuery = (query: APMDataQuery) => {
  if (
    query.table !== undefined &&
    query.metricColumns !== undefined &&
    query.select !== undefined &&
    query.where !== undefined &&
    query.group !== undefined
  ) {
    return query;
  }
  const queryCopy = cloneDeep(query); 
  const q = defaults(queryCopy, defaultQuery);
  return new QueryModel(q).target;
};

const noHorizMarginPaddingClass = {
  paddingLeft: '0',
  paddingRight: '0',
  marginLeft: '0',
  marginRight: '0',
};

export const QueryEditor = (props: Props): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFirstTime = useRef(true);
  const { datasource, onBlur, onRunQuery, onChange } = props;
  const query = normalizeQuery(props.query);
  const { table, format, rawQuery, rawSql, hide } = query;
  const formatData = FORMAT_OPTIONS.filter((formatItem) => formatItem.value === format)[0];
  const theme = useTheme();
  const buttonStyle = {
    marginLeft: '5px',
  };

  
  useEffect(() => {
    if (isFirstTime.current) {
      onApplyQueryChange(query);
      isFirstTime.current = false;
    }
    
  }, []);

  
  const onQueryTextChange = (value: string, override?: boolean) => {
    onApplyQueryChange({ ...query, rawSql: value }, override);
  };

  
  const onFormatChange = (value: SelectableValue) => {
    onApplyQueryChange({ ...query, format: value.value });
  };

 
  const showConfirmPrompt = () => {
    if (query.rawQuery) {
      setIsModalOpen(true);
    } else {
      const queryModel = new QueryModel(query);
      onApplyQueryChange({ ...query, rawQuery: true, rawSql: queryModel.buildQuery() }, false);
    }
  };

  
  const toggleQueryBuilder = () => {
    setIsModalOpen((prevState) => !prevState);
    const queryModel = new QueryModel(query);
    onApplyQueryChange(
      { ...query, rawQuery: !query.rawQuery, rawSql: !query.rawQuery ? queryModel.buildQuery() : rawSql },
      false
    );
  };

 
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const updatedMetricColumnsQuery = (value: any) => {
    onApplyQueryChange({ ...query, metricColumns: value });
   
  };

  const updatedColumnQuery = (value: any) => {
    onApplyQueryChange({ ...query, select: value });
   
  };

  const updatedGroupByQuery = (value: any) => {
    onApplyQueryChange({ ...query, group: value });
   
  };


  const updatedWhereQuery = (value: any) => {
    onApplyQueryChange({ ...query, where: value });
   
  };

 
  const onApplyQueryChange = (changedQuery: APMDataQuery, runQuery = true) => {
    
      if (!changedQuery.rawQuery) {
        const queryModel = new QueryModel(changedQuery);
        changedQuery.rawSql = queryModel.buildQuery();
      }
      onChange({ ...changedQuery });
    
    if (runQuery && onRunQuery) {
      onRunQuery();
    }
  };


  
  const handleFromChange = (data: any) => {
    onApplyQueryChange({ ...query, table: data.value.trim() });
  }; 

  const selectStyle = {
    paddingLeft: '0',
    lineHeight: theme.typography.lineHeight.sm,
    fontSize: theme.typography.size.sm,
  };

  const getTableOptions = () => {

    return new Promise<Array<SelectableValue<string>>>((resolve) => {
      setTimeout(async () => {
        resolve(TABLE_OPTIONS);
      }, 0);
    });
  };

  

  return (
    <>
      {rawQuery ? (
        <>
          <div className="gf-form">
            <QueryField
              key={datasource?.name}
              portalOrigin="caapm"
              query={rawSql}
              disabled={hide}
              onBlur={onBlur}
              onRunQuery={onRunQuery}
              onChange={onQueryTextChange}
            />
          </div>
          <div className="gf-form-inline">
            <InlineLabel  width={10}>
              Format as
            </InlineLabel>
            <Select onChange={onFormatChange} options={FORMAT_OPTIONS} width={16} defaultValue={formatData} />
            <InlineLabel style={{ ...buttonStyle, cursor: 'pointer' }} width={14} onClick={showConfirmPrompt}>
              {rawQuery ? `Query Builder` : `Edit SQL`}
            </InlineLabel>
            <div className="gf-form gf-form--grow">
              <label className="gf-form-label gf-form-label--grow"></label>
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="gf-form-inline">
            <div className="gf-form">
              <InlineLabel width={14} >
                FROM TABLE
              </InlineLabel>
              <div className="gf-form-label" style={selectStyle}>
                <SegmentAsync
                  style={noHorizMarginPaddingClass}
                  loadOptions={getTableOptions}
                  value={table}
                  onChange={(data) => {
                    handleFromChange(data);
                  }}
                />
              </div>
                        
            </div>
            <div className="gf-form gf-form--grow">
              <label className="gf-form-label gf-form-label--grow"></label>
            </div>
           </div>
        
           <div className="gf-form-inline">
           <SelectTableMetricColumn query={query} updatedMetricColumnsQuery={updatedMetricColumnsQuery}  theme={theme} />
           <div className="gf-form gf-form--grow">
              <label className="gf-form-label gf-form-label--grow"></label>
            </div>
              </div>

           <div className="gf-form-inline">
              <SelectTableColumn query={query} updatedColumnQuery={updatedColumnQuery}  theme={theme} />
              <div className="gf-form gf-form--grow">
              <label className="gf-form-label gf-form-label--grow"></label>
            </div>
              </div>

              <div className="gf-form-inline">

              <SelectWhereParam
            query={query}
            updatedWhereQuery={updatedWhereQuery}
             theme={theme}
          />

<div className="gf-form gf-form--grow">
              <label className="gf-form-label gf-form-label--grow"></label>
            </div>
              </div>


              
           <div className="gf-form-inline">
              <InputGroupBy query={query} updatedGroupByQuery={updatedGroupByQuery}  theme={theme} />
              <div className="gf-form gf-form--grow">
              <label className="gf-form-label gf-form-label--grow"></label>
            </div>
              </div>

              <div className="gf-form-inline">
            <InlineLabel  width={10}>
              Format as
            </InlineLabel>
            <Select onChange={onFormatChange} options={FORMAT_OPTIONS} width={16} defaultValue={formatData} />
            <InlineLabel style={{ ...buttonStyle, cursor: 'pointer' }} width={10} onClick={showConfirmPrompt}>
              {rawQuery ? `Query Builder` : `Edit SQL`}
            </InlineLabel>
            <div className="gf-form gf-form--grow">
              <label className="gf-form-label gf-form-label--grow"></label>
            </div>
          </div>
    
        </div>   
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Warning"
        body="Switching to query builder may overwrite your raw SQL."
        confirmText="Switch"
        onConfirm={() => {
          toggleQueryBuilder();
        }}
        onDismiss={() => {
          handleModalClose();
        }}
      />
    </>
  );
};