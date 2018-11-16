import {
    warningCardHeader,
    successCardHeader,
    dangerCardHeader,
    infoCardHeader,
    primaryCardHeader,
    roseCardHeader,
    chatCardHeader,
    brownCardHeader
} from "assets/jss/material-dashboard-pro-react.jsx";

const cardIconStyle = {
    cardIcon: {
        "&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader,&$chatCardHeader,&$brownCardHeader": {
            borderRadius: "3px",
            backgroundColor: "#999",
            padding: "15px",
            marginTop: "-20px",
            marginRight: "15px",
            float: "left"
        }
    },
    warningCardHeader,
    successCardHeader,
    dangerCardHeader,
    infoCardHeader,
    primaryCardHeader,
    roseCardHeader,
    chatCardHeader,
    brownCardHeader
};

export default cardIconStyle;
