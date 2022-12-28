import { APMDataQuery } from './types';
import { unwrap } from './unwrap';


export default class QueryModel {
  target: APMDataQuery;


  constructor(target: APMDataQuery) {
    this.target = target;
    target.metricColumns = target.metricColumns || [];
    target.table = target.table || 'metric_data';


    target.group = target.group || [];
    target.where = target.where || [];
    target.select = target.select || [];

    target.format = target.format || 'time_series';
    target.hide = target.hide ?? false;

    target.rawQuery = target.rawQuery ?? true;

    if (target.rawQuery) {
      target.rawSql =
        target.rawSql ||
        'SELECT * FROM metric_data WHERE agent_name LIKE \'%INFRA%\'';
    } else {
      target.rawSql = target.rawSql || this.buildQuery();
    }
  }
  
  buildSelectColumns() {
    let query = ' ';
    let selectSection = '';
   
    for (let i = 0; i < this.target.select.length; i++) {
      const part = this.target.select[i];
      if (i > 0) {
        selectSection += ', ';
      }
       
        selectSection += ''+part;
      
    }

    if (selectSection.length) {
      query = '' + selectSection;
     
    }
    return query;
    
  }

  buildWhereClause() {
    let query = '';
    let conditionSection = '';
   
      for (let i = 0; i < this.target.where.length; i++) {
       const part = this.target.where[i];
       if(i > 0)
       {
        conditionSection += ' AND ';
       }
       if(part[1]!=null && part[2]!=null)
       {
       conditionSection += ' ' + unwrap(part[1]).label;
       conditionSection += ' ' + unwrap(part[2]).value;
       conditionSection += ' \'' + part[3] + '\'';
      }

    if (conditionSection.length > 0) {
      query = ' WHERE ' + conditionSection;
    }
  }

    return query;
  }

  buildGroupClause() {
    let query = '';
    let groupSection = '';
   
    for (let i = 0; i < this.target.group.length; i++) {
      const part = this.target.group[i];
      if (i > 0) {
        groupSection += ', ';
      }
      
        groupSection += ''+part;
      
    }
  

    if (groupSection.length) {
      query = ' GROUP BY ' + groupSection;
     
    }
    return query;
  }

  buildQuery() {
    let query = 'SELECT';
    query += ' ' + this.buildSelectColumns();          
    query += ' FROM ' + this.target.table; 
    query +=  ' '+this.buildWhereClause();
    query += ' '+this.buildGroupClause();
    return query;
  }
}