export const cleanupPostsTimestamps = () => {
    document.querySelectorAll(".post-body .created-at").forEach((el) => {
        el.innerHTML = el.innerHTML.replace(/less than|posted|about/g,"")
    });
}
export const renameLeaveButton = () => {
    if (document.querySelector("a.leave-button"))
        document.querySelector("a.leave-button").innerHTML="Leave Discussion"
}

