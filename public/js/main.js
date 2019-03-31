// JS FOR MODALS

// When "new comment" button is clicked
$(document).on("click", ".write-btn", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Activate modal with clear inputs
    $("#commentTitle").val("")
    $("#commentBody").val("")
    $("#newCommentModal").addClass("is-active")
    // when save-btn clicked...
    $(".save-btn").click(function () {
        // Run a POST request to add the comment, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from input
                title: $("#commentTitle").val(),
                // Value taken from textarea
                body: $("#commentBody").val()
            }
        })
            // With that done
            .then(function (data) {
                // change modal
                $("#newCommentModal").removeClass("is-active")
                $("#successModal").addClass("is-active")
            });
    });

});

// When "read comments" button is clicked
$(document).on("click", ".read-btn", function () {
    // Save the article id
    var artId = $(this).attr("data-id");

    // Ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + artId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // Activate modal
            $("#allCommentsModal").addClass("is-active")
            // If there're no comments
            if (data.comment.length === 0) {
                // Place the title of the note in the title input
                $("#commentsBody").text("No comments at this time")
            } else {
                $("#commentsBody").text("")
                data.comment.map((comment) =>
                    $("#commentsBody").append(`<br/><h4 class="subtitle">Title: ${comment.title}<h4>`).append(`<p>Comment: ${comment.body}<p>`)
                )
            }
        });
});

//  closes modals
$(document).on("click", ".close", function () {
    $(".modal").removeClass("is-active");
});
