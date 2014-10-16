/** @jsx React.DOM */

'use strict';

var mergeInto = require('../../lib/util').mergeInto;
var AbstractEventSendingStore = require('../AbstractEventSendingStore');
var $ = require('jquery'); // excluded and shimed

var HistogramDataStore = {
    HISTOGRAM_URL: '/a/search/histogram',

    setHistogramData(histogramData) {
        this._histogramData = histogramData;
        this._emitChange();
    },

    getHistogramData() {
        return this._histogramData && JSON.parse(JSON.stringify(this._histogramData));
    },

    loadHistogramData(range, sourceNames) {
        var url = this.HISTOGRAM_URL;
        var q = "";
        if (typeof sourceNames !== 'undefined' && sourceNames instanceof Array) {
            q = encodeURIComponent(sourceNames.map((source) => "source:" + source).join(" OR "));
        }
        if (typeof range !== 'undefined') {
            var interval = 'minute';
            if (range >= 365 * 24 * 60 * 60 || range === 0) {
                // for years and all interval will be day
                interval = 'day';
            } else if (range >= 31 * 24 * 60 * 60) {
                // for months interval will be day
                interval = 'hour';
            }
            url += `?q=${q}&rangetype=relative&relative=${ range }&interval=${interval}`;
        }
        var successCallback = (data) => this.setHistogramData(data);
        var failCallback = (jqXHR, textStatus, errorThrown) => {
            console.error("Loading of histogram data failed with status: " + textStatus);
            console.error("Error", errorThrown);
            alert("Could not retrieve histogram data from server - try reloading the page");
        };
        $.getJSON(url, successCallback).fail(failCallback);
    }
};
mergeInto(HistogramDataStore, AbstractEventSendingStore);

module.exports = HistogramDataStore;
