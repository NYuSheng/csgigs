import Step3 from "../../../../views/Forms/WizardSteps/Step3";
import GigDetailsStep from "./GigDetailsStep";

 export const CreateGigSteps = [
    { stepName: "Details", stepComponent: GigDetailsStep, stepId: "details" },
    { stepName: "Tasks", stepComponent: Step3, stepId: "tasks" }
]