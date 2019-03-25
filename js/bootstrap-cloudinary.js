/**
 * @description a javascript functionality which helps you to accelerate the integration of Cloudinary in your Bootstrap project.
 * Functionality ready to use, just remember to setup your constant of cloudName and unsignedUploadPreset in the index.html
 * @author Ali Adame
 * @version 0.1
 * @date 24-03-2019
 * **/
const javascriptDebugging = false;
	
// Handle selected files
var handleFiles = function(files) {
	for (var i = 0; i < files.length; i++) {
		uploadFile(files[i]); // call the function to upload the file
	}
};
	
function uploadFile(file) {
	var url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
	var xhr = new XMLHttpRequest();
	var fd = new FormData();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	// Reset the upload progress bar
	document.getElementById('progress').style.width = 0;

	// Update progress (can be used to show progress indicator)
	xhr.upload.addEventListener("progress", function(e) {
		var progress = Math.round((e.loaded * 100.0) / e.total);
		document.getElementById('progress').style.width = progress + "%";

		if(javascriptDebugging) {
			console.log(`fileuploadprogress data.loaded: ${e.loaded}, data.total: ${e.total}`);
		}
	});

	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			// File uploaded successfully
			var response = JSON.parse(xhr.responseText);
			var url = response.secure_url;
			if(javascriptDebugging) {
				console.log("Loaded url: " + url);
			}
			if(typeof url != 'undefined') {
				$("#cloudinaryLoadedImg").val(url);
			}

			var ext = url.split('.');
			debugger;
			var imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
			if(javascriptDebugging) {
				console.log("Upload was image file: " + imageReg.test(url));
			}
			if(imageReg.test(url)) {
				ext = ext[(ext.length-1)];
				// Create a thumbnail of the uploaded image, with 150px width
				var tokens = url.split('/');
				tokens.splice(-2, 0, 'w_150,c_scale');
				var img = new Image(); // HTML5 Constructor
				img.src = tokens.join('/');
				img.alt = response.public_id;
				document.getElementById('galleryFileUpload').appendChild(img);
			} else {
				// Create a link of the uploaded file
				var a = document.createElement('a');
				var linkText = document.createTextNode(url.substring(0, 40).concat("..."));
				a.appendChild(linkText);
				a.title = url;
				a.href = url;
				a.target = "_blank";
				document.getElementById('galleryFileUpload').appendChild(a);
			}
		}
	};

	fd.append('upload_preset', unsignedUploadPreset);
	fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
	fd.append('file', file);
	xhr.send(fd);
}
	
function doDrop(event) {
	var dt = event.dataTransfer;
	var files = dt.files;
	handleFiles(files);
}

/**
 * @description a javascript function to call a boostrap modal, designed to start uploads via cloudinary
 * @author Ali Adame
 * @version 0.1
 * @param String title, visible title in the modal.
 * @param String titleBtnCancel, text to show in the button that cancels the modal (modal hide).
 * @param String supportText, text to display in modal to help with instructions to the user about how to upload.
 * @param String manualHelperName, title in the button of the Select Assistant to upload files.
 * @return void, will display the modal
 * @date 24-03-2019
 * **/
function cloudinayModal(title, titleBtnCancel, supportText, manualHelperName) {
	
	// Creates modal
  	var cloudinayModal = $('<div class="modal fade" id="modal_confirm" tabindex="-1" role="dialog" aria-labelledby="modalCloudinary" aria-hidden="true">' +
  				'<div class="modal-dialog">'+
      				'<div class="modal-content">'+
          				'<div class="modal-header">' +
							'<h4 class="modal-title" id="modalCloudinary" >' + title +'</h4>' +
							'<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>' +
						'</div>' +
						'<div class="modal-body">' +
							'<div class="row">' +
								'<input type="hidden" id="cloudinaryLoadedImg">' +
								'<div class="col-sm-12 col-md-12 col-lg-12">' +
									'<div id="dropboxFileUpload" ondragenter="event.stopPropagation(); event.preventDefault();" ondragover="event.stopPropagation(); event.preventDefault();" ondrop="event.stopPropagation(); event.preventDefault(); doDrop(event);" class="">' +
										'<form class="my-form">' +
											'<div class="form_line">' +
												'<h4>' + supportText + '</h4>' +
												'<div class="form_controls">' +
													'<div class="upload_button_holder">' +
														'<input type="file" id="fileElem" multiple accept="image/*" style="display:none" onchange="handleFiles(this.files)">' +
														'<button id="fileSelect" type="button" class="btn btn-md btn-primary">' + manualHelperName + '</button>' +
													'</div>' +
												'</div>' +
											'</div>' +
										'</form>' +
										'<div class="progress-bar" id="progress-bar">' +
											'<div class="progress" id="progress"></div>' +
										'</div>' +
										'<div id="galleryFileUpload" ></div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="modal-footer">' +
							'<button type="button" data-dismiss="modal" class="btn">' + titleBtnCancel + '</button>' +
						'</div>' +
					'</div>'+//modal content
				'</div>' +//modal dialog
			'</div>');//modal
    cloudinayModal.modal('show');
	
	// Drag, drop and other actions over file select
	$(document).on("click","#fileSelect",function(e) {
		if ($("#fileElem").length) {
			$("#fileElem").click();
		}
		e.preventDefault(); // prevent navigation to "#"
	});
}