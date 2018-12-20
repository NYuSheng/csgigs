import GigDetailsStep from "./GigDetailsStep";
import GigDescriptionStep from "./GigDescriptionStep";

export const CreateGigSteps = [
    {stepName: "Details", stepComponent: GigDetailsStep, stepId: "details"},
    {stepName: "Description", stepComponent: GigDescriptionStep, stepId: "description"},
];