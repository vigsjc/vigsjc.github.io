var NOT_EXIST = 'https://vigsjc.github.io/404.html';
var capstoneData;
(function ($, document) {

    var Student = function (id, fName, lName, profilePicture, title, description, keywords, certificate, images, presentation, video, brochure, contact) {
        this.id = id;
        this.fName = fName;
        this.lName = lName;
        this.profilePicture = profilePicture;
        this.title = title;
        this.description = description;
        this.keywords = keywords;
        this.certificate = certificate;
        this.images = images;
        this.presentation = presentation;
        this.video = video;
        this.brochure = brochure;
        this.contact = contact;
    }

    function getUrlData() {
        var dynamicData = {};
        return $.ajax({
            url: "https://vigsjc.github.io/data/2020.json",
            type: "get",
            data: dynamicData
        });
    }
    $(function () {
        getUrlData().done(function (data, status) {
            if (status == 'success') {
                //creates student profile and project 
                createMain(data.studentData)
                capstoneData = data.studentData;

                //creates the remaining content of the page
                createRemaining(data.other);
            } else {
                console.log('Something went wrong, data is corrupt');
                $(".container").text('Something went wrong, page not found');
            }
        });
    });



    /*
    function to build student project section, includes student profile, project
    
    */
    function createMain(studentData) {
        $.each(studentData, function (index, value) {
            var keywords, presentation, video, brochure, contact;
            var images = [];

            value.images.forEach(function (item) {
                if (item != null) {
                    images.push(item);
                }
            })

            //get keywords
            keywords = value.keywords.split(',')

            //check for valid presentation, video, brochure, contact
            //handles bottom 66-95 line with separate function - note to self
            value.presentation != null ?
                presentation = {
                    'link': value.presentation,
                    'status': ''
                } :
                presentation = {
                    'link': NOT_EXIST,
                    'status': 'disabled'
                }

            value.video.filter(x => { return x }).length > 0 ?
                video = {
                    'link': value.video,
                    'color': '#394867'
                } :
                video = null;

            value.brochure != null ?
                brochure = {
                    'link': value.brochure,
                    'status': ''
                } :
                brochure = {
                    'link': NOT_EXIST,
                    'status': 'disabled'
                }

            value.contact != null ?
                contact = value.contact :
                contact = NOT_EXIST


            var student = new Student(value.id, value.firstName, value.lastName, value.profilePicture, value.projectTitle, value.projectDesc, keywords, value.certificates, images, presentation, video, brochure, contact);

            //creates student profile and project 
            createMainElements(student);
        });
    }

    //handles creating each students project and personal info data
    function createMainElements(element) {
        /*
          bigger screen left and right box
          wrapper = for every student
        */
        var left = $("<div/>", { class: "left" });
        var right = $("<div/>", { class: "right" });
        var wrapper = $("<div>", { id: "wrapper" });

        //creates student info (name ...), avatar
        var stuProfile = $('<div>', { class: 'student_profile', id: `${element.fName}${element.lName}` });
        var stuDetails = $("<div>", { id: "details" });
        stuDetails.append(`<img src=${element.profilePicture} alt="${element.fName} ${element.lName}'s image" loading="lazy">`)
        stuDetails.append($("<a>").text(element.fName + ' ' + element.lName))
        stuProfile.append(stuDetails);

        //creates student contact button (linkedin or email)
        var contactInfo = $("<div>", { class: 'contact_me', });
        var contactIcon = "fa fa-linkedin";
        var address = element.contact
        if (address.includes('@')) {
            address = 'mailto:' + element.contact;
            contactIcon = "fa fa-envelope";
        }
        contactInfo.append(`<a href=${address}><i class='${contactIcon}' aria-hidden='true'></i></a>`)
        stuProfile.append(contactInfo);
        //creates student project images and image buttons
        var stuProject = $("<div>", { class: "project_visuals" });
        var projImages = $("<div>", { class: "images", id: '' + element.id });
        projImages.append($("<img>", { src: element.images[0], id: `proj_img_${element.id}_0`, alt: `${element.title} image`, loading: 'lazy' }));
        stuProject.append(projImages);

        //creates next and prev button for project images 
        var btns = 2; // 0 = previous, 1 = next
        var value = '&#8250';
        var button = 'previous';
        buttons = $("<div>", { class: "buttons", id: '' + element.id });
        for (var i = 0; i < btns; i++) {
            if (i == 1) {
                value = "&#8250";
                button = 'next'
            } else {
                value = "&#8249";
                button = "previous"
            }
            buttons.append('<input type="button" id="' + button + '_button" value="' + value + '"/>');
        }
        if (element.images.length > 1) stuProject.append(buttons);
        //creates student certificates shown below student project image
        var certificates = $("<div/>", { class: 'certificates' });
        if (element.certificate != null) {
            certificates.append("<i class='fa fa-certificate' aria-hidden='true'></i>")
            for (var key in element.certificate) {
                certificates.append(`<a href='${element.certificate[key]}'>${key}</a>`)
            }
            stuProject.append(certificates);
        }

        //creates project title, description, keywords, 
        var projDetails = $('<div>', { class: 'project_details' });
        var projTitle = $("<div>", { class: 'title' }).append($("<span>", { class: "title" }).text(element.title));
        var projResources = $('<div>', { class: 'keys' });
        var keys = $('<div>', { class: 'keywords' });
        for (i in element.keywords) {
            keys.append(`<span class='chip'>${element.keywords[i]}</span>`);
        }

        //creates resource button=> presentation, brochure, video
        var reso = $('<div>', { class: 'resources' })
            .append(`<button class='res-box' ${element.brochure.status} onclick="location.href='${element.brochure.link}'">Brochure</button>`)
            .append(`<button class='res-box' ${element.presentation.status} onclick="location.href='${element.presentation.link}'">Presentation</button>`)

        //show only 1 video button is there is less than 2 video link available
        if (element.video == null) {
            reso.append("<button class='res-box' disabled>Video </button");
        } else if (element.video.link.filter(x => {
            return x
        }).length > 1) {
            reso.append(`<button class='res-box' onclick="location.href='${element.video.link[0]}'">Video 1</button>`);
            reso.append(`<button class='res-box' onclick="location.href='${element.video.link[1]}'">Video 2</button>`);
        } else {
            reso.append(`<button class='res-box' onclick="location.href='${element.video.link[0]}'">Video</button>`);
        }

        projResources.append(projTitle);
        projResources.append(keys);
        projDetails.append(projResources);
        projDetails.append($("<p>", { class: "desc" }).text(element.description));
        right.append(projDetails);
        right.append(reso);
        left.append(stuProfile);
        left.append(stuProject);
        wrapper.append(left);
        wrapper.append(right);

        $(".container").append(wrapper);
    }
    //creates bottom page elements (class photos, outstanding section, presenter section, graduate assistant section)
    function createRemaining(data) {

        var stuRecognition = $("<div>", {
            class: "student-recognition"
        });
        stuRecognition.append('<p>Student Recognition</p>')

        var otherPhoto = $("<div>", {
            id: "other-photos"
        });

        createRemainingElements(data.classPhoto, otherPhoto)
        createRemainingElements(data.outstanding, otherPhoto)
        createRemainingElements(data.presenter, otherPhoto)
        createRemainingElements(data.ga, otherPhoto)

        stuRecognition.append(otherPhoto)
        $(".container").append(stuRecognition);

    }
    function createRemainingElements(data, container) {
        for (i in data) {
            var img_container = $("<div/>", {
                class: "img-container"
            })
            img_container.append(`<img src="${data[i].url}" alt="A class picture containing ${data[i].name}" loading="lazy"/> <p>${data[i].title}</p><p class="left-to-right">${data[i].name}</p>`)
            container.append(img_container)
        }

    }

    //handles previous button click
    $(document).on("click", "#previous_button", function () {
        var id = $(this).parent().attr('id');
        nextORprev('prev', id);
    });

    //handles next button click 
    $(document).on("click", "#next_button", function () {
        var id = $(this).parent().attr('id');
        nextORprev('next', id);
    });

    /*
    this function handles image next and prev buttons
    images = find the id which represents which student => get all images using the id from array(contains every student data)
    img_id = find current image id so it can be updated when looping to another image
    */
    function nextORprev(button, id) {
        var images = capstoneData.find(stu => stu.id == id)['images'];
        var imgId = $(`#${id}.images`).find('img').attr('id');
        var imgIndex = imgId.substring(imgId.lastIndexOf('_') + 1);

        //find valid images from the length, most were just placeholders with 'null'
        var imgLength = images.filter(Boolean).length;

        var currentIndex = parseInt(imgIndex);

        if (button == ('prev')) {
            if (currentIndex > 0) {
                currentIndex = currentIndex - 1;
            } else {
                currentIndex = imgLength - 1;
            }
        } else {
            if (currentIndex > imgLength - 2) {
                currentIndex = 0;
            } else {
                currentIndex = currentIndex + 1;
            }
        }

        var newId = imgId.substring(0, imgId.lastIndexOf('_'));
        if (images[currentIndex] != "") {
            $(`#${imgId}`).attr('src', `${images[currentIndex]}`, 'alt', 'Student\'s project image', 'loading', 'lazy');
        } else {
            $(`#${imgId}`).attr('src', `${image_not_found}`);
        }
        $(`#${imgId}`).attr('id', `${newId}_${currentIndex}`);
    }

    //makes nav bar responsive (mainly down arrow next to year menu)
    $(document).on("click", "#navButton", function () {
        var element = $("#myTopnav");
        if (element.attr('class') === "topnav") {
            element.addClass('topnav responsive');
        } else {
            element.attr('class', 'topnav');
        }
    });

    //handles year menu when clicked
    $(document).on("click", ".dropbtn", function() {
        document.getElementById("myDropdown").classList.toggle("show");
    });
    
}(window.jQuery, document));
