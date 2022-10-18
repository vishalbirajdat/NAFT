import Dropzone from 'react-dropzone-uploader'
const Uploadfile = () => {

    const handleChangeStatus = ({ meta, remove }, status) => {

        console.log("status : ", status);
        console.log("meta : ", meta);
        // console.log("remove : ", remove);
        // if (status === 'headers_received') {
        //     toast(`${meta.name} uploaded!`)
        //     remove()
        // } else if (status === 'aborted') {
        //     toast(`${meta.name}, upload failed...`)
        // }
    }

    return (
        <Dropzone
            onChangeStatus={handleChangeStatus}
            maxFiles={1}
            multiple={false}
            canCancel={false}
            inputContent="Drop A File"
            styles={{
                dropzone: { width: 400, height: 200 },
                dropzoneActive: { borderColor: 'green' },
            }}
        />
    )
}


export default Uploadfile;


