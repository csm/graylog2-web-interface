/** @jsx React.DOM */

// TODO: Module concept and build process
$(document).ready(function () {

    var ColumnSorter = React.createClass({
        sortAscending: function() {
            console.error("Ascending sort not implemented, yet");
            console.error("Should really sort column " + this.props.fieldName + " on page " + this.props.page);
        },
        sortDescending: function() {
            console.error("Descending sort not implemented, yet");
            console.error("Should really sort column " + this.props.fieldName + " on page " + this.props.page);
        },
        render: function() {
            return (<span>
                <a onClick={this.sortAscending}>
                    <i className="icon icon-sort-by-attributes-alt icon-flip-vertical sort-order sort-order-asc choose-sort-order" title="Sort ascending"></i>
                </a>
                <a onClick={this.sortDescending}>
                    <i className="icon icon-sort-by-attributes-alt sort-order choose-sort-order sort-order-desc" title="Sort descending"></i>
                </a>
            </span>);
        }
    });

    var SearchResult = React.createClass({
        handleResultClicked: function (result, e) {
            console.error("Selection of result not implemented, yet");
            console.error("Should display details of ", result);
        },
        render: function () {
            var result = this.props.message.message;
            var fields = this.props.selectedFields;
            return <tr onClick={this.handleResultClicked.bind(this, result)}>{fields.map(function (field, index) {
                return <td key={"result-field-" + index}>{result[field]}</td>
            })}</tr>;
        }
    });

    var SearchResultHeader = React.createClass({
        render: function() {
            var style = null;
            if (this.props.width) {
                style = {
                    width: this.props.width
                };
            }
            return (<th style={style}>{this.props.title} <ColumnSorter fieldName={this.props.fieldName} search={this.props.search} page={this.props.page}/></th>);
        }
    });

    var SearchResults = React.createClass({
        getInitialState: function () {
            // TODO: How do we deal with constants like this?
            var defaultFields = ['timestamp', 'source', 'message'];
            return {search: dummyData, page: 1, defaultFields: defaultFields, selectedFields: defaultFields.concat([/* XXX: just because */ 'http_method'])};
        },
        render: function () {
            var timestampHeader = <SearchResultHeader title="TimeStamp" width="135px" fieldName="timestamp" search={this.state.search} page={this.state.page}/>;
            var sourceHeader = <SearchResultHeader title="Source" width="180px" fieldName="source" search={this.state.search} page={this.state.page}/>; // TODO: Only display when in selected fields and actually present in search result
            var messageHeader = <SearchResultHeader title="Message" width="180px" fieldName="message" search={this.state.search} page={this.state.page}/>; // TODO: Only display when in selected fields and actually present in search result

            return (<div>
                <h1>Results rendered by react</h1>
                <table className="table table-condensed table-hover table-striped messages">
                    <thead>
                    {timestampHeader}
                    {sourceHeader}
                    {messageHeader}
                    {
                        this.state.selectedFields.filter(function(field) {
                            return this.state.defaultFields.indexOf(field) === -1;
                        }, this).map(function(field, index) {
                            return <SearchResultHeader key={"result-header-" + index} title={field} fieldName={field} search={this.state.search} page={this.state.page}/>
                        }, this)
                    }
                    </thead>
                    <tbody>{this.state.search.messages.map(function (message, index) {
                        return <SearchResult key={"result-" + index} message={message} selectedFields={this.state.selectedFields} />;
                    }, this)}
                    </tbody>
                </table>
            </div>);
        }
    });

    // TODO: Should we base our work on
    // http://react-bootstrap.github.io/
    // an incomplete wrapper of bootstrap javascript components for react???

    // adapted from react examples (https://github.com/facebook/react/tree/master/examples/jquery-bootstrap)
    var BootstrapModal = React.createClass({
        // The following two methods are the only places we need to
        // integrate with Bootstrap or jQuery!
        componentDidMount: function () {
            // When the component is added, turn it into a modal
            $(this.getDOMNode())
                .modal({backdrop: 'static', keyboard: false, show: false})
        },
        componentWillUnmount: function () {
            // Olli: WTF? Copied from examples, but does it make *any* sense?
            $(this.getDOMNode()).off('hidden', this.handleHidden);
        },
        close: function () {
            $(this.getDOMNode()).modal('hide');
        },
        open: function () {
            $(this.getDOMNode()).modal('show');
        },
        render: function () {
            var confirmButton = null;
            var cancelButton = null;

            if (this.props.confirm) {
                confirmButton = (
                    <a role="button" className="btn btn-primary" onClick={this.handleConfirm}>
                      {this.props.confirm}
                    </a>
                    );
            }
            if (this.props.cancel) {
                cancelButton = (
                    <a role="button" className="btn btn-primary" onClick={this.handleCancel}>
                      {this.props.cancel}
                    </a>
                    );
            }

            return (
                <div className="modal hide fade">
                    <div className="modal-header">
                        <button
                        type="button"
                        className="close"
                        onClick={this.handleCancel}
                        dangerouslySetInnerHTML={{__html: '&times'}}
                        />
                        // XXX: if there is only on child, it is not in an array
                        {Array.isArray(this.props.children) ? this.props.children[0] : this.props.children}
                    </div>
                    <div className="modal-body">
                        {this.props.children[1]}
                    </div>
                    <div className="modal-footer">
                      {cancelButton}
                      {confirmButton}
                    </div>
                </div>
                );
        },
        handleCancel: function () {
            if (this.props.onCancel) {
                this.props.onCancel();
            }
        },
        handleConfirm: function () {
            if (this.props.onConfirm) {
                this.props.onConfirm();
            }
        }
    });

    var DebugButton = React.createClass({
        // https://github.com/zeroclipboard/zeroclipboard
        componentDidMount: function () {
            this.copyDomNode = this.refs.copy.getDOMNode();
            $(this.copyDomNode).tooltip({title: 'Copy Query', trigger: 'manual'});
            // XXX: We need to make this manual and outside of react in order not to interfere with the evil clipboard
            var clipBoardClient = new ZeroClipboard(this.copyDomNode);
            clipBoardClient.on( 'mouseover', function(client, args) {
                $(this).tooltip('show');
            });
            clipBoardClient.on( 'mouseout', function(client, args) {
                $(this).tooltip('hide');
            });
            clipBoardClient.on( 'complete', function(client, args) {
                $(this).tooltip('destroy');
            });
        },
        render: function () {
            var formattedQuery = JSON.stringify(JSON.parse(this.props.data.built_query), null, 4);
            var header = <h2>
                <i ref="copy" className="icon-copy" data-clipboard-target="build-query"></i>
            &nbsp;
            ElasticSearch Query
            </h2>;
            var body = <pre id="build-query">{formattedQuery}</pre>;
            var modal = (
                <BootstrapModal ref="modal" onCancel={this.closeModal} onConfirm={this.closeModal}>
               {header}
               {body}
                </BootstrapModal>
                );
            return <span>
                <a onClick={this.openModal} className="btn btn-small" role="button">
                    <i className="icon-bug"></i>
                </a>
               {modal}
            </span>;
        },
        closeModal: function () {
            this.refs.modal.close();
        },
        openModal: function () {
            this.refs.modal.open();
        }

    });

    // TODO: How to we selectively add react component into otherwise static html?
    // Do we just have a single big react component for the relevant parts of a page?
    Array.prototype.slice.call(document.querySelectorAll('[debug]')).forEach(function (mountNode) {
        React.renderComponent(<DebugButton data={dummyData}/>, mountNode);
    });
    var mountNode = document.getElementById('react-search-result');
    if (mountNode) React.renderComponent(<SearchResults />, mountNode);
});