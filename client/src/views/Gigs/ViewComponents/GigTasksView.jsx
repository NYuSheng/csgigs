import React from "react";

// core components
import CustomTabs from "components/Gigs/CustomTabs/CustomTabs";
import Tasks from "components/Gigs/Tasks/Tasks";
import AddTask from "components/Gigs/PopupModals/Dialog/AddTask";
import EditTask from "components/Gigs/PopupModals/Dialog/EditTask";
import {retreive} from "components/Gigs/API/Tasks/Tasks";

class GigTasksView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTask: null,
            tasks: [],
            addTaskModalOpen: false,
            editTaskModalOpen: false
        };
    }

    componentWillMount() {
        const {gigId} = this.props;
        this.setupData(gigId);
    }

    setupData(gigId) {
        retreive(gigId, this.setTasksState.bind(this));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.isAnyPopupClicked(prevState)) {
            const {gigId} = this.props;
            retreive(gigId, this.setTasksState.bind(this));
        }
    }

    isAnyPopupClicked(prevState) {
        return this.state.addTaskModalOpen !== prevState.addTaskModalOpen ||
            this.state.editTaskModalOpen !== prevState.editTaskModalOpen;
    }

    setTasksState(tasks) {
        this.setState({
            tasks: tasks
        })
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
                                editTask={this.openEditTaskPopup.bind(this)}
                                // removeTask={this.removeTask.bind(this)}
                                // assignUsers={this.assignUsers.bind(this)}
                            />
                        )
                    });
                }
            }
        }

        return toReturn;
    }

    openEditTaskPopup(task) {
        this.setState({
            selectedTask: task,
            editTaskModalOpen: true
        })
    }

    openAddTaskPopup() {
        this.setState({
            addTaskModalOpen: true
        })
    }

    hidePopup(popupState) {
        this.setState({
            [popupState + 'ModalOpen']: false
        });
    }

    render() {
        const {gigId, gigRoomId} = this.props;
        const {
            addTaskModalOpen, editTaskModalOpen, tasks,
            selectedTask
        } = this.state;

        return (
            <div>
                <AddTask modalOpen={addTaskModalOpen}
                         hideTask={this.hidePopup.bind(this)}
                         gigRoomId={gigRoomId}
                         gigId={gigId}
                />
                <EditTask modalOpen={editTaskModalOpen}
                          hideTask={this.hidePopup.bind(this)}
                          task={selectedTask}
                />
                {/*<RemoveTask hideTask={this.hidePopup.bind(this)}*/}
                            {/*task={task}*/}
                            {/*gig={gig}*/}
                {/*/>*/}
                {/*<AssignUsers hideTask={this.hidePopup.bind(this)}*/}
                             {/*task={task}*/}
                             {/*gigChannelId={this.state.gig.rc_channel_id._id}*/}
                {/*/>*/}
                <CustomTabs
                    title="Tasks:"
                    headerColor="teal"
                    tabs={this.organizeTabContent(tasks)}
                    addContent={this.openAddTaskPopup.bind(this)}
                />
            </div>
        );
    }
}

export default GigTasksView;