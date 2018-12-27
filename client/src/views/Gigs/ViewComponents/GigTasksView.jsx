import React from "react";

// @material-ui/core components
import TableCell from "@material-ui/core/TableCell";

// core components
import CustomTabs from "components/Gigs/CustomTabs/CustomTabs";
import Tasks from "components/Gigs/Tasks/Tasks";
import AddTask from "components/Gigs/PopupModals/Dialog/AddTask";

class GigTasksView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            addTaskModelOpen: false
        };
    }

    componentWillMount() {
        const {gigId} = this.props;
        console.log(gigId);
        this.setupData(gigId);
    }

    setupData(gigId) {
        // call api to get out gig admins
        // set state of this component
    }

    organizeTabContent(tasks) {
        var toReturn = [];
        var organizedContent = [];

        if (tasks) {
            tasks.forEach(function (task) {
                var category = task.task_category;
                if (organizedContent.hasOwnProperty(category)) {
                    organizedContent[category].push(task)
                } else {
                    organizedContent[category] = [];
                    organizedContent[category].push(task)
                }
            });

            for (var key in organizedContent) {
                if (organizedContent.hasOwnProperty(key)) {
                    var i;
                    var tasksIndexesArray = []
                    for (i = 0; i < organizedContent[key].length; i++) {
                        tasksIndexesArray.push(i);
                    }
                    toReturn.push({
                        tabName: key,
                        tabContent: (
                            <Tasks
                                tasksIndexes={tasksIndexesArray}
                                tasks={organizedContent[key]}
                                editTask={this.editTask.bind(this)}
                                removeTask={this.removeTask.bind(this)}
                                assignUsers={this.assignUsers.bind(this)}
                            />
                        )
                    });
                }
            }
        }

        return toReturn;
    }

    openAddTaskPopup() {
        this.setState({
            addTaskModelOpen: true
        })
    }

    hidePopup() {
        this.setState({
            modalOpen: false
        });
    }

    render() {
        const {classes} = this.props;
        const {addTaskModelOpen, tasks} = this.state;

        return (
            <div>
                {/*<AddTask modalOpen={addTaskModelOpen} hideTask={this.hidePopup.bind(this)} gig={gig}/>*/}
                <CustomTabs
                    title="Tasks:"
                    headerColor="teal"
                    tabs={this.organizeTabContent(tasks)}
                    //addContent={this.addTaskModelOpen.bind(this)}
                />
            </div>
        );
    }
}

export default GigTasksView;