import React from "react";

// core components
import FilterDropdown from "components/Gigs/Filter/FilterDropdown.jsx";

class Filter extends React.Component {

    render() {
        const { filterName, filterFunction } = this.props;
        return(
            <FilterDropdown
                buttonText={filterName}
                hoverColor="info"
                buttonProps={{
                    round: false,
                    block: true,
                    color: "info"
                }}
                dropPlacement="bottom"
                dropdownList={[
                    <FilterDropdown
                        ref="multi"
                        innerDropDown
                        buttonText="status"
                        hoverColor="info"
                        buttonProps={{
                            simple: true,
                            block: true
                        }}
                        dropPlacement="right-start"
                        dropdownList={[
                            "Draft",
                            "Active",
                            "Completed",
                            "Cancelled"
                        ]}
                        onClickFunction={filterFunction}
                    />
                ]}
            />
        );
    }
}

export default Filter;