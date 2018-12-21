import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Async from "react-async";

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}

function renderSuggestion({ suggestion, index, itemProps }) {
    return (
        <MenuItem
            {...itemProps}
            key={suggestion['_id']}
            component="div"
            style={{
                fontWeight: 400,
            }}
        >
            {suggestion.name}
        </MenuItem>
    );
}

function processSuggestion(value, users) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    users.filter(user => {  
        const keep = count < 5;
        if(keep){
            count += 1;
        }
        return keep;
    });
    return users;
}

const fetchUsers = async ({inputValue}) => {
    const data = await fetch('/admin-ui/api/users/usersByPrefix', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name :inputValue
    })});
    if (data.status !== 200) {
        console.log("error");
        return [];
    } else {
        const json = await data.json();
        return processSuggestion(inputValue, json.users);
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

class AutoComplete extends React.Component {

    state = {
        inputValue: ''
    };

    handleInputChange = event => {
        this.setState({ inputValue: event.target.value });
    };

    handleChange = item => {
        const { selectInput } = this.props

        this.setState({
            inputValue: '',
        });
        selectInput(item)
    };

    render() {
        const { classes } = this.props;
        const { inputValue } = this.state;

        return (
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                selectedItem={null}
                onChange={this.handleChange}
            >
                {({
                      getInputProps,
                      getItemProps,
                      isOpen,
                      inputValue: inputValue2,
                  }) => (
                    <div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            InputProps: getInputProps({
                                placeholder: 'Search a user by name',
                                onChange: this.handleInputChange,
                            }),
                        })}
                        {isOpen ? (
                            <Paper className={classes.paper} square>
                                <Async promiseFn={fetchUsers} inputValue={inputValue2} watch={inputValue2}>
                                    <Async.Loading>Loading..</Async.Loading>
                                    <Async.Resolved>
                                        {users => (
                                            users.map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({ item: suggestion })
                                        }))
                                        )}
                                    </Async.Resolved>
                                    <Async.Rejected>Error</Async.Rejected>
                                </Async>
                            </Paper>
                        ) : null}
                    </div>
                )}
            </Downshift>
        );
    }
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

export default withStyles(styles)(AutoComplete);

