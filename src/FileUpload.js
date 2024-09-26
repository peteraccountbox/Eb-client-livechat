// Function to handle file upload
export default function uploadFile(getRequest, setStatus, callback) {

  // Dynamically create the file input element
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';

  // Trigger the file input click
  fileInput.click();

  // Handle file input change (when a file is selected)
  fileInput.addEventListener('change', function (event) {

    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Call uploadFile and provide a callback function
      setStatus("uploading");
      upload(file);
    }
    document.body.removeChild(fileInput);


  });

  function upload(file) {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('url', file.name);

    const uploadUrl = "api/ecommerce/jsclient/upload-file";

    const req = getRequest(uploadUrl, formData, {
      'Content-Type': 'multipart/form-data',
      // Authorization: API_KEY,
    });

    req.then((response) => {
      console.log(response);

      if (callback) callback("success", response.data);

      console.log('File uploaded successfully:', response.data);

      // Remove the file input element after upload
      // callback(data); // Execute the callback with the response data

    })
      .catch((error) => {

        if (callback) callback("fail", JSON.stringify(error));

        console.log('Error uploading file:', error);

      });

  }

}