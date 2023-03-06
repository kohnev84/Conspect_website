import React from 'react'
import axios, { post } from 'axios';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;

// Убираем стандартную автоматическую загрузку формы загрузки antd
// const props = {
//   name: 'file',
//   multiple: true,
//   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   onDrop(e) {
//     console.log('Dropped files', e.dataTransfer.files);
//   },
// };


class SimpleReactFileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }
    onFormSubmit(e) {
        console.log('this.state.file', this.state.file)
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file)
            .then((response) => {
                console.log(response.data);
            })
    }
    onChange(e) {
        // console.log(e.file, e.fileList);
        // console.log({ file: e });
        this.setState({ file: e.file })
    }
    async fileUpload(file) {
        const url = 'http://localhost:5500/upload';
        const formData = new FormData();
        // file.name = 'filedata'
        console.log(file);
        formData.append('avatar', file)
        formData.append('some', 3456)
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }
        return axios.post(url, formData, config)
        // const formData = new FormData();
        // // file.name = 'filedata'
        // // console.log(file);
        // formData.append('avatar', file)
        // const reqSaveUsers = await fetch(
        //     'http://localhost:5500/upload',
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //         method: 'POST',
        //         body: formData,
        //         file: formData
        //     });
        // const resultSaveUsers = await reqSaveUsers.json();
        // console.log(resultSaveUsers)
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <h1>File Upload</h1>
                <input type="file" name="avatar" onChange={this.onChange} />
                <Dragger onChange={this.onChange} beforeUpload={() => { return false }} maxCount={1}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>
                </Dragger>

                <button type="submit">Загрузка с компонентом antd</button>
            </form>
        )
    }
}



export default SimpleReactFileUpload