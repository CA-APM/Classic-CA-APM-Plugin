# Changelog

## 1.1.0

* 5bb2fa9 - support top n filter, e.g. select top 5 * from ... (2023-03-30)
* d74b8a2 - support mapping fields in table view, e.g. select agg_value as foobar ... (2023-03-30)
* 94d9aed - added variable support (2023-03-13)
* c61f1f4 - FIX: use metricFullPath[i], not plain i as index to row for building seriesName (2023-02-14)
* 683e098 - if there is no agg_value column show min_value or max_value (2023-02-14)
* 13ad147 - fixed timeseries data 1. if we find a reference in the list don't add it again! 2. create a new object for every series, one const object was used for all series and eventually conained all data (2023-01-05)
* 21f5e3b - reformatted legend in getSeriesName() (2023-01-05)
## 1.0.0
* 7577401 - qa feedback (2022-12-29)
* ef4a40c - commit (2022-12-28)
* b7ba0d7 - plugin (2022-12-28)
* 485be30 - Initial commit (2022-12-28)
