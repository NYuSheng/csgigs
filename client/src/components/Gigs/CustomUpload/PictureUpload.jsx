import React from "react";
import defaultImage from "assets/img/default-avatar1.png";

class PictureUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            imagePreviewUrl: defaultImage
        };
    }

    componentWillMount() {
        const {existingPhoto} = this.props;
        if (existingPhoto) {
            this.setState({
                imagePreviewUrl: existingPhoto
            })
        }
    }

    resetPhoto(photo){
        this.setState({
            file: null,
            imagePreviewUrl: photo ? photo : defaultImage
        })
    }

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            let base64File = reader.result;

            this.setState({
                file: file,
                imagePreviewUrl: base64File
            });
            const {onFileChange} = this.props;
            onFileChange(base64File);
        };
        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div className="picture-container">
                <div className="picture">
                    <img
                        src={this.state.imagePreviewUrl}
                        className="picture-src"
                        alt="..."
                    />
                    <input type="file" onChange={e => this.handleImageChange(e)}/>
                </div>
                <h6 className="description">Choose Picture</h6>
            </div>
        );
    }
}

export default PictureUpload;
